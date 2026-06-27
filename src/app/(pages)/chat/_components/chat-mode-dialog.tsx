"use client";

import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ChatMode } from "@/lib/chat";

const MODES: { value: ChatMode; label: string; description: string }[] = [
  { value: "all", label: "الكل", description: "يجمع بين RAG والإنترنت" },
  { value: "rag", label: "RAG", description: "البحث في قاعدة المعرفة" },
  { value: "internet", label: "الإنترنت", description: "البحث على الإنترنت" },
  { value: "hybrid", label: "هجين", description: "RAG + BM25 معاً" },
  { value: "bm25", label: "BM25", description: "البحث بالكلمات المفتاحية" },
];

type Props = {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
};

export default function ChatModeDialog({ mode, onModeChange }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          title="تغيير وضع البحث"
        >
          <Settings2 className="size-3.5" />
          <span>{MODES.find((m) => m.value === mode)?.label ?? mode}</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>وضع البحث</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={cn(
                "flex flex-col items-start gap-0.5 rounded-lg px-4 py-3 text-sm transition-colors cursor-pointer",
                mode === m.value
                  ? "bg-emerald-600 text-zinc-100"
                  : "bg-[#4B4F5B] text-zinc-300 hover:bg-[#555963]"
              )}
            >
              <span className="font-medium">{m.label}</span>
              <span className="text-xs opacity-70">{m.description}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
