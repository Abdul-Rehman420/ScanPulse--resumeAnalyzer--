import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { parseResumeText } from "@/lib/server/pdf";
import { deserialize, serialize } from "@/lib/server/serializers";
import { createResumeSchema, parseBody } from "@/lib/server/validators";

export const dynamic = "force-dynamic";

function transformResume(resume: any) {
  if (!resume) return resume;
  const analysis = resume.analysis
    ? {
        id: resume.analysis.id,
        atsScore: resume.analysis.atsScore,
        overallRating: resume.analysis.overallRating,
        createdAt: resume.analysis.createdAt,
      }
    : undefined;
  return {
    id: resume.id,
    userId: resume.userId,
    fileName: resume.fileName,
    originalName: resume.originalName,
    fileSize: resume.fileSize,
    mimeType: resume.mimeType,
    template: resume.template,
    uploadedAt: resume.uploadedAt,
    parsedData: resume.parsedData ? deserialize(resume.parsedData, null) : null,
    analysis,
  };
}

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), createResumeSchema);

  const parsed = parseResumeText(body.extractedText);

  const resume = await prisma.resume.create({
    data: {
      userId,
      fileName: body.fileName || body.originalName,
      originalName: body.originalName,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
      extractedText: body.extractedText,
      parsedData: serialize(parsed),
      template: body.template,
    },
  });

  return transformResume(resume);
});

export const GET = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
    include: {
      analysis: {
        select: { id: true, atsScore: true, overallRating: true, createdAt: true },
      },
    },
  });
  return resumes.map(transformResume);
});
