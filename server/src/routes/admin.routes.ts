import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getDashboard, listUsers, updateUserRole, deleteUser } from "../controllers/admin.controller";

const router = Router();

router.use(authenticate);

router.get("/dashboard", getDashboard);
router.get("/users", listUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

export default router;
