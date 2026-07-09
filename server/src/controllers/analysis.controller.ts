import { Request, Response, NextFunction } from "express";
import * as analysisService from "../services/analysis.service";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const analysis = await analysisService.createAnalysis(
      req.user!.userId,
      resumeId,
      jobDescription
    );
    res.status(201).json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analysis = await analysisService.getAnalysisById(
      req.params.id as string,
      req.user!.userId
    );
    res.json({ success: true, data: analysis });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analyses = await analysisService.getUserAnalyses(req.user!.userId);
    res.json({ success: true, data: analyses });
  } catch (error) {
    next(error);
  }
};
