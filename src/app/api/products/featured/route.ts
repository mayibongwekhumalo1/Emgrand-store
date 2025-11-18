import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedProducts } from '../../../../lib/controllers/productController';

export async function GET(request: NextRequest) {
  return getFeaturedProducts(request);
}