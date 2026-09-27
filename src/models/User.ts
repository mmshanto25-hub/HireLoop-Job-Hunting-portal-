import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'SEEKER' | 'RECRUITER' | 'ADMIN';
  avatar?: string;
  headline?: string;
  bio?: string;
  skills: string[];
  resumeUrl?: string;
  resumeFileName?: string;
  companyId?: mongoose.Types.ObjectId;
  subscription: {
    plan: string;
    status: string;
    currentPeriodEnd: Date;
    applicationsUsed?: number;
    applicationsLimit?: number;
    activeJobsLimit?: number;
  };
  status: 'active' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SEEKER', 'RECRUITER', 'ADMIN'], default: 'SEEKER' },
    avatar: { type: String },
    headline: { type: String },
    bio: { type: String },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String },
    resumeFileName: { type: String },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    subscription: {
      plan: { type: String, default: 'free' },
      status: { type: String, default: 'active' },
      currentPeriodEnd: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      applicationsUsed: { type: Number, default: 0 },
      applicationsLimit: { type: Number, default: 3 },
      activeJobsLimit: { type: Number, default: 3 },
    },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
