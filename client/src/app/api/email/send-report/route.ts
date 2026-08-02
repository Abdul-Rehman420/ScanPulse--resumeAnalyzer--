import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { sendAnalysisReport } from "@/lib/server/email";
import { sendReportSchema, parseBody } from "@/lib/server/validators";
import { AppError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), sendReportSchema);

  try {
    await sendAnalysisReport(body.analysisId, userId, body.email);
  } catch (err) {
    if (err instanceof Error && err.message === "Analysis not found") {
      throw new AppError(err.message, 404);
    }
    throw new AppError(
      err instanceof Error ? err.message : "Failed to send report",
      502
    );
  }

  return { message: "Report sent successfully" };
});
