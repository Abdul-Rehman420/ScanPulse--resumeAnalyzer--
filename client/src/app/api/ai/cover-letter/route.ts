import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { generateCoverLetter } from "@/lib/server/ai";
import { enforceAiRateLimit } from "@/lib/server/rate-limit";
import { coverLetterSchema, parseBody } from "@/lib/server/validators";
import { NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), coverLetterSchema);

  await enforceAiRateLimit(userId);

  const resume = await prisma.resume.findFirst({
    where: { id: body.resumeId, userId },
  });

  if (!resume || !resume.extractedText) {
    throw new NotFoundError("Resume");
  }

  const content = await generateCoverLetter(
    resume.extractedText,
    body.jobTitle,
    body.companyName,
    body.jobDescription
  );

  const coverLetter = await prisma.coverLetter.create({
    data: {
      userId,
      resumeId: resume.id,
      jobDescription: body.jobDescription || null,
      companyName: body.companyName,
      jobTitle: body.jobTitle,
      content,
    },
  });

  return coverLetter;
});

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return coverLetters;
});
