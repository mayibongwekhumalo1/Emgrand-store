import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeFromNewsletter } from '../../../../lib/controllers/newsletterController';

export async function POST(request: NextRequest) {
  return unsubscribeFromNewsletter(request);
}