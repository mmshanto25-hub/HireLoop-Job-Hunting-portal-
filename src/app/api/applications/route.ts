import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (user.role === 'ADMIN') {
      const apps = jobId ? store.getApplicationsByJob(jobId) : store.getApplications();
      return NextResponse.json({ applications: apps });
    }

    if (user.role === 'RECRUITER') {
      if (jobId) {
        const apps = store.getApplicationsByJob(jobId);
        return NextResponse.json({ applications: apps });
      }
      // Return all applications for recruiter's jobs
      const recruiterJobs = store.getJobs().filter((j) => j.recruiterId === user.id);
      const jobIds = new Set(recruiterJobs.map((j) => j.id));
      const apps = store.getApplications().filter((a) => jobIds.has(a.jobId));
      return NextResponse.json({ applications: apps });
    }

    // Seeker: return only their applications
    const apps = store.getApplicationsBySeeker(user.id);
    return NextResponse.json({ applications: apps });
  } catch (error) {
    console.error('Applications GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to apply for this job' }, { status: 401 });
    }

    if (user.role !== 'SEEKER') {
      return NextResponse.json({ error: 'Only job seekers can apply for jobs' }, { status: 403 });
    }

    // Check application limit on free / pro plans
    const used = user.subscription?.applicationsUsed || 0;
    const limit = user.subscription?.applicationsLimit || 3;
    if (used >= limit) {
      return NextResponse.json(
        {
          error: `You have reached your monthly application limit of ${limit} applications on the ${user.subscription.plan.toUpperCase()} plan. Please upgrade to Pro or Premium to apply to more jobs.`,
          limitReached: true,
        },
        { status: 402 }
      );
    }

    const { jobId, resumeUrl, resumeFileName, coverLetter } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const job = store.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if already applied
    const existing = store
      .getApplicationsBySeeker(user.id)
      .find((a) => a.jobId === jobId);

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted an application for this role.' },
        { status: 409 }
      );
    }

    const newApplication = store.createApplication({
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      seekerId: user.id,
      seekerName: user.name,
      seekerEmail: user.email,
      seekerAvatar: user.avatar,
      seekerHeadline: user.headline,
      resumeUrl: resumeUrl || user.resumeUrl || '/sample-resumes/sarah-lin-resume.pdf',
      resumeFileName: resumeFileName || user.resumeFileName || `${user.name.replace(/\s+/g, '_')}_Resume.pdf`,
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    return NextResponse.json({ application: newApplication }, { status: 201 });
  } catch (error) {
    console.error('Applications POST error:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
