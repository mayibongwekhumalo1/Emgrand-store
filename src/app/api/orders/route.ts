import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getAllOrders } from '../../../lib/controllers/orderController';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('admin') === 'all') {
    return getAllOrders(request);
  }
  return getOrders(request);
}

export async function POST(request: NextRequest) {
  return createOrder(request);
}