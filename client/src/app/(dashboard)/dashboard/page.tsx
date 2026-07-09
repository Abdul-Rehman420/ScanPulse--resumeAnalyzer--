"use client";

import { useDashboardStats } from "@/hooks/use-resume";
import { useAnalyses } from "@/hooks/use-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { PageTransition } from "@/components/shared/page-transition";
import { formatDate } from "@/utils/format-date";
import { getATSColor } from "@/utils/constants";
import { FileText, BarChart3, TrendingUp, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: analyses, isLoading: analysesLoading } = useAnalyses();

  if (statsError) {
    return <ErrorState message="Failed to load dashboard" onRetry={refetchStats} />;
  }

  const chartData = analyses
    ?.slice()
    .reverse()
    .slice(-6)
    .map((a) => ({
      date: formatDate(a.createdAt),
      score: a.atsScore,
    }));

  const recentAnalyses = analyses?.slice(0, 5);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your resume analysis activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard
                title="Uploaded Resumes"
                value={stats?.totalResumes || 0}
                icon={FileText}
                color="#2AC5CA"
              />
              <StatCard
                title="Average ATS Score"
                value={stats?.avgScore || 0}
                icon={BarChart3}
                color="#10B981"
                description="Across all analyses"
              />
              <StatCard
                title="Highest Score"
                value={stats?.highestScore || 0}
                icon={Award}
                color="#F59E0B"
              />
              <StatCard
                title="Total Analyses"
                value={stats?.totalAnalyses || 0}
                icon={TrendingUp}
                color="#CA492A"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ATS Score History</CardTitle>
            </CardHeader>
            <CardContent>
              {analysesLoading ? (
                <Skeleton className="h-[300px]" />
              ) : chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2AC5CA" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2AC5CA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} className="text-xs" tick={{ fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#2AC5CA" fill="url(#scoreGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No analysis data yet
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              {analysesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : recentAnalyses && recentAnalyses.length > 0 ? (
                <div className="space-y-3">
                  {recentAnalyses.map((analysis) => {
                    const { color, label } = getATSColor(analysis.atsScore);
                    return (
                      <Link
                        key={analysis.id}
                        href={`/analysis/${analysis.id}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {analysis.resume?.originalName || "Resume"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(analysis.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color }}>{analysis.atsScore}</p>
                            <Badge variant={analysis.atsScore >= 70 ? "success" : analysis.atsScore >= 50 ? "warning" : "destructive"} className="text-[10px]">
                              {label}
                            </Badge>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No analyses yet</p>
                    <p className="text-xs mt-1">Upload a resume to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
