import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  caseCode: string;
  firebaseUid?: string; // Anonymous if missing or optional
  incidentCategory: string;
  transcript?: string;
  language: string;
  location: {
    state?: string;
    district?: string;
    village?: string;
    latitude?: number;
    longitude?: number;
  };
  media: {
    photoUrl?: string;
    videoUrl?: string;
    voiceNoteUrl?: string;
  };
  analysis: {
    urgencyScore: number;
    urgencyBadge: string;
    detectedIssue: string;
    targetHelpline: string;
    recommendedRouting: string;
    summaryEnglish: string;
    keyEntities: {
      locations: string[];
      parties: string[];
      items: string[];
    };
  };
  status: 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    caseCode: { type: String, required: true, unique: true },
    firebaseUid: { type: String }, // Links to citizen if logged in anonymously
    incidentCategory: { type: String, required: true },
    transcript: { type: String },
    language: { type: String, required: true },
    location: {
      state: String,
      district: String,
      village: String,
      latitude: Number,
      longitude: Number,
    },
    media: {
      photoUrl: String,
      videoUrl: String,
      voiceNoteUrl: String,
    },
    analysis: {
      urgencyScore: { type: Number, required: true },
      urgencyBadge: { type: String, required: true },
      detectedIssue: { type: String },
      targetHelpline: { type: String },
      recommendedRouting: { type: String },
      summaryEnglish: { type: String },
      keyEntities: {
        locations: [String],
        parties: [String],
        items: [String],
      },
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Action Taken', 'Resolved'],
      default: 'Submitted',
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
