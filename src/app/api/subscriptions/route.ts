import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ subscription: user.subscription });
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, billingInterval = 'monthly' } = await req.json();

    // Determine price
    let amount = 0;
    if (user.role === 'SEEKER') {
      if (plan === 'pro') amount = billingInterval === 'yearly' ? 180 : 19;
      if (plan === 'premium') amount = billingInterval === 'yearly' ? 370 : 39;
    } else {
      if (plan === 'growth') amount = billingInterval === 'yearly' ? 470 : 49;
      if (plan === 'enterprise') amount = billingInterval === 'yearly' ? 1430 : 149;
    }

    // Process payment record
    const payment = store.createPayment({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      plan: `${plan.charAt(0).toUpperCase() + plan.slice(1)} (${billingInterval})`,
      role: user.role,
      amount,
      currency: 'USD',
      stripePaymentId: `pi_test_${Math.floor(100000000 + Math.random() * 900000000)}`,
      status: 'succeeded',
    });

    const updatedUser = store.getUserById(user.id);
    return NextResponse.json({
      success: true,
      user: updatedUser,
      payment,
      message: `Successfully upgraded to ${plan.toUpperCase()}!`,
    });
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
