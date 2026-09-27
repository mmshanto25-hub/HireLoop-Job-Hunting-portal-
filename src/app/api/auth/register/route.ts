import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Role } from '@/types';

export async function POST(req: Request) {
  try {
    const { name, email, role = 'SEEKER' } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const existingUser = store.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const newUser = store.createUser({
      name,
      email,
      role: role as Role,
      avatar: `https://images.unsplash.com/photo-${role === 'RECRUITER' ? '1507003211169-0a1dd7228f2d' : '1494790108377-be9c29b29330'}?w=150&h=150&fit=crop&crop=faces`,
      headline: role === 'RECRUITER' ? 'Recruiting Partner & Talent Specialist' : 'Software Professional',
      bio: `Hello! I am ${name}, excited to be using HireLoop to find exceptional opportunities.`,
      skills: role === 'SEEKER' ? ['JavaScript', 'React', 'Problem Solving'] : ['Talent Acquisition', 'Interviewing'],
      subscription: {
        plan: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        applicationsUsed: 0,
        applicationsLimit: 3,
        activeJobsLimit: 3,
      },
      status: 'active',
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
