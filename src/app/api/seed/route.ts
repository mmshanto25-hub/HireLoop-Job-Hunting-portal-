import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function POST() {
  try {
    const mongoSuccess = await store.seedMongo();
    return NextResponse.json({
      success: true,
      mongoSynced: mongoSuccess,
      message: 'Seed data successfully loaded with 32 jobs, 15 companies, 20+ users, applications, and payments!',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
