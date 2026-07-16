import { Router } from "express";
import authRoutes from "./auth.routes";
import resumeRoutes from "./resume.routes";
import analysisRoutes from "./analysis.routes";
import aiRoutes from "./ai.routes";
import shareRoutes from "./share.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";
import emailRoutes from "./email.routes";
import { requireAdmin } from "../middleware/admin.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/analyze", analysisRoutes);
router.use("/ai", aiRoutes);
router.use("/share", shareRoutes);
router.use("/notifications", notificationRoutes);
router.use("/email", emailRoutes);
router.use("/admin", requireAdmin, adminRoutes);

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is running" });
});

export default router;
