import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const app = store.getApplicationById(id);
    if (!app) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const job = store.getJobById(app.jobId);
    if (user.role !== 'ADMIN' && job?.recruiterId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { status, notes } = await req.json();

    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Offered', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid application status' }, { status: 400 });
    }

    const updated = store.updateApplicationStatus(id, status, notes);
    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error('Application status PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update application status' }, { status: 500 });
  }
}
