import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { sendReport } from "../controllers/email.controller";

const router = Router();

router.use(authenticate);
router.post("/send-report", sendReport);

export default router;
