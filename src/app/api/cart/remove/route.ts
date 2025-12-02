import { NextRequest } from 'next/server';
import { removeFromCart } from '../../../../lib/controllers/cartController';

export async function DELETE(request: NextRequest) {
  return removeFromCart(request);
}