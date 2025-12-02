import { resendVerification } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return resendVerification(request);
}