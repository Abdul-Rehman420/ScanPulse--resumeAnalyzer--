"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Loader2, Trash2, Copy, Check, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageTransition } from "@/components/shared/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { resumeService } from "@/services/resume";
import { generateCoverLetter, getCoverLetters, deleteCoverLetter } from "@/services/ai";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function CoverLettersPage() {
  const [open, setOpen] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: resumes } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumeService.getAll(),
  });

  const { data: coverLetters, isLoading } = useQuery({
    queryKey: ["cover-letters"],
    queryFn: getCoverLetters,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCoverLetter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
      toast.success("Cover letter deleted");
    },
  });

  async function handleGenerate() {
    if (!resumeId || !jobTitle || !companyName) {
      toast.error("Please fill in all required fields");
      return;
    }
    setGenerating(true);
    try {
      await generateCoverLetter({ resumeId, jobTitle, companyName, jobDescription });
      queryClient.invalidateQueries({ queryKey: ["cover-letters"] });
      toast.success("Cover letter generated!");
      setOpen(false);
      setJobTitle("");
      setCompanyName("");
      setJobDescription("");
    } catch {
      toast.error("Failed to generate cover letter");
    }
    setGenerating(false);
  }

  async function handleCopy(content: string, id: string) {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cover Letters</h1>
            <p className="text-muted-foreground">Generate and manage AI-powered cover letters</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Generate Cover Letter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Resume *</Label>
                  <Select value={resumeId} onValueChange={setResumeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a resume" />
                    </SelectTrigger>
                    <SelectContent>
                      {resumes?.map((r: any) => (
                        <SelectItem key={r.id} value={r.id}>{r.originalName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g., Senior Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label>Job Description (optional)</Label>
                  <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} placeholder="Paste job description for a tailored letter..." />
                </div>
                <Button onClick={handleGenerate} disabled={generating} className="w-full">
                  {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Generate Cover Letter"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        ) : !coverLetters || coverLetters.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Cover Letters Yet"
            description="Generate your first AI-powered cover letter for a job application."
            actionLabel="Generate Cover Letter"
            onAction={() => setOpen(true)}
          />
        ) : (
          <div className="space-y-4">
            {coverLetters.map((cl) => (
              <motion.div key={cl.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{cl.jobTitle}</CardTitle>
                        <CardDescription>{cl.companyName} &middot; {format(new Date(cl.createdAt), "MMM d, yyyy")}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleCopy(cl.content, cl.id)}>
                          {copiedId === cl.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === cl.id ? null : cl.id)}>
                          {expandedId === cl.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(cl.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedId === cl.id && (
                    <CardContent>
                      <div className="rounded-lg bg-muted p-4 whitespace-pre-wrap text-sm leading-relaxed">
                        {cl.content}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
