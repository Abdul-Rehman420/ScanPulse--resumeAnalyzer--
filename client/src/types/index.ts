export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  extractedText?: string;
  parsedData?: ParsedResumeData;
  uploadedAt: string;
  analysis?: AnalysisSummary;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: string[];
  experience?: string[];
  projects?: string[];
  certifications?: string[];
}

export interface AnalysisSummary {
  id: string;
  atsScore: number;
  overallRating: string;
  createdAt: string;
}

export interface GrammarSuggestion {
  original: string;
  correction: string;
  type: string;
}

export interface JobMatchData {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  tailoredSuggestions: string[];
  roleFit: string;
  reasoning: string;
}

export interface Analysis {
  id: string;
  resumeId: string;
  userId: string;
  atsScore: number;
  grammarScore: number;
  keywordScore: number;
  overallRating: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  grammarSuggestions: GrammarSuggestion[];
  recommendations: string[];
  atsTips: string[];
  matchedKeywords: string[];
  jobMatchData?: JobMatchData;
  createdAt: string;
  resume: {
    originalName: string;
    uploadedAt: string;
    parsedData?: ParsedResumeData;
  };
}

export interface DashboardStats {
  totalResumes: number;
  totalAnalyses: number;
  avgScore: number;
  highestScore: number;
  scoreHistory: Array<{ atsScore: number; createdAt: string }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
