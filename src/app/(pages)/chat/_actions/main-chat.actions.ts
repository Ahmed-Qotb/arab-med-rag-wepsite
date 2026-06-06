import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatMessage, ChatMode } from "@/lib/chat";
import type { SendMessageResponse } from "../_utils/main-chat.utils";
import { sendMessageAction } from "./send-message.actions";

export function useChatMessages(chatId: string) {
  return useQuery<{ messages: ChatMessage[] }>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (!res.ok) {
        throw new Error("فشل في تحميل الرسائل");
      }
      return res.json();
    },
  });
}

export function useSendMessage(chatId: string) {
  return useMutation<SendMessageResponse, Error, { content: string; mode: ChatMode }>({
    mutationFn: ({ content, mode }) => sendMessageAction(chatId, content, mode),
  });
}