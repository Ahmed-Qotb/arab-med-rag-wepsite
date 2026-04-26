import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatMessage } from "@/lib/chat";
import type { SendMessageResponse } from "../_utils/main-chat.utils";

/**
 * Fetches messages for a specific chat
 */
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

/**
 * Mutation to send a message to a chat
 * Updates both messages list and chat list optimistically
 */
export function useSendMessage(chatId: string) {
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("فشل في إرسال الرسالة");
      }

      return res.json() as Promise<SendMessageResponse>;
    },
  });
}