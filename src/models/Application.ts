import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  seekerId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  resumeUrl: string;
  resumeFileName?: string;
  coverLetter?: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Offered' | 'Rejected';
  notes?: string;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    seekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    resumeUrl: { type: String, required: true },
    resumeFileName: { type: String },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Offered', 'Rejected'],
      default: 'Applied',
      index: true,
    },
    notes: { type: String },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ApplicationModel =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
