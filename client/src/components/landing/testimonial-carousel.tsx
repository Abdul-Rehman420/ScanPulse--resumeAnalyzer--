"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "Software Engineer",
    text: "The job description matching feature helped me tailor my resume perfectly. Got an interview within a week!",
    rating: 5,
  },
  {
    name: "James M.",
    role: "Product Manager",
    text: "My ATS score went from 45 to 85 after following the recommendations. Incredible tool.",
    rating: 5,
  },
  {
    name: "Priya R.",
    role: "Data Analyst",
    text: "The keyword analysis showed me exactly what I was missing. Landed my dream job thanks to this.",
    rating: 5,
  },
  {
    name: "Alex T.",
    role: "UX Designer",
    text: "The detailed grammar suggestions caught mistakes I'd missed for years. My resume looks so professional now.",
    rating: 4,
  },
  {
    name: "Maria L.",
    role: "Marketing Manager",
    text: "Being able to compare my resume against specific job descriptions is a game changer.",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (d: number) => ({
      x: d > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (d: number) => ({
      x: d > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const t = testimonials[current];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12 min-h-[220px]">
        <Quote className="absolute top-4 left-4 h-12 w-12 text-primary/10" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-10"
          >
            <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-6">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={`text-lg ${i < t.rating ? "text-amber-400" : "text-muted"}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    &#9733;
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 border flex items-center justify-center hover:bg-background transition-colors opacity-0 group-hover:opacity-100 hover:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 border flex items-center justify-center hover:bg-background transition-colors opacity-0 group-hover:opacity-100 hover:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
