"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition } from "@/components/shared/page-transition";
import { useAnalysis } from "@/hooks/use-analysis";
import { getATSColor } from "@/utils/constants";
import { formatDate } from "@/utils/format-date";
import { exportPDF, exportDOCX } from "@/utils/export";
import { ShareDialog } from "@/components/dashboard/share-dialog";
import { EmailReportDialog } from "@/components/dashboard/email-report-dialog";
import {
  Target,
  CheckCircle2,
  XCircle,
  Lightbulb,
  TrendingUp,
  FileText,
  Download,
  Brain,
  AlertTriangle,
  Sparkles,
  FileDown,
  Share2,
  Loader2,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function AtsScoreCircle({ score }: { score: number }) {
  const { color, label } = getATSColor(score);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        <motion.circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.span
          className="text-3xl font-bold"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <p className="text-xs text-muted-foreground">/100</p>
      </div>
    </div>
  );
}

function RadarScoreCard({ data }: { data: { subject: string; score: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid className="stroke-muted" />
        <PolarAngleAxis dataKey="subject" className="text-xs" tick={{ fill: '#64748b' }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" tick={{ fill: '#64748b' }} />
        <Radar
          name="Scores"
          dataKey="score"
          stroke="#2AC5CA"
          fill="#2AC5CA"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default function AnalysisPage() {
  const params = useParams();
  const { data: analysis, isLoading, error, refetch } = useAnalysis(params.id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return <ErrorState message="Failed to load analysis" onRetry={refetch} />;
  }

  const radarData = [
    { subject: "ATS", score: analysis.atsScore },
    { subject: "Grammar", score: analysis.grammarScore },
    { subject: "Keywords", score: analysis.keywordScore },
  ];

  const { color: atsColor } = getATSColor(analysis.atsScore);
  const { color: grammarColor } = getATSColor(analysis.grammarScore);
  const { color: keywordColor } = getATSColor(analysis.keywordScore);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingDOCX, setExportingDOCX] = useState(false);

  async function handleExportPDF() {
    setExportingPDF(true);
    try {
      await exportPDF(analysis!.id);
    } catch {
      toast.error("Failed to export PDF");
    }
    setExportingPDF(false);
  }

  async function handleExportDOCX() {
    setExportingDOCX(true);
    try {
      await exportDOCX(analysis!);
    } catch {
      toast.error("Failed to export DOCX");
    }
    setExportingDOCX(false);
  }

  return (
    <PageTransition>
      <div id={`analysis-report-${analysis.id}`} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Analysis Results</h1>
            <p className="text-muted-foreground">
              {analysis.resume.originalName} &middot; {formatDate(analysis.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={analysis.atsScore >= 70 ? "success" : analysis.atsScore >= 50 ? "warning" : "destructive"}
              className="text-sm px-4 py-1"
            >
              {analysis.overallRating}
            </Badge>
            <ShareDialog analysisId={analysis.id} />
            <EmailReportDialog analysisId={analysis.id} />
            <Button variant="outline" size="sm" onClick={handleExportPDF} disabled={exportingPDF}>
              {exportingPDF ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportDOCX} disabled={exportingDOCX}>
              {exportingDOCX ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              DOCX
            </Button>
          </div>
        </div>

        {/* Main Scores */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <AtsScoreCircle score={analysis.atsScore} />
              <p className="mt-3 font-medium" style={{ color: atsColor }}>
                ATS Score - {analysis.overallRating}
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ATS Compatibility</span>
                    <span className="font-medium" style={{ color: atsColor }}>{analysis.atsScore}%</span>
                  </div>
                  <Progress value={analysis.atsScore} className="h-2.5" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Grammar & Quality</span>
                    <span className="font-medium" style={{ color: grammarColor }}>{analysis.grammarScore}%</span>
                  </div>
                  <Progress value={analysis.grammarScore} className="h-2.5" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Keyword Optimization</span>
                    <span className="font-medium" style={{ color: keywordColor }}>{analysis.keywordScore}%</span>
                  </div>
                  <Progress value={analysis.keywordScore} className="h-2.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar + Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="h-5 w-5 mr-2 text-primary" />
                AI Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarScoreCard data={radarData} />
            </CardContent>
          </Card>
        </div>

        {/* Details Tabs */}
        <Tabs defaultValue="strengths" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="strengths">Strengths & Weaknesses</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            {analysis.jobMatchData && <TabsTrigger value="jobmatch">Job Match</TabsTrigger>}
          </TabsList>

          {/* Strengths & Weaknesses */}
          <TabsContent value="strengths">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-emerald-600">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <span className="text-emerald-500 mt-0.5">&#9679;</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-destructive">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm">
                        <span className="text-destructive mt-0.5">&#9679;</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Keywords */}
          <TabsContent value="keywords">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Keyword Analysis
                </CardTitle>
                <CardDescription>
                  Found {analysis.matchedKeywords.length} keywords &middot; Missing {analysis.missingKeywords.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center text-emerald-600">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.matchedKeywords.map((kw, i) => (
                        <Badge key={i} variant="success" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center text-destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grammar */}
          <TabsContent value="grammar">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Grammar Suggestions
                </CardTitle>
                <CardDescription>
                  {analysis.grammarSuggestions.length} issues found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.grammarSuggestions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No grammar issues found!</p>
                ) : (
                  <div className="space-y-4">
                    {analysis.grammarSuggestions.map((s, i) => (
                      <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px]">
                            {s.type}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Original:</p>
                          <p className="text-sm bg-destructive/5 p-2 rounded border border-destructive/20">
                            {s.original}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Suggestion:</p>
                          <p className="text-sm bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                            {s.correction}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary" />
                  Improvement Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{rec}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  ATS Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.atsTips.map((tip, i) => (
                    <li key={i} className="flex items-start space-x-2 text-sm">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Match */}
          {analysis.jobMatchData && (
            <TabsContent value="jobmatch">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Job Description Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center mb-4">
                        <svg width="140" height="140" className="transform -rotate-90">
                          <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                          <motion.circle
                            cx="70" cy="70" r="54" fill="none"
                            stroke={analysis.jobMatchData.matchPercentage >= 70 ? "#10B981" : analysis.jobMatchData.matchPercentage >= 40 ? "#F59E0B" : "#CA492A"}
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 54}
                            initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 54 - (analysis.jobMatchData.matchPercentage / 100) * 2 * Math.PI * 54 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-3xl font-bold">{analysis.jobMatchData.matchPercentage}%</span>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                      </div>
                      <Badge
                        variant={analysis.jobMatchData.roleFit === "High" ? "success" : analysis.jobMatchData.roleFit === "Medium" ? "warning" : "destructive"}
                        className="mb-3"
                      >
                        {analysis.jobMatchData.roleFit} Fit
                      </Badge>
                      <p className="text-sm text-muted-foreground">{analysis.jobMatchData.reasoning}</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center text-emerald-600">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Matched Skills ({analysis.jobMatchData.matchedSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.jobMatchData.matchedSkills.map((s, i) => (
                            <Badge key={i} variant="success" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center text-destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Missing Skills ({analysis.jobMatchData.missingSkills.length})
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.jobMatchData.missingSkills.map((s, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tailored Suggestions */}
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                      Tailored Suggestions for This Role
                    </h4>
                    <ol className="space-y-2">
                      {analysis.jobMatchData.tailoredSuggestions.map((s, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm p-2 rounded-lg bg-muted/50">
                          <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageTransition>
  );
}
