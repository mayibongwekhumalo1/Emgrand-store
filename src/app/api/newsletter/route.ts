import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterSubscriptions } from '../../../lib/controllers/newsletterController';

export async function GET(request: NextRequest) {
  return getNewsletterSubscriptions(request);
}