export type Role = 'SEEKER' | 'RECRUITER' | 'ADMIN';

export type UserStatus = 'active' | 'suspended';

export interface UserSubscription {
  plan: 'free' | 'pro' | 'premium' | 'growth' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodEnd: string;
  applicationsUsed?: number;
  applicationsLimit?: number;
  activeJobsLimit?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  subscription: UserSubscription;
  status: UserStatus;
  companyId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CompanyStatus = 'pending' | 'approved' | 'rejected';

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  location: string;
  employeeCount: string;
  description: string;
  recruiterId: string;
  status: CompanyStatus;
  benefits: string[];
  culture?: string;
  mission?: string;
  openJobsCount?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
export type ExperienceLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Executive';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyLocation: string;
  recruiterId: string;
  category: string;
  type: JobType;
  experience: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  location: string;
  remote: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
  status: JobStatus;
  featured?: boolean;
  viewsCount?: number;
  applicationsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export type ApplicationStatus = 'Applied' | 'Under Review' | 'Shortlisted' | 'Offered' | 'Rejected';

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  seekerAvatar?: string;
  seekerHeadline?: string;
  resumeUrl: string;
  resumeFileName?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  createdAt: string;
}

export type NotificationType =
  | 'application_update'
  | 'new_job'
  | 'company_approval'
  | 'payment_success'
  | 'subscription_update'
  | 'recruiter_message'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  role: Role;
  amount: number;
  currency: string;
  stripePaymentId: string;
  transactionId: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: string;
}

export interface ResourceArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}
