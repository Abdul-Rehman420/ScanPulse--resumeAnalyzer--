import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { listNotifications, markAsRead, markAllAsRead, getUnreadCount } from "../controllers/notification.controller";

const router = Router();

router.use(authenticate);
router.get("/", listNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

export default router;
