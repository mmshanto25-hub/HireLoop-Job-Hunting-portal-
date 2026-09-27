import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry') || '';
    const search = searchParams.get('search')?.toLowerCase() || '';
    const user = await getCurrentUser();

    let companies = store.getCompanies();

    // Regular public users only see approved companies
    if (!user || user.role !== 'ADMIN') {
      companies = companies.filter((c) => c.status === 'approved');
    }

    if (industry && industry !== 'All Industries') {
      companies = companies.filter((c) => c.industry.toLowerCase() === industry.toLowerCase());
    }

    if (search) {
      companies = companies.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search) ||
          c.location.toLowerCase().includes(search)
      );
    }

    // Populate active job count for each company
    const enriched = companies.map((c) => {
      const activeJobs = store.getJobs().filter((j) => j.companyId === c.id && j.status === 'active');
      return {
        ...c,
        openJobsCount: activeJobs.length,
      };
    });

    return NextResponse.json({ companies: enriched });
  } catch (error) {
    console.error('Companies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Recruiter or Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, logo, industry, website, location, employeeCount, description, benefits } = body;

    if (!name || !industry || !website || !description) {
      return NextResponse.json({ error: 'Missing required company fields' }, { status: 400 });
    }

    const newCompany = store.createCompany({
      name,
      logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop',
      industry,
      website,
      location: location || 'Remote',
      employeeCount: employeeCount || '10-50',
      description,
      recruiterId: user.id,
      status: user.role === 'ADMIN' ? 'approved' : 'pending', // Pending approval by admin
      benefits: Array.isArray(benefits) ? benefits : ['Flexible Work', 'Health Benefits', 'Tech Allowance'],
      openJobsCount: 0,
      featured: false,
    });

    // Link company to user
    store.updateUser(user.id, { companyId: newCompany.id });

    // Notify admins
    const admins = store.getUsers().filter((u) => u.role === 'ADMIN');
    for (const admin of admins) {
      store.createNotification({
        userId: admin.id,
        title: 'New Company Pending Approval',
        message: `${newCompany.name} was registered by ${user.name} and is awaiting approval.`,
        type: 'company_approval',
        link: '/dashboard/admin/companies',
        read: false,
      });
    }

    return NextResponse.json({ company: newCompany }, { status: 201 });
  } catch (error) {
    console.error('Company POST error:', error);
    return NextResponse.json({ error: 'Failed to register company' }, { status: 500 });
  }
}
