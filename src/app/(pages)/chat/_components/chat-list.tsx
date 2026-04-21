"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Loader2 } from "lucide-react";
import { ChatSummary } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ChatListProps = {
  variant?: "all" | "saved";
};

export default function ChatList({ variant = "all" }: ChatListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useQuery<{ chats: ChatSummary[] }>({
    queryKey: ["chats", { variant }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (variant === "saved") {
        params.set("saved", "true");
      }

      const res = await fetch(
        `/api/chats${params.toString() ? `?${params.toString()}` : ""}`
      );

      if (!res.ok) {
        throw new Error("Failed to load chats");
      }

      return res.json();
    },
  });

  const toggleSavedMutation = useMutation({
    mutationFn: async (chat: ChatSummary) => {
      const res = await fetch(`/api/chats/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ saved: !chat.saved }),
      });

      if (!res.ok) {
        throw new Error("Failed to update chat");
      }

      return res.json() as Promise<{ id: string; saved: boolean }>;
    },
    onMutate: (chat) => {
      toast.loading(chat.saved ? "Removing from saved..." : "Saving chat...");
    },
    onSuccess: (_, chat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.dismiss();
      toast.success(chat.saved ? "Chat removed from saved" : "Chat saved");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to update chat");
    },
  });

  const chats = data?.chats ?? [];

  function handleSelectChat(chatId: string) {
    router.push(`/chat/${chatId}`);
  }

  const activeChatId =
    pathname?.startsWith("/chat/") && pathname.split("/")[2]
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
        Failed to load chats. Please try again.
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="py-8 text-sm text-neutral-400 text-center">
        {variant === "saved"
          ? "No saved chats yet."
          : "No chats yet. Start a new conversation."}
      </div>
    );
  }

  return (
    <ul>
      {chats.map((chat) => (
        <li
          key={chat.id}
          className={cn(
            "group hover:bg-dark-nutral p-3 rounded-xl cursor-pointer flex items-start justify-between gap-2",
            activeChatId === chat.id && "bg-dark-nutral"
          )}
          onClick={() => handleSelectChat(chat.id)}
        >
          <div className="flex-1 min-w-0">
            <div className="pb-1.5 flex justify-between items-center gap-2">
              <h4 className="font-semibold truncate">
                {chat.title || "New chat"}
              </h4>
              <span className="text-neutral-400 text-xs opacity-70 shrink-0">
                {new Date(chat.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-sm text-neutral-400 line-clamp-2">
              {chat.lastMessagePreview || "No messages yet."}
            </p>
          </div>

          <button
            type="button"
            className={cn(
              "mt-1 p-1.5 rounded-md text-neutral-500 hover:text-emerald-400 hover:bg-zinc-800/80 transition-colors",
              chat.saved && "text-emerald-400",
              toggleSavedMutation.isPending && toggleSavedMutation.variables?.id === chat.id && "opacity-50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedMutation.mutate(chat);
            }}
            disabled={toggleSavedMutation.isPending}
            aria-label={chat.saved ? "Unsave chat" : "Save chat"}
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
