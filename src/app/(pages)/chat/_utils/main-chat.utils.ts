import { ChatMessage, ChatSummary, HistoryMessage, ResponseMeta } from "@/lib/chat";

export type FormValues = {
  message: string;
};

export type ChatListResponse = {
  chats: ChatSummary[];
};

export type SendMessageResponse = {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
  retrievedContext?: string;
  meta?: ResponseMeta;
  disclaimer?: string;
  chat: {
    title: string;
    lastMessagePreview: string;
  };
};

export type chatIdParams = {
  chatId: string;
};

export interface MainChatHooks {
  chatId: string;
  queryClient: import("@tanstack/react-query").QueryClient;
  onMessageSent?: (response: SendMessageResponse) => void;
}

export function getTitleFromContent(content: string): string {
  const words = content.trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

// Builds rolling 4-pair (8-message) history window for the AI API.
// Only complete user→ai pairs are included.
export function buildHistory(messages: ChatMessage[]): HistoryMessage[] {
  const pairs: HistoryMessage[][] = [];

  for (let i = 0; i < messages.length - 1; i++) {
    const current = messages[i];
    const next = messages[i + 1];
    if (current.role === "user" && next.role === "ai") {
      pairs.push([
        { content: current.content, role: "user" },
        { content: next.content, role: "ai" },
      ]);
      i++; // skip the ai message we just consumed
    }
  }

  // Keep only the last 4 pairs
  return pairs.slice(-4).flat();
}