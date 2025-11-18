import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '../../../../../lib/controllers/orderController';

export async function POST(request: NextRequest) {
  return handleStripeWebhook(request);
}