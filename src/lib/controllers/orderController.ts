import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import User from '../models/User';
import connectDB from '../database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || '',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || ''
});

export const createOrder = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const {
      shippingAddress,
      billingAddress,
      paymentMethod = 'cod'
    } = body;

    // Get user's cart
    const cart = await Cart.findOne({ user: 'guest' })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Check inventory for all items
    for (const item of cart.items) {
      const product = item.product as any;
      if (product.inventory.quantity < item.quantity) {
        return NextResponse.json({
          message: `Insufficient inventory for ${product.name}`
        }, { status: 400 });
      }
    }

    // Calculate totals
    const subtotal = cart.totalPrice;
    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const totalAmount = subtotal + tax + shippingCost;

    // Create order
    const order = new Order({
      user: 'guest',
      items: cart.items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingCost,
      totalAmount,
      orderStatus: 'pending'
    });

    // Handle payment based on method
    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: (order._id as any).toString(),
          userId: 'guest'
        }
      });

      order.paymentIntentId = paymentIntent.id;
      order.paymentStatus = 'pending';
    } else if (paymentMethod === 'paypal') {
      // PayPal payment creation would go here
      // For now, we'll mark as pending
      order.paymentStatus = 'pending';
    } else if (paymentMethod === 'cod') {
      order.paymentStatus = 'pending';
    }

    await order.save();

    // Clear cart after successful order creation
    await Cart.findOneAndUpdate(
      { user: 'guest' },
      { items: [], totalPrice: 0, itemCount: 0 }
    );

    // Update inventory
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { 'inventory.quantity': -item.quantity } }
      );
    }

    return NextResponse.json({
      message: 'Order created successfully',
      order,
      paymentIntent: paymentMethod === 'stripe' ? {
        clientSecret: (await stripe.paymentIntents.retrieve(order.paymentIntentId!)).client_secret
      } : null
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getOrders = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: 'guest' })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: 'guest' });

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getOrder = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const order = await Order.findOne({
      _id: params.id,
      user: 'guest'
    }).populate('items.product', 'name images price');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const updateOrderStatus = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    await connectDB();
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid order status' }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      {
        orderStatus: status,
        ...(status === 'shipped' && { trackingNumber: body.trackingNumber })
      },
      { new: true }
    ).populate('items.product', 'name images');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Admin functions
export const getAllOrders = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const status = searchParams.get('status');

    const filter: any = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    return NextResponse.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.text();
    const sig = request.headers.get('stripe-signature') as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { paymentStatus: 'paid' }
        );
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await Order.findOneAndUpdate(
          { paymentIntentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};