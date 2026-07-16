import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createShareLink, getSharedAnalysis, listSharedAnalyses, deleteShareLink } from "../controllers/share.controller";

const router = Router();

router.get("/:token", getSharedAnalysis);

router.use(authenticate);
router.post("/", createShareLink);
router.get("/", listSharedAnalyses);
router.delete("/:id", deleteShareLink);

export default router;
