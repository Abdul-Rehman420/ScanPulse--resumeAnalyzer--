import { Request, Response, NextFunction } from "express";
import * as resumeService from "../services/resume.service";

export const upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const resume = await resumeService.uploadResume(req.user!.userId, req.file);
    res.status(201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resumes = await resumeService.getUserResumes(req.user!.userId);
    res.json({ success: true, data: resumes });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id as string, req.user!.userId);
    res.json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await resumeService.deleteResume(req.params.id as string, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await resumeService.getDashboardStats(req.user!.userId);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
