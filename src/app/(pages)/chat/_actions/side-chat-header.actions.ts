import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateChatResponse } from "../_utils/side-chat-header.utils";

export function useCreateChat(router: ReturnType<typeof import("next/navigation").useRouter>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (): Promise<CreateChatResponse & { isExisting: boolean }> => {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("فشل في إنشاء المحادثة");

      return res.json();
    },
    onSuccess: (data) => {
      if (!data.isExisting) {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
      router.push(`/chat/${data.id}`);
    },
  });

  return mutation;
}