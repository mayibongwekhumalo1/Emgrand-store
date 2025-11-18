import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/controllers/productController';

export async function GET(request: NextRequest) {
  return getProducts(request);
}

export async function POST(request: NextRequest) {
  return createProduct(request);
}