"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis";

export function useCreateAnalysis() {
  return useMutation({
    mutationFn: ({
      resumeId,
      jobDescription,
    }: {
      resumeId: string;
      jobDescription?: string;
    }) => analysisService.create(resumeId, jobDescription),
  });
}

export function useAnalysis(id: string) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisService.getById(id),
    enabled: !!id,
  });
}

export function useAnalyses() {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: analysisService.getAll,
  });
}
