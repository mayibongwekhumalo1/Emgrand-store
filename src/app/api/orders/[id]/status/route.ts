import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '../../../../../lib/controllers/orderController';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateOrderStatus(request, { params: { id } });
}