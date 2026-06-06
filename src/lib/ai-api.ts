import type { QueryRequest, QueryResponse } from "./chat";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

const API_BASE_URL = getEnv("API_BASE_URL");
const API_KEY = getEnv("API_KEY");

export async function queryAI(request: QueryRequest): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { detail?: string }).detail ?? "AI request failed";
    throw new Error(message);
  }

  const data = (await res.json()) as QueryResponse;

  if (!data || typeof data.answer !== "string") {
    throw new Error("Unexpected AI response shape");
  }

  return data;
}
