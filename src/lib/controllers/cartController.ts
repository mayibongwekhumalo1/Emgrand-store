import { NextRequest, NextResponse } from 'next/server';
import Cart from '../models/Cart';
import Product from '../models/Product';
import connectDB from '../database';
import { optionalAuthenticateRequest } from '../middleware/auth';

export const getCart = async (request: NextRequest) => {
  try {
    await connectDB();

    const user = await optionalAuthenticateRequest(request);
    const userId = user ? user.id : 'guest';

    const cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images inventory.quantity')
      .select('-__v');

    if (!cart) {
      return NextResponse.json({
        items: [],
        totalPrice: 0,
        itemCount: 0
      });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const addToCart = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, quantity = 1, selectedAttributes } = body;

    const user = await optionalAuthenticateRequest(request);
    const userId = user ? user.id : 'guest';

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Check inventory
    if (product.inventory.quantity < quantity) {
      return NextResponse.json({ message: 'Insufficient inventory' }, { status: 400 });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
        itemCount: 0
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;

      // Check if new quantity exceeds inventory
      if (cart.items[existingItemIndex].quantity > product.inventory.quantity) {
        return NextResponse.json({ message: 'Insufficient inventory' }, { status: 400 });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        selectedAttributes
      });
    }

    await cart.save();

    // Populate product details
    await cart.populate('items.product', 'name price images inventory.quantity');

    return NextResponse.json({
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const updateCartItem = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, quantity, selectedAttributes } = body;

    if (quantity < 1) {
      return NextResponse.json({ message: 'Quantity must be at least 1' }, { status: 400 });
    }

    const user = await optionalAuthenticateRequest(request);
    const userId = user ? user.id : 'guest';

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
    }

    // Check inventory
    const product = await Product.findById(productId);
    if (!product || quantity > product.inventory.quantity) {
      return NextResponse.json({ message: 'Insufficient inventory' }, { status: 400 });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate('items.product', 'name price images inventory.quantity');

    return NextResponse.json({
      message: 'Cart item updated successfully',
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const removeFromCart = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, selectedAttributes } = body;

    const user = await optionalAuthenticateRequest(request);
    const userId = user ? user.id : 'guest';

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId &&
      JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
    );

    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate('items.product', 'name price images inventory.quantity');

    return NextResponse.json({
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const clearCart = async (request: NextRequest) => {
  try {
    await connectDB();

    const user = await optionalAuthenticateRequest(request);
    const userId = user ? user.id : 'guest';

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalPrice: 0, itemCount: 0 },
      { new: true }
    );

    return NextResponse.json({
      message: 'Cart cleared successfully',
      cart: {
        items: [],
        totalPrice: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};