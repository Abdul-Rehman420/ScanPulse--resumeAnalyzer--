import { supabase } from "@/lib/supabase";

const BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = (await res.json().catch(() => ({
    success: false,
    message: "Unexpected server response",
  }))) as { success: boolean; data?: T; message?: string };

  if (res.status === 401 && !retried) {
    const { data: refreshed } = await supabase.auth.refreshSession();
    if (refreshed.session) {
      return request<T>(path, options, true);
    }
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  if (!res.ok || json.success === false) {
    const err = new Error(json.message || "Request failed") as Error & {
      response?: { data: unknown; status: number };
    };
    err.response = { data: json, status: res.status };
    throw err;
  }

  return json.data as T;
}

const api = {
  get: <T>(path: string, options: RequestInit = {}) => request<T>(path, options),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export default api;
