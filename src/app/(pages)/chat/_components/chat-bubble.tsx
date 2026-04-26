import { ChatMessage } from "@/lib/chat";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 items-end", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "shrink-0 size-8 rounded-full flex items-center justify-center",
          isUser ? "bg-emerald-600" : "bg-violet-600"
        )}
      >
        {isUser ? (
          <User className="size-5 text-white" />
        ) : (
          <Bot className="size-5 text-white" />
        )}
      </div>
      <div
        className={cn(
          "w-fit max-w-[75%] rounded-2xl px-4 py-2 text-sm",
          isUser ? "bg-emerald-600 text-zinc-100" : "bg-[#4B4F5B] text-zinc-100"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
