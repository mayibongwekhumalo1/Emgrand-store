import { NextRequest, NextResponse } from 'next/server';
import { getBlogCategories } from '../../../../lib/controllers/blogController';

export async function GET(request: NextRequest) {
  return getBlogCategories(request);
}