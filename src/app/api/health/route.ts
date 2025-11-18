import { NextRequest, NextResponse } from 'next/server';
import { healthCheck, readinessCheck, metrics } from '../../../lib/controllers/healthController';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (type === 'ready') {
    return readinessCheck(request);
  } else if (type === 'metrics') {
    return metrics(request);
  }

  return healthCheck(request);
}