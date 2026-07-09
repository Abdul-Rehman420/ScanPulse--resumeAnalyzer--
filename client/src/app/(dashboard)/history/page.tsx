"use client";

import { useState } from "react";
import Link from "next/link";
import { useAnalyses } from "@/hooks/use-analysis";
import { useResumes, useDeleteResume } from "@/hooks/use-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageTransition } from "@/components/shared/page-transition";
import { formatDate } from "@/utils/format-date";
import { getATSColor } from "@/utils/constants";
import {
  Search,
  Eye,
  Trash2,
  Download,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function HistoryPage() {
  const { data: analyses, isLoading, error, refetch } = useAnalyses();
  const deleteResume = useDeleteResume();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = analyses?.filter((a) =>
    a.resume?.originalName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteResume.mutateAsync(id);
      toast.success("Resume deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  if (error) {
    return <ErrorState message="Failed to load history" onRetry={refetch} />;
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-muted-foreground">View all your analyzed resumes</p>
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : filtered && filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left text-sm font-medium text-muted-foreground p-4">Resume</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4 hidden sm:table-cell">Upload Date</th>
                      <th className="text-center text-sm font-medium text-muted-foreground p-4">ATS Score</th>
                      <th className="text-left text-sm font-medium text-muted-foreground p-4 hidden md:table-cell">Analysis Date</th>
                      <th className="text-right text-sm font-medium text-muted-foreground p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((analysis) => {
                      const { color, label } = getATSColor(analysis.atsScore);
                      return (
                        <tr key={analysis.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate max-w-[200px]">
                                  {analysis.resume?.originalName || "Resume"}
                                </p>
                                <p className="text-xs text-muted-foreground sm:hidden">
                                  {formatDate(analysis.createdAt)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden sm:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center space-x-2">
                              <span className="text-sm font-bold" style={{ color }}>{analysis.atsScore}</span>
                              <Badge variant={analysis.atsScore >= 70 ? "success" : analysis.atsScore >= 50 ? "warning" : "destructive"} className="text-[10px] hidden sm:inline-flex">
                                {label}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <span className="text-sm text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Link href={`/analysis/${analysis.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Resume</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this resume and its analysis? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setDeleteId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(analysis.resumeId)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6">
                <EmptyState
                  title={search ? "No results found" : "No analyses yet"}
                  description={search ? "Try a different search term" : "Upload a resume to get started"}
                  actionLabel="Upload Resume"
                  actionHref="/upload"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
