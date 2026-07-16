import { env } from "../config/env";
import { AnalysisResult, JobMatchResult } from "../types";

const GROQ_BASE = "https://api.groq.com/openai/v1";

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}

function cleanJsonResponse(text: string): string {
  text = text.replace(/```json\s*/gi, "").replace(/```\s*$/g, "");
  return text.trim();
}

export async function analyzeResume(
  resumeText: string,
  jobDescription?: string
): Promise<{ analysis: AnalysisResult; jobMatch?: JobMatchResult }> {
  const systemPrompt = "You are an expert ATS resume analyzer and career coach. Always return valid JSON. Never use markdown or code blocks in your response.";

  const analysisPrompt = `Analyze the following resume and return ONLY valid JSON (no markdown, no code blocks).

Resume text:
${resumeText}

Return a JSON object with exactly these fields:
{
  "atsScore": number (0-100),
  "grammarScore": number (0-100),
  "keywordScore": number (0-100),
  "overallRating": "Poor" | "Fair" | "Good" | "Excellent",
  "summary": "3-4 sentence professional summary of the candidate",
  "strengths": ["4-6 key strengths"],
  "weaknesses": ["4-6 areas for improvement"],
  "missingKeywords": ["important missing keywords for their role"],
  "grammarSuggestions": [{"original": "original text", "correction": "corrected text", "type": "grammar|spelling|passive voice|weak sentence"}],
  "recommendations": ["8-12 actionable improvement tips"],
  "atsTips": ["5-7 ATS optimization tips"],
  "matchedKeywords": ["keywords found in the resume"]
}

Rules:
- ATS score factors: contact info (10%), skills (20%), experience with metrics (25%), education (10%), keywords (15%), formatting (10%), length (5%), readability (5%)
- Be honest and critical where needed
- Suggestions must be specific to this resume, not generic`;

  const text = await callLLM(systemPrompt, analysisPrompt);
  const cleaned = cleanJsonResponse(text);
  const analysis: AnalysisResult = JSON.parse(cleaned);

  let jobMatch: JobMatchResult | undefined;

  if (jobDescription && jobDescription.trim()) {
    const jdPrompt = `You are an expert recruiter comparing a resume against a job description. Return ONLY valid JSON (no markdown, no code blocks).

Resume:
${resumeText}

Job Description:
${jobDescription}

Return a JSON object with exactly these fields:
{
  "matchPercentage": number (0-100),
  "matchedSkills": ["skills from JD found in resume"],
  "missingSkills": ["skills from JD missing in resume"],
  "missingKeywords": ["keywords from JD missing in resume"],
  "tailoredSuggestions": ["5-8 specific suggestions to tailor resume for this role"],
  "roleFit": "High" | "Medium" | "Low",
  "reasoning": "brief explanation of the match assessment"
}

Be precise and honest. Consider both hard skills and soft skills mentioned in the JD.`;

    const jdText = await callLLM(systemPrompt, jdPrompt);
    const jdCleaned = cleanJsonResponse(jdText);
    jobMatch = JSON.parse(jdCleaned);
  }

  return { analysis, jobMatch };
}

export async function rewriteResumeSection(
  resumeText: string,
  section: string,
  instructions: string
): Promise<string> {
  const systemPrompt = "You are an expert resume writer and career coach. Rewrite resume sections professionally. Return ONLY the rewritten content without explanations or markdown.";

  const prompt = `I need to rewrite a section of my resume.

Current resume:
${resumeText}

Section to rewrite: ${section}

Additional instructions: ${instructions}

Rules:
- Rewrite ONLY the requested section
- Use strong action verbs and quantify achievements where possible
- Keep it concise and ATS-friendly
- Return ONLY the rewritten section text, no explanations`;

  return callLLM(systemPrompt, prompt);
}

export async function generateCoverLetter(
  resumeText: string,
  jobTitle: string,
  companyName: string,
  jobDescription?: string
): Promise<string> {
  const systemPrompt = "You are an expert cover letter writer. Write professional, tailored cover letters. Return ONLY the cover letter text without explanations.";

  const prompt = `Write a professional cover letter based on the following information.

Resume:
${resumeText}

Target Job Title: ${jobTitle}
Target Company: ${companyName}
${jobDescription ? `Job Description:\n${jobDescription}` : ""}

Rules:
- Professional tone, tailored to the company and role
- Highlight relevant experience from the resume
- Keep it to 3-4 paragraphs
- No generic phrases, be specific
- Return ONLY the cover letter text`;

  return callLLM(systemPrompt, prompt);
}
