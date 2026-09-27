import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const companies = store.getCompanies();
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Admin companies GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { companyId, status } = await req.json();
    if (!companyId || !status) {
      return NextResponse.json({ error: 'Company ID and status are required' }, { status: 400 });
    }

    const updated = store.updateCompany(companyId, { status });
    if (!updated) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Notify recruiter
    store.createNotification({
      userId: updated.recruiterId,
      title: `Company ${status === 'approved' ? 'Approved! 🎉' : 'Moderation Update'}`,
      message: `Your company ${updated.name} has been ${status} by the platform administrator.`,
      type: 'company_approval',
      link: '/dashboard/recruiter/company',
      read: false,
    });

    return NextResponse.json({ company: updated });
  } catch (error) {
    console.error('Admin company PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}
