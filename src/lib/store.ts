import {
  INITIAL_COMPANIES,
  INITIAL_JOBS,
  INITIAL_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_SAVED_JOBS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENTS,
} from './seedData';
import { Company, Job, User, Application, SavedJob, Notification, PaymentRecord } from '@/types';
import { connectToDatabase } from './mongodb';
import { UserModel } from '@/models/User';
import { CompanyModel } from '@/models/Company';
import { JobModel } from '@/models/Job';
import { ApplicationModel } from '@/models/Application';
import { NotificationModel } from '@/models/Notification';
import { PaymentModel } from '@/models/Payment';
import { SavedJobModel } from '@/models/SavedJob';

class DataStore {
  private users: User[] = [...INITIAL_USERS];
  private companies: Company[] = [...INITIAL_COMPANIES];
  private jobs: Job[] = [...INITIAL_JOBS];
  private applications: Application[] = [...INITIAL_APPLICATIONS];
  private savedJobs: SavedJob[] = [...INITIAL_SAVED_JOBS];
  private notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  private payments: PaymentRecord[] = [...INITIAL_PAYMENTS];
  private isMongoSynced = false;

  constructor() {
    this.tryMongoSync();
  }

  private async tryMongoSync() {
    if (this.isMongoSynced) return;
    try {
      const { isConnected } = await connectToDatabase();
      if (!isConnected) return;

      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        await this.seedMongo();
      }
      this.isMongoSynced = true;
    } catch {
      // In-memory fallback remains active
    }
  }

  public async seedMongo() {
    try {
      const { isConnected } = await connectToDatabase();
      if (!isConnected) return false;

      await UserModel.deleteMany({});
      await CompanyModel.deleteMany({});
      await JobModel.deleteMany({});
      await ApplicationModel.deleteMany({});
      await NotificationModel.deleteMany({});
      await PaymentModel.deleteMany({});
      await SavedJobModel.deleteMany({});

      // Insert users
      for (const u of this.users) {
        await UserModel.create({
          _id: u.id.startsWith('user-') ? undefined : u.id,
          name: u.name,
          email: u.email,
          passwordHash: '$2a$10$wTqgI7a6P8w9J4L.xKm8f.vN10l01g.b9gO/N.pE3K50x/yK8gP6O', // demo password hash for 'password123'
          role: u.role,
          avatar: u.avatar,
          headline: u.headline,
          bio: u.bio,
          skills: u.skills,
          resumeUrl: u.resumeUrl,
          resumeFileName: u.resumeFileName,
          subscription: u.subscription,
          status: u.status,
        });
      }

      for (const c of this.companies) {
        await CompanyModel.create({
          name: c.name,
          logo: c.logo,
          industry: c.industry,
          website: c.website,
          location: c.location,
          employeeCount: c.employeeCount,
          description: c.description,
          status: c.status,
          benefits: c.benefits,
          culture: c.culture,
          mission: c.mission,
          featured: c.featured,
        });
      }

      for (const j of this.jobs) {
        await JobModel.create({
          title: j.title,
          category: j.category,
          type: j.type,
          experience: j.experience,
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          currency: j.currency,
          location: j.location,
          remote: j.remote,
          description: j.description,
          responsibilities: j.responsibilities,
          requirements: j.requirements,
          benefits: j.benefits,
          deadline: new Date(j.deadline),
          status: j.status,
          featured: j.featured,
          viewsCount: j.viewsCount,
          applicationsCount: j.applicationsCount,
        });
      }

      return true;
    } catch (e) {
      console.warn('Seed Mongo failed:', e);
      return false;
    }
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.users[idx];
  }

  // --- COMPANIES ---
  public getCompanies(): Company[] {
    return this.companies;
  }

  public getCompanyById(id: string): Company | undefined {
    return this.companies.find((c) => c.id === id);
  }

  public createCompany(data: Omit<Company, 'id' | 'createdAt'>): Company {
    const newCompany: Company = {
      ...data,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.companies.unshift(newCompany);
    return newCompany;
  }

  public updateCompany(id: string, updates: Partial<Company>): Company | null {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.companies[idx] = { ...this.companies[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.companies[idx];
  }

  // --- JOBS ---
  public getJobs(): Job[] {
    return this.jobs;
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  public createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'viewsCount' | 'applicationsCount'>): Job {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      viewsCount: 0,
      applicationsCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.jobs.unshift(newJob);

    // Update company open jobs count
    const comp = this.getCompanyById(newJob.companyId);
    if (comp) {
      this.updateCompany(comp.id, { openJobsCount: (comp.openJobsCount || 0) + 1 });
    }

    return newJob;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | null {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    this.jobs[idx] = { ...this.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.jobs[idx];
  }

  public deleteJob(id: string): boolean {
    const idx = this.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return false;
    this.jobs.splice(idx, 1);
    return true;
  }

  // --- APPLICATIONS ---
  public getApplications(): Application[] {
    return this.applications;
  }

  public getApplicationById(id: string): Application | undefined {
    return this.applications.find((a) => a.id === id);
  }

  public getApplicationsBySeeker(seekerId: string): Application[] {
    return this.applications.filter((a) => a.seekerId === seekerId);
  }

  public getApplicationsByJob(jobId: string): Application[] {
    return this.applications.filter((a) => a.jobId === jobId);
  }

  public createApplication(appData: Omit<Application, 'id' | 'appliedAt' | 'updatedAt'>): Application {
    const newApp: Application = {
      ...appData,
      id: `app-${Date.now()}`,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.unshift(newApp);

    // Increment job application count
    const job = this.getJobById(newApp.jobId);
    if (job) {
      this.updateJob(job.id, { applicationsCount: (job.applicationsCount || 0) + 1 });
    }

    // Increment user's application count
    const seeker = this.getUserById(newApp.seekerId);
    if (seeker) {
      this.updateUser(seeker.id, {
        subscription: {
          ...seeker.subscription,
          applicationsUsed: (seeker.subscription.applicationsUsed || 0) + 1,
        },
      });
    }

    // Create notification for recruiter
    if (job) {
      this.createNotification({
        userId: job.recruiterId,
        title: 'New Applicant Received',
        message: `${newApp.seekerName} just applied for ${job.title}`,
        type: 'application_update',
        link: `/dashboard/recruiter/jobs/${job.id}/applicants`,
        read: false,
      });
    }

    return newApp;
  }

  public updateApplicationStatus(id: string, status: Application['status'], notes?: string): Application | null {
    const idx = this.applications.findIndex((a) => a.id === id);
    if (idx === -1) return null;

    const oldApp = this.applications[idx];
    this.applications[idx] = {
      ...oldApp,
      status,
      notes: notes !== undefined ? notes : oldApp.notes,
      updatedAt: new Date().toISOString(),
    };

    // Trigger notification to seeker
    const statusEmoji = status === 'Offered' ? '🎉' : status === 'Shortlisted' ? '⭐' : status === 'Rejected' ? 'ℹ️' : '📋';
    this.createNotification({
      userId: oldApp.seekerId,
      title: `Application Status: ${status} ${statusEmoji}`,
      message: `Your application for "${oldApp.jobTitle}" at ${oldApp.companyName} was updated to "${status}".`,
      type: 'application_update',
      link: '/dashboard/seeker/applications',
      read: false,
    });

    return this.applications[idx];
  }

  // --- SAVED JOBS ---
  public getSavedJobs(userId: string): (SavedJob & { job?: Job })[] {
    return this.savedJobs
      .filter((s) => s.userId === userId)
      .map((s) => ({
        ...s,
        job: this.getJobById(s.jobId),
      }))
      .filter((s) => Boolean(s.job));
  }

  public toggleSavedJob(userId: string, jobId: string): { isSaved: boolean } {
    const idx = this.savedJobs.findIndex((s) => s.userId === userId && s.jobId === jobId);
    if (idx !== -1) {
      this.savedJobs.splice(idx, 1);
      return { isSaved: false };
    } else {
      this.savedJobs.push({
        id: `saved-${Date.now()}`,
        userId,
        jobId,
        createdAt: new Date().toISOString(),
      });
      return { isSaved: true };
    }
  }

  public isJobSaved(userId: string, jobId: string): boolean {
    return this.savedJobs.some((s) => s.userId === userId && s.jobId === jobId);
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId: string): Notification[] {
    return this.notifications.filter((n) => n.userId === userId);
  }

  public createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const newNotif: Notification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }

  public markAllNotificationsAsRead(userId: string): void {
    for (const notif of this.notifications) {
      if (notif.userId === userId) {
        notif.read = true;
      }
    }
  }

  // --- PAYMENTS & BILLING ---
  public getPayments(): PaymentRecord[] {
    return this.payments;
  }

  public getPaymentsByUser(userId: string): PaymentRecord[] {
    return this.payments.filter((p) => p.userId === userId);
  }

  public createPayment(data: Omit<PaymentRecord, 'id' | 'transactionId' | 'createdAt'>): PaymentRecord {
    const payment: PaymentRecord = {
      ...data,
      id: `pay-${Date.now()}`,
      transactionId: `txn_hl_${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString(),
    };
    this.payments.unshift(payment);

    // Update user plan
    const user = this.getUserById(data.userId);
    if (user) {
      const planName = data.plan.toLowerCase().includes('enterprise')
        ? 'enterprise'
        : data.plan.toLowerCase().includes('growth')
        ? 'growth'
        : data.plan.toLowerCase().includes('premium')
        ? 'premium'
        : data.plan.toLowerCase().includes('pro')
        ? 'pro'
        : 'free';

      const applicationsLimit = planName === 'premium' ? 9999 : planName === 'pro' ? 30 : 3;
      const activeJobsLimit = planName === 'enterprise' ? 50 : planName === 'growth' ? 10 : 3;

      this.updateUser(user.id, {
        subscription: {
          ...user.subscription,
          plan: planName as User['subscription']['plan'],
          status: 'active',
          applicationsLimit,
          activeJobsLimit,
        },
      });

      this.createNotification({
        userId: user.id,
        title: 'Payment Successful 💳',
        message: `Your payment of $${data.amount.toFixed(2)} for ${data.plan} was processed successfully!`,
        type: 'payment_success',
        link: user.role === 'SEEKER' ? '/dashboard/seeker/billing' : '/dashboard/recruiter/billing',
        read: false,
      });
    }

    return payment;
  }
}

// Global singleton to persist in Next.js development hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __globalDataStore: DataStore | undefined;
}

export const store = global.__globalDataStore || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  global.__globalDataStore = store;
}
