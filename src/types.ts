export type SupportedLanguage = 'hi' | 'te' | 'ta' | 'mr' | 'bn' | 'en';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
}

export type IncidentCategory = 'theft' | 'violence' | 'land_crop' | 'women_safety' | 'other';

export interface CategoryInfo {
  id: IncidentCategory;
  titleKey: string;
  defaultTitle: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface LocationData {
  state: string;
  district: string;
  village: string;
  lat?: number;
  lng?: number;
  rawAddress?: string;
  isGpsDetected?: boolean;
}

export interface MediaProof {
  photoUrl?: string;
  photoName?: string;
  videoUrl?: string;
  videoName?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
}

export interface AIAnalysisResult {
  userAudioResponseText: string;
  urgencyScore: number; // 1-10
  urgencyBadge: 'Yellow - Medium' | 'Red - High' | 'Orange - Urgent';
  detectedIssue: string;
  targetHelpline: string;
  recommendedRouting: string;
  summaryEnglish: string;
  keyEntities: {
    locations?: string[];
    parties?: string[];
    items?: string[];
  };
  rawAuthorityJson: Record<string, any>;
}

export interface ReportState {
  step: 1 | 2 | 3 | 4 | 5;
  language: SupportedLanguage;
  transcript: string;
  incidentCategory: IncidentCategory | '';
  location: LocationData;
  media: MediaProof;
  analysis: AIAnalysisResult | null;
  isAnalyzing: boolean;
  caseCode: string;
  submittedAt: string | null;
}

export type TrackingStatus = 'Submitted' | 'Under Review' | 'Action Taken' | 'Resolved';

export interface ChatMessage {
  sender: 'citizen' | 'police';
  text: string;
  timestamp: string;
}

export interface SavedReportRecord {
  caseCode: string;
  submittedAt: string;
  updatedAt?: string;
  category: string;
  location: string;
  status: TrackingStatus;
  urgency: string;
  summary: string;
  targetHelpline: string;
  messages?: ChatMessage[];
}
