import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword')?.toLowerCase() || '';
    const location = searchParams.get('location')?.toLowerCase() || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const experience = searchParams.get('experience') || '';
    const remote = searchParams.get('remote');
    const salaryMin = searchParams.get('salaryMin') ? Number(searchParams.get('salaryMin')) : 0;
    const companyId = searchParams.get('companyId') || '';
    const recruiterId = searchParams.get('recruiterId') || '';
    const sort = searchParams.get('sort') || 'recent';

    let jobs = store.getJobs().filter((job) => {
      // Must be active unless recruiter or admin is querying specifically
      if (!recruiterId && job.status !== 'active') return false;

      if (recruiterId && job.recruiterId !== recruiterId) return false;
      if (companyId && job.companyId !== companyId) return false;

      if (keyword) {
        const titleMatch = job.title.toLowerCase().includes(keyword);
        const descMatch = job.description.toLowerCase().includes(keyword);
        const compMatch = job.companyName.toLowerCase().includes(keyword);
        const reqMatch = job.requirements.some((r) => r.toLowerCase().includes(keyword));
        if (!titleMatch && !descMatch && !compMatch && !reqMatch) return false;
      }

      if (location && !job.location.toLowerCase().includes(location)) {
        return false;
      }

      if (category && category !== 'All Categories' && job.category !== category) {
        return false;
      }

      if (type && type !== 'All Types' && job.type !== type) {
        return false;
      }

      if (experience && experience !== 'All Levels' && job.experience !== experience) {
        return false;
      }

      if (remote === 'true' && !job.remote) {
        return false;
      }

      if (salaryMin > 0 && job.salaryMax < salaryMin) {
        return false;
      }

      return true;
    });

    // Sort
    if (sort === 'salary_high') {
      jobs.sort((a, b) => b.salaryMax - a.salaryMax);
    } else if (sort === 'popular') {
      jobs.sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0));
    } else {
      // recent default
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ jobs, total: jobs.length });
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized. Recruiter privileges required.' }, { status: 403 });
    }

    // Check recruiter active job limit
    const existingRecruiterJobs = store.getJobs().filter(
      (j) => j.recruiterId === user.id && j.status === 'active'
    );
    const limit = user.subscription?.activeJobsLimit || 3;
    if (user.role === 'RECRUITER' && existingRecruiterJobs.length >= limit) {
      return NextResponse.json(
        {
          error: `You have reached your active job limit of ${limit} jobs on the ${user.subscription.plan} plan. Please upgrade to post more jobs.`,
          limitReached: true,
        },
        { status: 402 }
      );
    }

    const body = await req.json();
    const {
      title,
      companyId,
      companyName,
      companyLogo,
      companyLocation,
      category,
      type,
      experience,
      salaryMin,
      salaryMax,
      currency = 'USD',
      location,
      remote = false,
      description,
      responsibilities = [],
      requirements = [],
      benefits = [],
      deadline,
    } = body;

    if (!title || !category || !type || !description) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    const company = companyId ? store.getCompanyById(companyId) : store.getCompanies()[0];

    const newJob = store.createJob({
      title,
      companyId: company?.id || 'comp-1',
      companyName: companyName || company?.name || 'Partner Company',
      companyLogo: companyLogo || company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
      companyLocation: companyLocation || company?.location || 'San Francisco, CA',
      recruiterId: user.id,
      category,
      type,
      experience: experience || 'Mid-level',
      salaryMin: Number(salaryMin) || 120000,
      salaryMax: Number(salaryMax) || 160000,
      currency,
      location: location || 'Remote',
      remote: Boolean(remote),
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities],
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      benefits: Array.isArray(benefits) ? benefits : [benefits],
      deadline: deadline || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      featured: false,
    });

    return NextResponse.json({ job: newJob }, { status: 201 });
  } catch (error) {
    console.error('Job POST error:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
