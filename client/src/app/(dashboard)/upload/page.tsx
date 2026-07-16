"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, AlertCircle, CheckCircle2, Sparkles, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PageTransition } from "@/components/shared/page-transition";
import { useUploadResume } from "@/hooks/use-resume";
import { useCreateAnalysis } from "@/hooks/use-analysis";
import { toast } from "sonner";
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from "@/utils/constants";
import { TemplateSelector } from "@/components/dashboard/template-selector";

export default function UploadPage() {
  const router = useRouter();
  const uploadResume = useUploadResume();
  const createAnalysis = useCreateAnalysis();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [template, setTemplate] = useState("modern");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (selected) {
      setFile(selected);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 5MB.");
      } else if (error?.code === "file-invalid-type") {
        toast.error("Only PDF files are supported.");
      } else {
        toast.error(error?.message || "Invalid file.");
      }
    },
  });

  const removeFile = () => {
    setFile(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const resume = await uploadResume.mutateAsync({ file, template });
      setUploadProgress(60);

      const analysis = await createAnalysis.mutateAsync({
        resumeId: resume.id,
        jobDescription: jobDescription.trim() || undefined,
      });
      setUploadProgress(100);
      setSuccess(true);

      toast.success("Analysis complete!");
      setTimeout(() => {
        router.push(`/analysis/${analysis.id}`);
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to process resume");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Upload Resume</h1>
          <p className="text-muted-foreground">
            Upload your PDF resume and get instant AI-powered analysis
          </p>
        </div>

        {/* Dropzone */}
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : file
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-3">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PDF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {file && !isProcessing && !success && (
              <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isProcessing && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Analyzing your resume...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  AI is scanning for ATS compatibility, keywords, and grammar
                </p>
              </div>
            )}

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-6 text-center"
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-emerald-600">Analysis Complete!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to results...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Resume Template */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Resume Template</CardTitle>
            </div>
            <CardDescription>
              Choose a template style for your resume layout
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateSelector value={template} onChange={setTemplate} />
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Job Description Matching</CardTitle>
            </div>
            <CardDescription>
              Paste a job description to see how your resume matches the role (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here to get a match percentage, missing skills, and tailored suggestions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
        </Card>

        {/* Upload Button */}
        <Button
          size="lg"
          className="w-full"
          disabled={!file || isProcessing || success}
          onClick={handleUpload}
        >
          {isProcessing ? (
            "Analyzing..."
          ) : success ? (
            "Redirecting..."
          ) : (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Analyze Resume
            </>
          )}
        </Button>
      </div>
    </PageTransition>
  );
}
