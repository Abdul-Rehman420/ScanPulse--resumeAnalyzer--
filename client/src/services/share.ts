import api from "./api";
import { SharedAnalysisData, SharedAnalysisView } from "@/types";

export async function createShareLink(
  analysisId: string,
  expiresInDays?: number
): Promise<SharedAnalysisData> {
  const res = await api.post("/share", { analysisId, expiresInDays });
  return res.data.data;
}

export async function getSharedAnalyses(): Promise<SharedAnalysisView[]> {
  const res = await api.get("/share");
  return res.data.data;
}

export async function deleteShareLink(id: string): Promise<void> {
  await api.delete(`/share/${id}`);
}
