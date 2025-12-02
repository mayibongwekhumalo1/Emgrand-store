import { forgotPassword } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return forgotPassword(request);
}