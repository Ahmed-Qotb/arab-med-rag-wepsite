"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatBubble from "./chat-bubble";
import {
  addMessageByChatId,
  getMessagesByChatId,
  Message,
} from "@/lib/chat-storage";
import { Input } from "@/components/ui/input";

type FormValues = {
  message: string;
};

interface chatIdParams {
  chatId: string;
}

export default function MainChat({ chatId }: chatIdParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load messages once on mount
  useEffect(() => {
    const storedMessages = getMessagesByChatId(chatId);
    setMessages(storedMessages);
  }, [chatId]); // run when chatId changes

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]); // runs on every messages update

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { message: "" },
  });

  async function onSubmit(data: FormValues) {
    if (!data.message.trim()) return;

    // Create the new user message
    const newMessage: Message = {
      role: "user",
      content: data.message,
    };

    // Update state
    setMessages((prev) => [...prev, newMessage]);

    // Persist to localStorage (or your storage helper)
    addMessageByChatId(chatId, newMessage);

    // Reset the form
    reset();
  }

  return (
    <div className=" h-full pe-3.5 pb-3.5">
      <div className="h-full flex bg-[#3F424A] rounded-xl flex-col justify-between">
        {/* Messages */}
        <ScrollArea className="px-4 h-190">
          <div className="space-y-4 py-6 ps-5 flex flex-col gap-8">
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
