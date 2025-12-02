import { register } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return register(request);
}