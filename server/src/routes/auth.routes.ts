import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { authLimiter } from "../middleware/rate-limit.middleware";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.get("/profile", authenticate, authController.getProfile);

export default router;
