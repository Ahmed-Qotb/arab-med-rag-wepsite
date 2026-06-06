"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  const [showDelayed, setShowDelayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDelayed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex gap-3 items-end flex-row">
      <div className="shrink-0 size-8 rounded-full flex items-center justify-center bg-violet-600">
        <Bot className="size-5 text-white" />
      </div>
      <div className="bg-[#4B4F5B] rounded-2xl px-4 py-3 text-sm text-zinc-100 flex flex-col gap-1.5">
        <div className="flex gap-1 items-center">
          <span className="size-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0ms]" />
          <span className="size-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:150ms]" />
          <span className="size-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:300ms]" />
        </div>
        {showDelayed && (
          <p className="text-xs text-zinc-400">يستغرق هذا وقتاً أطول من المعتاد...</p>
        )}
      </div>
    </div>
  );
}
