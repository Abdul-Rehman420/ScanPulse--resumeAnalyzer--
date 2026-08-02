import "server-only";
import { prisma } from "./prisma";
import { AppError } from "./errors";

const MAX_REQUESTS = 5;
const WINDOW_SECONDS = 60;

export async function enforceAiRateLimit(userId: string): Promise<void> {
  const result = await prisma.$queryRaw<Array<{ count: number }>>`
    INSERT INTO "ai_usage" ("userId", "count", "windowStart")
    VALUES (${userId}, 1, now())
    ON CONFLICT ("userId")
    DO UPDATE SET
      "count" = CASE
        WHEN "ai_usage"."windowStart" < now() - make_interval(secs => ${WINDOW_SECONDS})
        THEN 1
        ELSE "ai_usage"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "ai_usage"."windowStart" < now() - make_interval(secs => ${WINDOW_SECONDS})
        THEN now()
        ELSE "ai_usage"."windowStart"
      END
    RETURNING "count"
  `;

  const count = Number(result[0]?.count ?? 0);
  if (count > MAX_REQUESTS) {
    throw new AppError("Too many AI requests, please wait a moment", 429);
  }
}
