"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./chat-bubble";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/chat";
import { useChatMessages, useSendMessage } from "../_actions/main-chat.actions";
import { getTitleFromContent } from "../_utils/main-chat.utils";
import type { FormValues, ChatListResponse, SendMessageResponse } from "../_utils/main-chat.utils";

type MainChatProps = {
  chatId: string;
};

export default function MainChat({ chatId }: MainChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { message: "" },
  });

  const { data } = useChatMessages(chatId);
  const sendMessageMutation = useSendMessage(chatId);

  const messages: ChatMessage[] = data?.messages ?? [];

  // Callback to update chat list and messages after AI response arrives
  function handleMessageSent(response: SendMessageResponse) {
    // Add AI message to messages list
    queryClient.setQueryData<{ messages: ChatMessage[] }>(
      ["chat-messages", chatId],
      (old) => ({
        messages: [...(old?.messages ?? []), response.aiMessage],
      })
    );

    // Revalidate chat list to get fresh title from server
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }

  // Attach success handler to mutation
  useEffect(() => {
    if (sendMessageMutation.isSuccess && sendMessageMutation.data) {
      handleMessageSent(sendMessageMutation.data);
    }
  }, [sendMessageMutation.isSuccess, sendMessageMutation.data]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(values: FormValues) {
    if (!values.message.trim()) return;

    const messageContent = values.message;

    // Create optimistic user message
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI with new message
    queryClient.setQueryData<{ messages: ChatMessage[] }>(
      ["chat-messages", chatId],
      (old) => ({
        messages: [...(old?.messages ?? []), newMessage],
      })
    );

    // Update lastMessagePreview only (title handled in handleMessageSent)
    queryClient.setQueryData<ChatListResponse>(
      ["chats", { variant: "all" }],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          chats: old.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, lastMessagePreview: messageContent }
              : chat
          ),
        };
      }
    );

    queryClient.setQueryData<ChatListResponse>(
      ["chats", { variant: "saved" }],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          chats: old.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, lastMessagePreview: messageContent }
              : chat
          ),
        };
      }
    );

    sendMessageMutation.mutate(messageContent);
    reset();
  }

  return (
    <div className="h-full ps-3.5 pb-3.5">
      <div className="h-full flex bg-[#3F424A] rounded-xl flex-col justify-between">
        {/* Messages area with scroll */}
        <ScrollArea className="px-4 h-[calc(100vh-9rem)]">
          <div className="space-y-4 py-6 flex flex-col gap-8 pt-8">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-neutral-400 text-center">
                <p>اسأل سؤالك لبدء المحادثة</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatBubble key={index} message={message} />
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Message input form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="flex gap-2">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB] py-1 relative"
                  placeholder="اسأل أسئلة، أو اكتب '/' للأوامر"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
            <Button
              type="submit"
              className="bg-zinc-800 cursor-pointer text-zinc-50 hover:text-zinc-800"
            >
              إرسال
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}