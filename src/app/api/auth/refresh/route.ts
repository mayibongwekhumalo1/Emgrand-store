import { refreshToken } from '../../../../lib/controllers/authController';

export async function POST(request: Request) {
  return refreshToken(request);
}