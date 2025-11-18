import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '../../../../lib/controllers/newsletterController';

export async function POST(request: NextRequest) {
  return subscribeToNewsletter(request);
}