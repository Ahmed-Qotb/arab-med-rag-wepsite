// Shared chat types

export type ChatRole = "user" | "ai";

export type ChatMode = "rag" | "internet" | "all" | "bm25" | "hybrid";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  retrievedContext?: string;
  createdAt: string;
};

export type ChatSummary = {
  id: string;
  title: string | null;
  lastMessagePreview: string | null;
  updatedAt: string;
  saved: boolean;
};

export type HistoryMessage = {
  content: string;
  role: "user" | "ai";
};

export type QueryRequest = {
  query: string;
  mode: ChatMode;
  history: HistoryMessage[];
};

export type WebSource = {
  title?: string;
  url: string;
  snippet?: string;
};

export type ResponseMeta = {
  results?: number;
  bm25_used?: boolean;
  serper_count?: number;
  halluc_warn?: boolean;
  cache_hit?: boolean;
  elapsed?: number;
  web_sources?: WebSource[];
};

export type QueryResponse = {
  answer: string;
  disclaimer?: string;
  meta?: ResponseMeta;
};

export type ApiError = {
  error: string;
  status?: number;
};

