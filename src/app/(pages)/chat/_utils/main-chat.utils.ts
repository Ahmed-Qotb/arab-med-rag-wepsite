import { ChatMessage, ChatSummary } from "@/lib/chat";

export type FormValues = {
  message: string;
};

export type ChatListResponse = {
  chats: ChatSummary[];
};

export type SendMessageResponse = {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
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