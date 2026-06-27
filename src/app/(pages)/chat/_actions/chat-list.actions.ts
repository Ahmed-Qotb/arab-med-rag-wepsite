import { useMutation, useQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatSummary } from "@/lib/chat";
import type { ToggleSavedResponse } from "../_utils/chat-list.utils";

/**
 * Fetches list of chats for the authenticated user
 * Supports filtering by saved status via variant prop
 */
export function useChatList(variant: "all" | "saved" = "all") {
  return useQuery<{ chats: ChatSummary[] }>({
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
        throw new Error("فشل في تحميل المحادثات");
      }

      return res.json();
    },
  });
}

/**
 * Mutation to toggle the saved status of a chat
 * Shows loading toast during mutation, success/error toast on completion
 */
export function useToggleChatSaved(queryClient: QueryClient) {
  return useMutation({
    mutationFn: async (chat: ChatSummary) => {
      const res = await fetch(`/api/chats/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ saved: !chat.saved }),
      });

      if (!res.ok) {
        throw new Error("فشل في تحديث المحادثة");
      }

      return res.json() as Promise<ToggleSavedResponse>;
    },
    onMutate: (chat) => {
      const toastMessage = chat.saved
        ? "جاري الإزالة من المحادثات المحفوظة..."
        : "جاري حفظ المحادثة...";
      toast.loading(toastMessage);
    },
    onSuccess: (_, chat) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.dismiss();
      const successMessage = chat.saved
        ? "تمت الإزالة من المحادثات المحفوظة"
        : "تم حفظ المحادثة";
      toast.success(successMessage);
    },
    onError: () => {
      toast.dismiss();
      toast.error("فشل في تحديث المحادثة");
    },
  });
}