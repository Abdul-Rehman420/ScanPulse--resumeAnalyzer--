import api from "./api";
import { SharedAnalysisData, SharedAnalysisView } from "@/types";

export async function createShareLink(
  analysisId: string,
  expiresInDays?: number
): Promise<SharedAnalysisData> {
  return api.post("/share", { analysisId, expiresInDays });
}

export async function getSharedAnalyses(): Promise<SharedAnalysisView[]> {
  return api.get("/share");
}

export async function deleteShareLink(id: string): Promise<void> {
  await api.del(`/share/${id}`);
}
