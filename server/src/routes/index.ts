import { Router } from "express";
import authRoutes from "./auth.routes";
import resumeRoutes from "./resume.routes";
import analysisRoutes from "./analysis.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/analyze", analysisRoutes);

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

export default router;
