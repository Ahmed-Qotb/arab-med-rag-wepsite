"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./chat-bubble";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/lib/chat";

type FormValues = {
  message: string;
};

interface chatIdParams {
  chatId: string;
}

export default function MainChat({ chatId }: chatIdParams) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: { message: "" },
  });

  const {
    data,
  } = useQuery<{ messages: ChatMessage[] }>({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (!res.ok) {
        throw new Error("Failed to load messages");
      }
      return res.json();
    },
  });

  const messages: ChatMessage[] = data?.messages ?? [];

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      return res.json() as Promise<{
        userMessage: ChatMessage;
        aiMessage: ChatMessage;
      }>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<{ messages: ChatMessage[] }>(
        ["chat-messages", chatId],
        (old) => ({
          messages: [...(old?.messages ?? []), data.aiMessage],
        })
      );
    },
  });

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]); // runs on every messages update

  async function onSubmit(data: FormValues) {
    if (!data.message.trim()) return;

    // Create the new user message
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: data.message,
      createdAt: new Date().toISOString(),
    };

    // Optimistically update UI
    queryClient.setQueryData<{ messages: ChatMessage[] }>(
      ["chat-messages", chatId],
      (old) => ({
        messages: [...(old?.messages ?? []), newMessage],
      })
    );

    // Fire-and-forget send to backend
    sendMessageMutation.mutate(data.message);

    // Reset the form
    reset();
  }

  return (
    <div className=" h-full pe-3.5 pb-3.5">
      <div className="h-full flex bg-[#3F424A] rounded-xl flex-col justify-between">
        {/* Messages */}
        <ScrollArea className="px-4 h-190">
          <div className="space-y-4 py-6 ps-16 flex flex-col gap-8 pt-8">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="flex gap-2">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB] py-6 relative"
                  placeholder="Ask questions, or type ‘/’ for commands"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />

            <Button type="submit" className="bg-zinc-800 py-6">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
