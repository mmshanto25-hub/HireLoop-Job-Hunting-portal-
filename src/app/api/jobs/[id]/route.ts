import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = store.getJobById(id);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Increment views
    store.updateJob(id, { viewsCount: (job.viewsCount || 0) + 1 });

    const company = store.getCompanyById(job.companyId);
    const similarJobs = store
      .getJobs()
      .filter((j) => j.id !== job.id && (j.category === job.category || j.companyId === job.companyId))
      .slice(0, 6);

    return NextResponse.json({ job, company, similarJobs });
  } catch (error) {
    console.error('Job GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

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
    const job = store.getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && job.recruiterId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await req.json();
    const updated = store.updateJob(id, updates);
    return NextResponse.json({ job: updated });
  } catch (error) {
    console.error('Job PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const job = store.getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && job.recruiterId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    store.deleteJob(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
