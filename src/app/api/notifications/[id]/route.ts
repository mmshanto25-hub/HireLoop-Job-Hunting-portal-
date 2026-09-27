import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    store.markNotificationAsRead(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
