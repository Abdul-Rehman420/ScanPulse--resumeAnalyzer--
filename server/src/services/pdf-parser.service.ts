import fs from "fs";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

export function parseResumeSection(text: string, sectionName: string): string[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
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

export function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : null;
}

export function extractPhone(text: string): string | null {
  const match = text.match(
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  return match ? match[0] : null;
}

export function extractName(text: string): string | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.length > 0 ? lines[0] : null;
}

export function extractSkills(text: string): string[] {
  const skillSection = parseResumeSection(text, "skill");
  const skills: string[] = [];

  for (const line of skillSection) {
    const items = line.split(/[,|•·\-/\n]+/).map((s) => s.trim()).filter(Boolean);
    skills.push(...items);
  }

  return [...new Set(skills)];
}

export async function parseResume(filePath: string) {
  const text = await extractTextFromPdf(filePath);

  return {
    text,
    parsed: {
      name: extractName(text),
      email: extractEmail(text),
      phone: extractPhone(text),
      skills: extractSkills(text),
      education: parseResumeSection(text, "education"),
      experience: parseResumeSection(text, "experience"),
      projects: parseResumeSection(text, "project"),
      certifications: parseResumeSection(text, "certification"),
    },
  };
}
