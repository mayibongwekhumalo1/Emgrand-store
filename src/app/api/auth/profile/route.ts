import { getProfile, updateProfile } from '../../../../lib/controllers/authController';

export async function GET(request: Request) {
  return getProfile(request);
}

export async function PUT(request: Request) {
  return updateProfile(request);
}