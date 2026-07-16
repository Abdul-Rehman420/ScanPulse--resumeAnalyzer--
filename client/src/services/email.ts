import api from "./api";

export async function sendReport(analysisId: string, email: string): Promise<void> {
  await api.post("/email/send-report", { analysisId, email });
}
