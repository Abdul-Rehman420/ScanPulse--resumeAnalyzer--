import { Router } from "express";
import * as analysisController from "../controllers/analysis.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { analyzeSchema } from "../validators/resume.validator";

const router = Router();

router.use(authenticate);

router.post("/", validate(analyzeSchema), analysisController.create);
router.get("/", analysisController.list);
router.get("/:id", analysisController.getById);

export default router;
