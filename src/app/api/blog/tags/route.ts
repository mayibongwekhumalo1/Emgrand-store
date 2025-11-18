import { NextRequest, NextResponse } from 'next/server';
import { getBlogTags } from '../../../../lib/controllers/blogController';

export async function GET(request: NextRequest) {
  return getBlogTags(request);
}