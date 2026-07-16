"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATES = [
  { id: "modern", name: "Modern", description: "Clean and minimal with accent colors", color: "bg-blue-500" },
  { id: "professional", name: "Professional", description: "Traditional two-column layout", color: "bg-slate-600" },
  { id: "creative", name: "Creative", description: "Bold design for creative roles", color: "bg-purple-500" },
  { id: "executive", name: "Executive", description: "Formal layout for senior positions", color: "bg-amber-600" },
  { id: "technical", name: "Technical", description: "Skills-focused for tech roles", color: "bg-emerald-500" },
];

interface TemplateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateSelector({ value, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
            value === t.id ? "border-primary" : "border-border"
          )}
        >
          {value === t.id && (
            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          <div className={cn("h-8 w-8 rounded-md mb-2", t.color)} />
          <p className="text-sm font-medium">{t.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t.description}</p>
        </button>
      ))}
    </div>
  );
}
