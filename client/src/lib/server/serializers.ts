import "server-only";

export function serialize(obj: unknown): string {
  return JSON.stringify(obj);
}

export function deserialize<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
