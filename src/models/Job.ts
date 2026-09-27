import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  companyId: mongoose.Types.ObjectId;
  recruiterId: mongoose.Types.ObjectId;
  category: string;
  type: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  location: string;
  remote: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline: Date;
  status: 'active' | 'closed' | 'draft';
  featured: boolean;
  viewsCount: number;
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, index: true },
    type: { type: String, required: true, index: true },
    experience: { type: String, required: true, index: true },
    salaryMin: { type: Number, required: true },
    salaryMax: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    location: { type: String, required: true, index: true },
    remote: { type: Boolean, default: false, index: true },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active', index: true },
    featured: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const JobModel = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
