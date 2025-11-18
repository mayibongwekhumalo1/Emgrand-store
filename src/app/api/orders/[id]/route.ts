import { NextRequest, NextResponse } from 'next/server';
import { getOrder } from '../../../../lib/controllers/orderController';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getOrder(request, { params: { id } });
}