import { NextRequest, NextResponse } from 'next/server';
import { detailedHealthCheck } from '../../../../lib/controllers/healthController';

export async function GET(request: NextRequest) {
  return detailedHealthCheck(request);
}