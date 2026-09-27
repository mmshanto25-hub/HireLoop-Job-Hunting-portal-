import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = store.getCompanyById(id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const activeJobs = store.getJobs().filter(
      (j) => j.companyId === company.id && j.status === 'active'
    );

    return NextResponse.json({ company, jobs: activeJobs });
  } catch (error) {
    console.error('Company GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
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
    const company = store.getCompanyById(id);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && company.recruiterId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await req.json();
    const updated = store.updateCompany(id, updates);
    return NextResponse.json({ company: updated });
  } catch (error) {
    console.error('Company PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
