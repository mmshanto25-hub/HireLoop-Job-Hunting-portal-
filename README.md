# HireLoop — Modern Job Hunting & Recruitment Platform

HireLoop is a production-quality, high-velocity recruitment and job marketplace SaaS built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Mongoose / MongoDB**, and **Recharts**.

---

## 🚀 Key Features

### 1. Public Discovery Experience
* **Home Page (`/`)**: Dynamic Hero with keyword & location search, live statistics, category pills, featured listings, how it works, and testimonials.
* **Browse Jobs (`/jobs`)**: Filter by category, employment type, seniority level, remote toggle, and minimum salary slider. List & Grid view toggle with pagination.
* **Job Details (`/jobs/[jobId]`)**: Comprehensive role breakdown with responsibilities, requirements, benefits, salary benchmarks, company spotlight, and 6 similar roles.
* **Interactive Application Modal**: Submit applications with pre-selected profile resume or upload, custom cover note, confirmation, and confetti celebrations.
* **Companies Directory (`/companies`)**: Search and filter by industry and team size.
* **Company Profiles (`/companies/[companyId]`)**: Header banner, active company job postings, mission statement, engineering culture, and benefits breakdown.
* **Pricing (`/pricing`)**: Seeker (Free, Pro, Premium) and Recruiter (Free, Growth, Enterprise) tiers with monthly/annual toggle (20% discount), Stripe simulation, and FAQ accordion.
* **About (`/about`)**: Company story, mission, core values, platform statistics, leadership team, and company roadmap.
* **Resources Hub (`/resources` & `/resources/[slug]`)**: In-depth career, interview prep, compensation negotiation, and recruiter hiring guides.

### 2. Job Seeker Workspace (`/dashboard/seeker`)
* **Overview**: Real-time stats (Saved Jobs, Applications, Interviews, Offers), profile completion score tracker, Recharts pipeline status bar chart, and activity feed.
* **Browse Jobs (`/dashboard/seeker/jobs`)**: In-dashboard job search and application modal.
* **Saved Jobs (`/dashboard/seeker/saved`)**: Manage bookmarked roles with 1-click removal, application trigger, and detail links.
* **My Applications (`/dashboard/seeker/applications`)**: Advanced application tracking table with status badges (`Applied`, `Under Review`, `Shortlisted`, `Offered`, `Rejected`) and candidate dossier modal.
* **Billing & Quotas (`/dashboard/seeker/billing`)**: Quota usage tracker (e.g. 7 / 30 applications used), Stripe upgrade simulation, and transaction invoice table.
* **Settings & Resume (`/dashboard/seeker/settings`)**: Profile info, resume PDF management, technical skills tag manager, and notification preferences.

### 3. Employer & Recruiter Workspace (`/dashboard/recruiter`)
* **Overview**: Requisition statistics (Total, Active, Applicants, Closed), Recharts applicant volume & view conversion trends, recent submissions table, and company verification card.
* **My Company (`/dashboard/recruiter/company`)**: Register or update organization details (logo, website, team size, culture). Moderation status tracking (`Pending`, `Approved`, `Rejected`).
* **Manage Jobs (`/dashboard/recruiter/jobs`)**: Requisition table with quick status toggle (`active` / `closed`), applicant counts, delete, and plan quota tracker (e.g., `4 / 10 active jobs`).
* **Post a Job (`/dashboard/recruiter/jobs/new`)**: Multi-section form with compensation boundaries, requirements, responsibilities, and deadline validation.
* **Edit Job (`/dashboard/recruiter/jobs/[jobId]/edit`)**: Update job details and requirements.
* **Applicant Pipeline (`/dashboard/recruiter/jobs/[jobId]/applicants`)**: Kanban-style status switcher: `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Offered` / `Rejected`. Updating stage immediately dispatches notifications to the candidate!
* **Recruiter Billing (`/dashboard/recruiter/billing`)**: Active job slot tracking, plan upgrade to Growth/Enterprise, and billing history.
* **Recruiter Settings (`/dashboard/recruiter/settings`)**: Personal details, security, and company links.

### 4. Administrator Control Center (`/dashboard/admin`)
* **Overview**: Global platform metrics (Total Users, Recruiters, Companies, Jobs, Revenue), monthly revenue Recharts bar chart, and pending company moderation queue.
* **User Governance (`/dashboard/admin/users`)**: Search users, filter by role and status, promote to Recruiter/Seeker, or enforce account suspension.
* **Company Moderation (`/dashboard/admin/companies`)**: Approve or reject company registrations. Only approved companies appear publicly.
* **Job Moderation (`/dashboard/admin/jobs`)**: Feature top listings on the homepage or remove non-compliant postings.
* **Financial Ledger (`/dashboard/admin/payments`)**: Complete transaction ledger with Stripe payment IDs and relative timestamps.
* **Platform Settings (`/dashboard/admin/settings`)**: Administrator security policies and 1-click database seed button.

---

## 🔑 Demo Quick-Login Accounts

You can test any role instantly using the **1-Click Test Login Buttons** located directly on `/login`, `/register`, or the global navigation:

| Role | Name | Email | Password | Primary Workspace |
| :--- | :--- | :--- | :--- | :--- |
| **Job Seeker** | Sarah Lin | `sarah@example.com` | `password123` | `/dashboard/seeker` |
| **Recruiter** | Marcus Vance | `marcus@stripe.com` | `password123` | `/dashboard/recruiter` |
| **Administrator** | Alexander Wright | `admin@hireloop.io` | `password123` | `/dashboard/admin` |

---

## 🛠️ Technology Stack

* **Framework**: Next.js 16.3.6 (App Router with Turbopack)
* **Language**: TypeScript 5
* **Styling**: Tailwind CSS v4 & custom glassmorphism
* **Icons**: Lucide React
* **Charts**: Recharts
* **Database**: MongoDB & Mongoose (with automatic high-performance in-memory fallback)
* **Authentication**: Secure JWT tokens stored in HTTP-Only cookies with bcryptjs password hashing
* **Billing**: Stripe payment intent simulation and subscription quotas

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` (already pre-configured with safe defaults):
```env
MONGODB_URI=mongodb://localhost:27017/hireloop
AUTH_SECRET=hireloop_super_secret_jwt_key_983274982374982374982374
STRIPE_SECRET_KEY=sk_test_hireloop_mock_stripe_key_sample
STRIPE_PUBLISHABLE_KEY=pk_test_hireloop_mock_stripe_key_sample
STRIPE_WEBHOOK_SECRET=whsec_hireloop_mock_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

*Note: If MongoDB is running locally at `localhost:27017`, HireLoop will automatically connect and persist to it. If MongoDB is offline, HireLoop will seamlessly fall back to its internal in-memory store so you can explore the entire app with zero downtime.*

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
