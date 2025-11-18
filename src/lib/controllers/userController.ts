import { NextRequest, NextResponse } from 'next/server';
import User from '../models/User';
import Order from '../models/Order';
import { authenticate, authorize } from '../auth';
import connectDB from '../database';

export const getUsers = async (request: NextRequest) => {
  try {
    await connectDB();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const user = await authenticate(token || '');

    if (!authorize(user, 'admin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getUser = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const authUser = await authenticate(token || '');

    if (!authorize(authUser, 'admin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const user = await User.findById(params.id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const updateUser = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const authUser = await authenticate(token || '');

    if (!authorize(authUser, 'admin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const user = await User.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const deleteUser = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const authUser = await authenticate(token || '');

    if (!authorize(authUser, 'admin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};

export const getUserStats = async (request: NextRequest) => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const authUser = await authenticate(token || '');

    if (!authorize(authUser, 'admin')) {
      return NextResponse.json({ message: 'Access denied' }, { status: 403 });
    }

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' });

    return NextResponse.json({
      userStats: {
        totalUsers,
        activeUsers,
        adminUsers,
        recentUsers
      },
      orderStats: {
        totalOrders,
        pendingOrders,
        completedOrders
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
};