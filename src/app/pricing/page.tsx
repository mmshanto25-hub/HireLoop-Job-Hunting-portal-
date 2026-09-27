'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Footer } from '@/components/footer/Footer';
import {
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PricingPage() {
  const { user, refreshUser } = useAuth();
  const [roleTab, setRoleTab] = useState<'seeker' | 'recruiter'>('seeker');
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const discountMultiplier = billingInterval === 'yearly' ? 0.8 : 1;

  const handleSubscribe = async (planKey: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoadingPlan(planKey);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          billingInterval,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || `Successfully upgraded to ${planKey.toUpperCase()}!`);
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        await refreshUser();
      }
    } catch {
      // ignore
    } finally {
      setLoadingPlan(null);
    }
  };

  const seekerPlans = [
    {
      key: 'free',
      name: 'Free Starter',
      price: 0,
      description: 'Ideal for casual job browsing and initial exploratory applications.',
      features: [
        'Apply to 3 jobs / month',
        'Save up to 10 jobs',
        'Standard profile creation',
        'Email job notifications',
        'Community support',
      ],
      cta: 'Current Starter',
      isPopular: false,
    },
    {
      key: 'pro',
      name: 'Seeker Pro',
      price: Math.round(19 * discountMultiplier),
      originalPrice: 19,
      description: 'For active candidates seeking rapid interviews at top companies.',
      features: [
        'Apply to 30 jobs / month',
        'Unlimited saved jobs',
        'Full real-time application tracker',
        'Verified salary benchmarks',
        'Direct recruiter read receipts',
        'Standard customer support',
      ],
      cta: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      key: 'premium',
      name: 'Seeker Premium',
      price: Math.round(39 * discountMultiplier),
      originalPrice: 39,
      description: 'Maximum leverage and spotlighting for senior, staff, and lead candidates.',
      features: [
        'Unlimited monthly applications',
        'Unlimited saved jobs',
        'Priority candidate profile boost',
        'Early access to new postings (24h prior)',
        'Personalized salary negotiation guides',
        '1-on-1 resume review pass',
      ],
      cta: 'Get Premium Access',
      isPopular: false,
    },
  ];

  const recruiterPlans = [
    {
      key: 'free',
      name: 'Recruiter Basic',
      price: 0,
      description: 'For startups with occasional or entry-level hiring needs.',
      features: [
        '3 active job postings',
        'Basic candidate management',
        'Standard job board listing',
        'Standard candidate email alerts',
      ],
      cta: 'Start Free',
      isPopular: false,
    },
    {
      key: 'growth',
      name: 'Recruiter Growth',
      price: Math.round(49 * discountMultiplier),
      originalPrice: 49,
      description: 'For growing teams with continuous hiring across multiple disciplines.',
      features: [
        '10 active job postings',
        'Full applicant tracking pipeline',
        'View & application conversion analytics',
        'Custom candidate evaluation notes',
        'Email & chat support',
      ],
      cta: 'Choose Growth',
      isPopular: true,
    },
    {
      key: 'enterprise',
      name: 'Enterprise Talent',
      price: Math.round(149 * discountMultiplier),
      originalPrice: 149,
      description: 'For enterprise talent teams scaling engineering, product, and leadership.',
      features: [
        '50 active job postings',
        'Advanced talent analytics & funnel reports',
        'Featured job spotlighting on homepage',
        'Multi-seat recruiter collaboration',
        'Custom company branding & video headers',
        'Dedicated account manager & 24/7 SLA',
      ],
      cta: 'Go Enterprise',
      isPopular: false,
    },
  ];

  const currentPlans = roleTab === 'seeker' ? seekerPlans : recruiterPlans;

  const faqs = [
    {
      q: 'Can I cancel or switch my subscription at any time?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly through your billing portal. Changes take effect on your next billing date.',
    },
    {
      q: 'How does the 14-day money-back guarantee work?',
      a: 'If you are unsatisfied with your HireLoop Pro, Premium, Growth, or Enterprise plan within the first 14 days, contact our support team and we will issue a full refund, no questions asked.',
    },
    {
      q: 'Do you offer annual discounts?',
      a: 'Yes! Choosing yearly billing gives you an instant 20% discount on all paid Seeker and Recruiter plans.',
    },
    {
      q: 'What happens if I reach my application or active job limit?',
      a: 'If you reach your plan quota, you will be prompted to upgrade to a higher tier. Free seeker quotas reset automatically every 30 days.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      {/* Header */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <Badge variant="cyan">Transparent Pricing</Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Simple, Transparent Plans <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              for Seekers and Employers
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Choose the tier tailored to your career ambitions or talent acquisition velocity. No hidden contracts.
          </p>

          {/* Seeker / Recruiter Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 inline-flex">
              <button
                onClick={() => setRoleTab('seeker')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  roleTab === 'seeker'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Job Seekers
              </button>
              <button
                onClick={() => setRoleTab('recruiter')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  roleTab === 'recruiter'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                For Recruiters & Companies
              </button>
            </div>
          </div>

          {/* Monthly / Yearly Switch */}
          <div className="flex items-center justify-center gap-3 pt-2 text-xs">
            <span className={billingInterval === 'monthly' ? 'text-white font-bold' : 'text-slate-400'}>
              Monthly Billing
            </span>
            <button
              onClick={() =>
                setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')
              }
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                billingInterval === 'yearly' ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  billingInterval === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingInterval === 'yearly' ? 'text-white font-bold' : 'text-slate-400'}>
              Annual Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              Save 20%
            </span>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-white">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentPlans.map((plan) => {
            const isCurrent = user?.subscription?.plan === plan.key;
            return (
              <div
                key={plan.key}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-200 ${
                  plan.isPopular
                    ? 'bg-slate-900 border-2 border-cyan-500 shadow-2xl shadow-cyan-950/40'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    {isCurrent && <Badge variant="success">Current Plan</Badge>}
                  </div>

                  <p className="text-xs text-slate-400 min-h-[36px]">{plan.description}</p>

                  <div className="mt-6 mb-6 flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {billingInterval === 'yearly' ? 'mo, billed annually' : 'month'}
                    </span>
                  </div>

                  {/* Feature list */}
                  <div className="pt-6 border-t border-slate-800/80 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Included in {plan.name}:
                    </p>
                    <ul className="space-y-3">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Button
                    variant={plan.isPopular ? 'gradient' : 'outline'}
                    className="w-full justify-center font-bold"
                    isLoading={loadingPlan === plan.key}
                    disabled={isCurrent}
                    onClick={() => handleSubscribe(plan.key)}
                  >
                    {isCurrent ? 'Current Plan' : plan.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Money back guarantee banner */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="p-3 rounded-full bg-cyan-500/10 text-cyan-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">14-Day Money-Back Guarantee</h4>
            <p className="text-xs text-slate-400">
              Not fully satisfied? Cancel within 14 days for a prompt, unconditional full refund.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-400">
              Everything you need to know about HireLoop billing and plan limits.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
