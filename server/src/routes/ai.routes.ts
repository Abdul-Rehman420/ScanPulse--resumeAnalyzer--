import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { rewriteSection, createCoverLetter, listCoverLetters, deleteCoverLetter } from "../controllers/ai.controller";

const router = Router();

router.use(authenticate);

router.post("/rewrite", rewriteSection);
router.post("/cover-letter", createCoverLetter);
router.get("/cover-letters", listCoverLetters);
router.delete("/cover-letter/:id", deleteCoverLetter);

export default router;
