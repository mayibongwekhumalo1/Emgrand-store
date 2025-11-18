import { NextRequest, NextResponse } from 'next/server';
import { getBlogs, createBlog, getAllBlogsAdmin } from '../../../lib/controllers/blogController';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('admin') === 'all') {
    return getAllBlogsAdmin(request);
  }
  return getBlogs(request);
}

export async function POST(request: NextRequest) {
  return createBlog(request);
}