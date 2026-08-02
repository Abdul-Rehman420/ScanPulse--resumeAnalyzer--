import "server-only";
import { NextResponse } from "next/server";
import { AppError, ValidationError } from "./errors";

type RouteParams = { params: Promise<Record<string, string>> };

type Handler<T = unknown> = (
  req: Request,
  ctx: RouteParams
) => Promise<T>;

export function handle<T = unknown>(fn: Handler<T>) {
  return async (req: Request, ctx: RouteParams) => {
    try {
      const data = await fn(req, ctx);
      if (data === undefined) {
        return NextResponse.json({ success: true, message: "OK" });
      }
      return NextResponse.json({ success: true, data });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }
      if (error instanceof Error) {
        if (error.message.includes("JSON") || error.message.includes("Unexpected")) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 400 }
          );
        }
      }
      console.error("[api]", error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new ValidationError("Invalid JSON body");
  }
}

export async function getParam(ctx: RouteParams, name: string): Promise<string> {
  const params = await ctx.params;
  const value = params[name];
  if (!value) {
    throw new ValidationError(`Missing ${name} parameter`);
  }
  return value;
}
