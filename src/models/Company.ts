import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  logo: string;
  industry: string;
  website: string;
  location: string;
  employeeCount: string;
  description: string;
  recruiterId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  benefits: string[];
  culture?: string;
  mission?: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    logo: { type: String, default: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&h=128&fit=crop&crop=faces' },
    industry: { type: String, required: true },
    website: { type: String, required: true },
    location: { type: String, required: true },
    employeeCount: { type: String, default: '50-200' },
    description: { type: String, required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    benefits: { type: [String], default: [] },
    culture: { type: String },
    mission: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CompanyModel = mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
