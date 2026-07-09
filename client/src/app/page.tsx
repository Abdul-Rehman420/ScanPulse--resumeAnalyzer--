"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  Target,
  CheckCircle,
  BarChart3,
  Download,
  ArrowRight,
  Menu,
  X,
  Star,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { FloatingShapes } from "@/components/landing/floating-shapes";
import { AnimatedGradient } from "@/components/landing/animated-gradient";
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const features = [
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description: "Get a detailed ATS compatibility score out of 100 with actionable insights.",
  },
  {
    icon: Target,
    title: "Keyword Optimization",
    description: "Identify missing keywords and optimize your resume for your target role.",
  },
  {
    icon: CheckCircle,
    title: "Grammar Check",
    description: "AI-powered grammar and spelling correction with context-aware suggestions.",
  },
  {
    icon: FileText,
    title: "Job Description Match",
    description: "Paste a job description and see exactly how your resume measures up.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get personalized suggestions to improve your resume for better results.",
  },
  {
    icon: Download,
    title: "PDF Reports",
    description: "Download professional PDF reports with all analysis results and charts.",
  },
];

const steps = [
  { number: "01", title: "Upload Resume", description: "Upload your PDF resume in seconds." },
  { number: "02", title: "AI Analysis", description: "Our AI analyzes your resume against ATS standards." },
  { number: "03", title: "Get Insights", description: "Review scores, keywords, and suggestions." },
  { number: "04", title: "Improve & Succeed", description: "Apply recommendations and land more interviews." },
];

const faqs = [
  { q: "How does the ATS score work?", a: "Our AI evaluates your resume across 8 factors including contact info, skills, experience, education, keywords, formatting, length, and readability." },
  { q: "What file formats are supported?", a: "Currently we support PDF files up to 5MB in size." },
  { q: "Is my data secure?", a: "Yes, all uploaded resumes are stored securely and can be deleted anytime." },
  { q: "What is job description matching?", a: "Paste any job description alongside your resume to get a match percentage, missing skills, and tailored suggestions." },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Resume Analyzer</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <ThemeToggle />
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              )}
            </nav>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-3">
            <Link href="#features" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#how-it-works" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
            <Link href="#faq" className="block text-sm py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
            <div className="pt-2 space-y-2">
              {isAuthenticated ? (
                <Link href="/dashboard"><Button className="w-full">Dashboard</Button></Link>
              ) : (
                <>
                  <Link href="/login"><Button variant="outline" className="w-full">Sign In</Button></Link>
                  <Link href="/register"><Button className="w-full">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 px-4 overflow-hidden">
        <AnimatedGradient />
        <FloatingShapes />
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center rounded-full border px-4 py-1.5 mb-6 text-sm bg-primary/5 border-primary/20 animate-pulse-glow"
            >
              <Sparkles className="h-4 w-4 mr-2 text-primary" />
              AI-Powered Resume Analysis
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Transform Your Resume{" "}
              <span className="text-primary">Into</span>
              <br />
              <motion.span
                className="inline-block text-primary mt-2"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(42,197,202,0.3)",
                    "0 0 40px rgba(42,197,202,0.6)",
                    "0 0 20px rgba(42,197,202,0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Interview Magnet
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Get ATS scores, keyword analysis, grammar suggestions, and AI-powered recommendations.
              Land more interviews with a resume that stands out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link href="/upload">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="text-base animate-pulse-glow">
                      Upload Resume <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="text-base animate-pulse-glow">
                        Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="text-base">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Floating stats preview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              {[
                { icon: Star, value: "ATS", label: "Score Analysis" },
                { icon: Users, value: "JD", label: "Match Rating" },
                { icon: Award, value: "AI", label: "Recommendations" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-20 px-4 bg-muted/50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-secondary/5"
            animate={{
              x: [0, -15, 0],
              y: [0, 15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful features to analyze, improve, and optimize your resume for any role.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative rounded-xl border bg-card p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                <div className="relative">
                  <motion.div
                    className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent hidden md:block" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple four-step process.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <motion.div
                  className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </motion.div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-4 bg-primary/5 border-y border-primary/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: BarChart3, title: "ATS Score", desc: "AI-powered compatibility analysis" },
            { icon: Target, title: "Keyword Match", desc: "Role-specific keyword optimization" },
            { icon: CheckCircle, title: "Grammar Check", desc: "Context-aware grammar fixes" },
            { icon: FileText, title: "JD Matching", desc: "Compare with any job description" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="text-center p-4 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <motion.div
                className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              >
                <item.icon className="h-6 w-6 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Thousands of job seekers have improved their resumes and landed their dream jobs.
            </p>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </motion.div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ x: 5, borderColor: "rgba(42, 197, 202, 0.3)" }}
                className="rounded-xl border bg-card p-6 transition-colors duration-300 cursor-pointer"
              >
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                    ?
                  </span>
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground ml-9">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 border border-primary/20 p-12 overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Resume?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who have improved their resumes and landed more interviews.
              </p>
              {isAuthenticated ? (
                <Link href="/upload">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="animate-pulse-glow shadow-lg shadow-primary/20">
                      Upload Your Resume <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="animate-pulse-glow shadow-lg shadow-primary/20">
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-bold">AI Resume Analyzer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Express, Prisma, and Google Gemini AI.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            &copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
