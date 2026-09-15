import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  role: 'citizen' | 'authority';
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  jurisdiction?: string; // For authorities (e.g., district or village name)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    role: { type: String, enum: ['citizen', 'authority'], default: 'citizen' },
    phoneNumber: { type: String },
    email: { type: String },
    displayName: { type: String },
    jurisdiction: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
