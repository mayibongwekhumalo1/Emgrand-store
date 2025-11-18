import { NextRequest, NextResponse } from 'next/server';
import { getCart, addToCart, clearCart } from '../../../lib/controllers/cartController';

export async function GET(request: NextRequest) {
  return getCart(request);
}

export async function POST(request: NextRequest) {
  return addToCart(request);
}

export async function DELETE(request: NextRequest) {
  return clearCart(request);
}