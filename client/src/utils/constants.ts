export const ATS_COLORS = {
  excellent: { color: "#2AC5CA", label: "Excellent" },
  good: { color: "#10B981", label: "Good" },
  fair: { color: "#F59E0B", label: "Fair" },
  poor: { color: "#CA492A", label: "Poor" },
} as const;

export function getATSColor(score: number): { color: string; label: string } {
  if (score >= 85) return ATS_COLORS.excellent;
  if (score >= 70) return ATS_COLORS.good;
  if (score >= 50) return ATS_COLORS.fair;
  return ATS_COLORS.poor;
}

export const RATINGS = ["Poor", "Fair", "Good", "Excellent"] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = { "application/pdf": [".pdf"] };
