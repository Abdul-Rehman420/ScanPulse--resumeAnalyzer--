import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "MulterError") {
    const message =
      err.message === "File too large"
        ? "File size exceeds 5MB limit"
        : err.message;
    return res.status(400).json({ success: false, message });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: (err as any).errors,
    });
  }

  console.error("Unhandled error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
