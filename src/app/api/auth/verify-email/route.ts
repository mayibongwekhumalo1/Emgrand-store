import { verifyEmail } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return verifyEmail(request);
}