import { handle, readJson } from "@/lib/server/route";
import { verifyAuth } from "@/lib/server/supabase";
import { prisma } from "@/lib/server/prisma";
import { rewriteResumeSection } from "@/lib/server/ai";
import { enforceAiRateLimit } from "@/lib/server/rate-limit";
import { rewriteSchema, parseBody } from "@/lib/server/validators";
import { NotFoundError } from "@/lib/server/errors";

export const dynamic = "force-dynamic";

export const POST = handle(async (req) => {
  const { userId } = await verifyAuth(req);
  const body = parseBody(await readJson(req), rewriteSchema);

  await enforceAiRateLimit(userId);

  const resume = await prisma.resume.findFirst({
    where: { id: body.resumeId, userId },
  });

  if (!resume || !resume.extractedText) {
    throw new NotFoundError("Resume");
  }

  const rewritten = await rewriteResumeSection(
    resume.extractedText,
    body.section,
    body.instructions
  );

  return { rewritten, section: body.section };
});
