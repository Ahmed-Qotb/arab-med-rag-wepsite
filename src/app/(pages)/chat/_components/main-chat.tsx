"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./chat-bubble";
import TypingIndicator from "./typing-indicator";
import ChatModeDialog from "./chat-mode-dialog";
import { Input } from "@/components/ui/input";
import type { ChatMessage, ChatMode, ResponseMeta } from "@/lib/chat";
import { useChatMessages, useSendMessage } from "../_actions/main-chat.actions";
import type { FormValues, ChatListResponse, SendMessageResponse } from "../_utils/main-chat.utils";

type MainChatProps = {
  chatId: string;
};

type LastResponseExtra = {
  meta?: ResponseMeta;
  disclaimer?: string;
  retrievedContext?: string;
};

export default function MainChat({ chatId }: MainChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ChatMode>("all");
  const [lastResponseExtra, setLastResponseExtra] = useState<LastResponseExtra | null>(null);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { message: "" },
  });

  const { data } = useChatMessages(chatId);
  const sendMessageMutation = useSendMessage(chatId);

  const messages: ChatMessage[] = data?.messages ?? [];
  const isPending = sendMessageMutation.isPending;

  // Restore persisted monitoring data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("latest-response");
      if (stored) setLastResponseExtra(JSON.parse(stored) as LastResponseExtra);
    } catch {}
  }, []);

  function handleMessageSent(response: SendMessageResponse) {
    queryClient.setQueryData<{ messages: ChatMessage[] }>(
      ["chat-messages", chatId],
      (old) => ({
        messages: [...(old?.messages ?? []), response.aiMessage],
      })
    );
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    const extra: LastResponseExtra = {
      meta: response.meta,
      disclaimer: response.disclaimer,
      retrievedContext: response.retrievedContext,
    };
    setLastResponseExtra(extra);
    try {
      localStorage.setItem("latest-response", JSON.stringify(extra));
    } catch {}
  }

  useEffect(() => {
    if (sendMessageMutation.isSuccess && sendMessageMutation.data) {
      handleMessageSent(sendMessageMutation.data);
    }
  }, [sendMessageMutation.isSuccess, sendMessageMutation.data]);

  useEffect(() => {
    if (sendMessageMutation.isError) {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى.");
    }
  }, [sendMessageMutation.isError]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  async function onSubmit(values: FormValues) {
    if (!values.message.trim() || isPending) return;

    const messageContent = values.message;

    // Clear previous meta while new response is loading
    setLastResponseExtra(null);

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageContent,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData<{ messages: ChatMessage[] }>(
      ["chat-messages", chatId],
      (old) => ({
        messages: [...(old?.messages ?? []), newMessage],
      })
    );

    queryClient.setQueryData<ChatListResponse>(
      ["chats", { variant: "all" }],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          chats: old.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, lastMessagePreview: messageContent.trim().split(/\s+/).slice(0, 10).join(" ") }
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
              ? { ...chat, lastMessagePreview: messageContent.trim().split(/\s+/).slice(0, 10).join(" ") }
              : chat
          ),
        };
      }
    );

    sendMessageMutation.mutate({ content: messageContent, mode });
    reset();
  }

  return (
    <div className="h-full ps-3.5 pb-3.5">
      <div className="h-full flex bg-[#3F424A] rounded-xl flex-col justify-between">
        {/* Chat header: mode indicator */}
        <div className="flex items-center justify-end px-4 pt-3 pb-1">
          <ChatModeDialog mode={mode} onModeChange={setMode} />
        </div>

        {/* Messages area */}
        <ScrollArea className="px-4 h-[calc(100vh-10rem)]">
          <div className="flex flex-col gap-6 pt-4 pb-2">
            {messages.length === 0 && !isPending ? (
              <div className="flex items-center justify-center h-full text-neutral-400 text-center">
                <p>اسأل سؤالك لبدء المحادثة</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                const isLastAi = isLastMessage && message.role === "ai";
                return (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    meta={isLastAi ? lastResponseExtra?.meta : undefined}
                    disclaimer={isLastAi ? lastResponseExtra?.disclaimer : undefined}
                    retrievedContext={isLastAi ? lastResponseExtra?.retrievedContext : message.retrievedContext}
                  />
                );
              })
            )}
            {isPending && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="flex gap-2">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  disabled={isPending}
                  className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB] py-1 relative disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="اسأل أسئلة، أو اكتب '/' للأوامر"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isPending) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="bg-zinc-800 cursor-pointer text-zinc-50 hover:text-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              إرسال
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
