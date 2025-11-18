import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '../../../../lib/controllers/productController';

export async function GET(request: NextRequest) {
  return searchProducts(request);
}