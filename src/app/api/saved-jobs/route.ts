import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedJobs = store.getSavedJobs(user.id);
    return NextResponse.json({ savedJobs });
  } catch (error) {
    console.error('Saved jobs GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to save jobs' }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const result = store.toggleSavedJob(user.id, jobId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Saved jobs POST error:', error);
    return NextResponse.json({ error: 'Failed to update saved job' }, { status: 500 });
  }
}
