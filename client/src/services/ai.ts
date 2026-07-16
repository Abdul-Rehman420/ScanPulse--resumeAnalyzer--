import api from "./api";
import { CoverLetter } from "@/types";

export async function rewriteSection(
  resumeId: string,
  section: string,
  instructions: string
): Promise<{ rewritten: string; section: string }> {
  const res = await api.post("/ai/rewrite", { resumeId, section, instructions });
  return res.data.data;
}

export async function generateCoverLetter(data: {
  resumeId: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
}): Promise<CoverLetter> {
  const res = await api.post("/ai/cover-letter", data);
  return res.data.data;
}

export async function getCoverLetters(): Promise<CoverLetter[]> {
  const res = await api.get("/ai/cover-letters");
  return res.data.data;
}

export async function deleteCoverLetter(id: string): Promise<void> {
  await api.delete(`/ai/cover-letter/${id}`);
}
