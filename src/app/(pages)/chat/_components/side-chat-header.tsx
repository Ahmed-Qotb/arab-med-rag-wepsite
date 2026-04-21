"use client";

import { Ellipsis, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function SideChatHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createChatMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error("Failed to create chat");
      }

      return res.json() as Promise<{
        id: string;
        title: string;
      }>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.push(`/chat/${data.id}`);
    },
  });

  return (
    <div className="flex items-center justify-between">
      {/* HEADING */}
      <h2 className="font-semibold text-2xl">My Chats</h2>

      {/* ACTIONS */}
      <ul className="flex gap-2.5">
        <li
          className="flex justify-center items-center bg-teal-600 text-zinc-100 cursor-pointer transition-colors w-fit p-2 rounded-xl"
          onClick={() => createChatMutation.mutate()}
        >
          <Plus strokeWidth="1.5" />
        </li>
        <li className="flex justify-center items-center bg-zinc-900 text-zinc-100 cursor-pointer transition-colors w-fit p-2 rounded-xl">
          <Ellipsis strokeWidth="1" />
        </li>
      </ul>
    </div>
  );
}

