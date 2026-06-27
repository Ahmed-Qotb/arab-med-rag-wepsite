import { ChatSummary } from "@/lib/chat";

export type ChatListProps = {
  variant?: "all" | "saved";
};

export type ToggleSavedResponse = {
  id: string;
  saved: boolean;
};

export type CreateChatResponse = {
  id: string;
  title: string;
};

export function formatChatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shouldShowEllipsis(title: string | null): boolean {
  return (title?.split(" ").length ?? 0) > 3;
}