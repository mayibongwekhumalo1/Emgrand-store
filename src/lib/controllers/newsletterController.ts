import { NextRequest, NextResponse } from 'next/server';
import Newsletter from '../models/Newsletter';
import connectDB from '../database';

export const subscribeToNewsletter = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json({ message: 'Email is already subscribed' }, { status: 400 });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        await existingSubscription.save();
        return NextResponse.json({ message: 'Subscription reactivated successfully' });
      }
    }

    // Create new subscription
    const newSubscription = new Newsletter({
      email: email.toLowerCase(),
    });

    await newSubscription.save();

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 201 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const unsubscribeFromNewsletter = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const subscription = await Newsletter.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isActive: false },
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json({ message: 'Subscription not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Successfully unsubscribed from newsletter' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getNewsletterSubscriptions = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const subscriptions = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Newsletter.countDocuments({ isActive: true });

    return NextResponse.json({
      subscriptions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalSubscriptions: total
      }
    });
  } catch (error) {
    console.error('Get newsletter subscriptions error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};