import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import User from '../models/User';
import connectDB from '../database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const authenticateRequest = async (request: NextRequest): Promise<{ user: AuthUser | null; error: NextResponse | null }> => {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return { user: null, error: NextResponse.json({ message: 'Access denied. No token provided.' }, { status: 401 }) };
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return { user: null, error: NextResponse.json({ message: 'Server configuration error.' }, { status: 500 }) };
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return { user: null, error: NextResponse.json({ message: 'Token is not valid.' }, { status: 401 }) };
    }

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      },
      error: null
    };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { user: null, error: NextResponse.json({ message: 'Invalid token.' }, { status: 401 }) };
    }
    if (error instanceof jwt.TokenExpiredError) {
      return { user: null, error: NextResponse.json({ message: 'Token has expired.' }, { status: 401 }) };
    }
    console.error('Authentication error:', error);
    return { user: null, error: NextResponse.json({ message: 'Server error during authentication.' }, { status: 500 }) };
  }
};

export const authorizeRequest = (user: AuthUser | null, ...roles: string[]): NextResponse | null => {
  if (!user) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  if (!roles.includes(user.role)) {
    return NextResponse.json({ message: 'Access denied. Insufficient permissions.' }, { status: 403 });
  }

  return null;
};

export const optionalAuthenticateRequest = async (request: NextRequest): Promise<AuthUser | null> => {
  try {
    await connectDB();

    const token = request.headers.get('authorization')?.replace('Bearer ', '');

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return null;
      }

      const decoded = jwt.verify(token, jwtSecret) as any;
      const user = await User.findById(decoded.id);
      if (user) {
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    }

    return null;
  } catch (error) {
    return null;
  }
};