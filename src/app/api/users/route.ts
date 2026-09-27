import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();
    // Disallow altering security fields directly here
    delete updates.id;
    delete updates.email;
    delete updates.role;
    delete updates.subscription;

    const updated = store.updateUser(user.id, updates);
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('User update PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
