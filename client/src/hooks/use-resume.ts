"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resume";

export function useResumes() {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: resumeService.getAll,
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => resumeService.getById(id),
    enabled: !!id,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resumeService.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: resumeService.getDashboardStats,
  });
}
