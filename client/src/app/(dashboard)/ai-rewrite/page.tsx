"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Wand2, FileText, Loader2, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/shared/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { resumeService } from "@/services/resume";
import { rewriteSection } from "@/services/ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { value: "summary", label: "Professional Summary" },
  { value: "experience", label: "Work Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
  { value: "certifications", label: "Certifications" },
];

export default function AIRewritePage() {
  const [selectedResume, setSelectedResume] = useState("");
  const [section, setSection] = useState("summary");
  const [instructions, setInstructions] = useState("");
  const [rewritten, setRewritten] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: resumes, isLoading: resumesLoading } = useQuery({
    queryKey: ["resumes"],
    queryFn: () => resumeService.getAll(),
  });

  async function handleRewrite() {
    if (!selectedResume || !instructions) {
      toast.error("Select a resume and provide instructions");
      return;
    }
    setIsLoading(true);
    try {
      const result = await rewriteSection(selectedResume, section, instructions);
      setRewritten(result.rewritten);
      toast.success("Section rewritten!");
    } catch {
      toast.error("Failed to rewrite section");
    }
    setIsLoading(false);
  }

  async function handleCopy() {
    if (rewritten) {
      await navigator.clipboard.writeText(rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard");
    }
  }

  if (resumesLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageTransition>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <PageTransition>
        <EmptyState
          icon={Wand2}
          title="No Resumes Found"
          description="Upload a resume first to use the AI Rewrite feature."
          actionLabel="Upload Resume"
          actionHref="/upload"
        />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Resume Rewrite</h1>
          <p className="text-muted-foreground">Rewrite any section of your resume with AI assistance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rewrite Settings</CardTitle>
            <CardDescription>Select a resume, section, and provide instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Resume</Label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.originalName} {r.version && `(v${r.version})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section to Rewrite</Label>
              <Select value={section} onValueChange={setSection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Instructions</Label>
              <Textarea
                placeholder="e.g., Make it more concise and use action verbs, or: Add more quantifiable achievements..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleRewrite} disabled={isLoading} className="w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rewriting...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" /> Rewrite Section</>
              )}
            </Button>
          </CardContent>
        </Card>

        {rewritten && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Rewritten {SECTIONS.find((s) => s.value === section)?.label}
                  </CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-4 whitespace-pre-wrap text-sm">
                  {rewritten}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
