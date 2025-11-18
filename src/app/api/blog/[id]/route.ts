import { NextRequest, NextResponse } from 'next/server';
import { getBlog, updateBlog, deleteBlog } from '../../../../lib/controllers/blogController';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getBlog(request, { params: { id } });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateBlog(request, { params: { id } });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteBlog(request, { params: { id } });
}