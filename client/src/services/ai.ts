import api from "./api";
import { CoverLetter } from "@/types";

export async function rewriteSection(
  resumeId: string,
  section: string,
  instructions: string
): Promise<{ rewritten: string; section: string }> {
  return api.post("/ai/rewrite", { resumeId, section, instructions });
}

export async function generateCoverLetter(data: {
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
}): Promise<CoverLetter> {
  return api.post("/ai/cover-letter", data);
}

export async function getCoverLetters(): Promise<CoverLetter[]> {
  return api.get("/ai/cover-letter");
}

export async function deleteCoverLetter(id: string): Promise<void> {
  await api.del(`/ai/cover-letter/${id}`);
}
