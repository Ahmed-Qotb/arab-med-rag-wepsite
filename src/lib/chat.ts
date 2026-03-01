// Shared chat types

export type ChatRole = "user" | "ai";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ChatSummary = {
  id: string;
  title: string;
  lastMessagePreview: string | null;
  updatedAt: string;
  saved: boolean;
};

