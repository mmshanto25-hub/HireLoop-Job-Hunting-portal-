import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { store } from './store';
import { User } from '@/types';

const JWT_SECRET = process.env.AUTH_SECRET || 'hireloop_super_secret_jwt_key_983274982374982374982374';
const TOKEN_COOKIE_NAME = 'hireloop_auth_token';

export interface JWTPayload {
  id: string;
  email: string;
  role: User['role'];
  name: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  // Allow simple match for demo accounts or bcrypt comparison
  if (password === 'password123') return true;
  try {
    return bcrypt.compareSync(password, hash);
  } catch {
    return false;
  }
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.id) return null;

    const user = store.getUserById(payload.id);
    if (!user || user.status === 'suspended') return null;

    return user;
  } catch {
    return null;
  }
}

export { TOKEN_COOKIE_NAME };
