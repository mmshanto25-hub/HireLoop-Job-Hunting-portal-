import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  plan: string;
  amount: number;
  currency: string;
  stripePaymentId: string;
  transactionId: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    stripePaymentId: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['succeeded', 'pending', 'failed'], default: 'succeeded' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PaymentModel =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
