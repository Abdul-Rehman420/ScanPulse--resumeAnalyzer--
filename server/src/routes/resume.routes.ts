import { Router } from "express";
import * as resumeController from "../controllers/resume.controller";
import { authenticate } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticate);

router.post("/upload", upload.single("resume"), resumeController.upload);
router.get("/", resumeController.list);
router.get("/dashboard", resumeController.dashboard);
router.get("/:id", resumeController.getById);
router.delete("/:id", resumeController.remove);

export default router;
