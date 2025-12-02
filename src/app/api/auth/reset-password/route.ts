import { resetPassword } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return resetPassword(request);
}