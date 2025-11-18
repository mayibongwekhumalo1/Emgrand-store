import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem } from '../../../../lib/controllers/cartController';

export async function PUT(request: NextRequest) {
  return updateCartItem(request);
}