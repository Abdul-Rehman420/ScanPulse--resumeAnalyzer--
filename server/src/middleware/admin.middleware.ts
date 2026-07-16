import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user || user.role !== "ADMIN") {
      res.status(403).json({ success: false, message: "Admin access required" });
      return;
    }
    next();
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
}
