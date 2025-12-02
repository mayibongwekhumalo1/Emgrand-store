import { login } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return login(request);
}