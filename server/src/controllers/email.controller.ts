import { Request, Response } from "express";
import { catchAsync } from "../utils/helpers";
import { sendAnalysisReport } from "../services/email.service";

export const sendReport = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { analysisId, email } = req.body;

  if (!analysisId || !email) {
    res.status(400).json({ success: false, message: "analysisId and email are required" });
    return;
  }

  await sendAnalysisReport(analysisId, userId, email);

  res.json({ success: true, message: "Report sent successfully" });
});
