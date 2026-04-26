"use client";

import { useRouter, usePathname } from "next/navigation";
import { Loader2, Bookmark } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { ChatSummary } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { useChatList, useToggleChatSaved } from "../_actions/chat-list.actions";
import { formatChatTime, shouldShowEllipsis } from "../_utils/chat-list.utils";
import type { ChatListProps } from "../_utils/chat-list.utils";

export default function ChatList({ variant = "all" }: ChatListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useChatList(variant);
  const toggleSavedMutation = useToggleChatSaved(queryClient);

  const chats: ChatSummary[] = data?.chats ?? [];

  function handleSelectChat(chatId: string) {
    router.push(`/chat/${chatId}`);
  }

  // Get the currently active chat ID from URL
  const activeChatId = pathname?.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-sm text-red-400 text-center">
        فشل في تحميل المحادثات. يرجى المحاولة مرة أخرى.
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="py-8 text-sm text-neutral-400 text-center">
        {variant === "saved"
          ? "لا توجد محادثات محفوظة حتى الآن."
          : "لا توجد محادثات حتى الآن. ابدأ محادثة جديدة."}
      </div>
    );
  }

  return (
    <ul>
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={cn(
            "group hover:bg-dark-nutral p-3 rounded-xl cursor-pointer flex items-start justify-between gap-2 my-1",
            activeChatId === chat.id && "bg-dark-nutral"
          )}
          onClick={() => handleSelectChat(chat.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="pb-1.5 flex justify-between items-center gap-2">
              {/* Time stamp */}
              <span className="text-neutral-400 text-xs opacity-70 shrink-0">
                {formatChatTime(chat.updatedAt)}
              </span>

              {/* Chat title with ellipsis indicator */}
              <h4 className="font-semibold truncate flex items-center gap-1">
                <span>{chat.title || "محادثة جديدة"}</span>
                {shouldShowEllipsis(chat.title) && (
                  <span className="shrink-0">...</span>
                )}
              </h4>
            </div>

            {/* Last message preview */}
            <p className="text-sm text-neutral-400 line-clamp-2">
              {chat.lastMessagePreview || "لا توجد رسائل حتى الآن."}
            </p>
          </div>

          {/* Save/unsave button */}
          <button
            type="button"
            className={cn(
              "mt-1 p-1.5 rounded-md text-neutral-500 hover:text-emerald-400 hover:bg-zinc-800/80 transition-colors",
              chat.saved && "text-emerald-400",
              toggleSavedMutation.isPending &&
                toggleSavedMutation.variables?.id === chat.id &&
                "opacity-50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedMutation.mutate(chat);
            }}
            disabled={toggleSavedMutation.isPending}
            aria-label={chat.saved ? "إلغاء حفظ المحادثة" : "حفظ المحادثة"}
          >
            {toggleSavedMutation.isPending &&
            toggleSavedMutation.variables?.id === chat.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark
                className="w-4 h-4"
                fill={chat.saved ? "currentColor" : "none"}
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}