import "server-only";
import type { ParsedResumeData } from "@/types";

export function parseResumeSection(text: string, sectionName: string): string[] {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const results: string[] = [];
  let capture = false;

  for (const line of lines) {
    if (capture) {
      if (
        /^(education|experience|projects|certifications|skills|summary|profile|objective|work|employment)/i.test(
          line
        ) &&
        !line.toLowerCase().includes(sectionName.toLowerCase())
      ) {
        break;
      }
      results.push(line);
    }

    if (line.toLowerCase().includes(sectionName.toLowerCase())) {
      capture = true;
    }
  }

  return results;
}

export function extractEmail(text: string): string | undefined {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : undefined;
}

export function extractPhone(text: string): string | undefined {
  const match = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  return match ? match[0] : undefined;
}

export function extractName(text: string): string | undefined {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines[0] : undefined;
}

export function extractSkills(text: string): string[] {
  const skillSection = parseResumeSection(text, "skill");
  const skills: string[] = [];

  for (const line of skillSection) {
    const items = line
      .split(/[,|•·\-/\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    skills.push(...items);
  }

  return [...new Set(skills)];
}

export function parseResumeText(text: string): ParsedResumeData {
  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    skills: extractSkills(text),
    education: parseResumeSection(text, "education"),
    experience: parseResumeSection(text, "experience"),
    projects: parseResumeSection(text, "project"),
    certifications: parseResumeSection(text, "certification"),
  };
}
