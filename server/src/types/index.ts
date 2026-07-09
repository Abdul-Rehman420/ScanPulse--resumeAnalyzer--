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

export interface AnalysisResult {
  atsScore: number;
  grammarScore: number;
  keywordScore: number;
  overallRating: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  grammarSuggestions: Array<{
    original: string;
    correction: string;
    type: string;
  }>;
  recommendations: string[];
  atsTips: string[];
  matchedKeywords: string[];
}

export interface JobMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  tailoredSuggestions: string[];
  roleFit: string;
  reasoning: string;
}
