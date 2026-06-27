"use client";

import { useRouter } from "next/navigation";
import { Ellipsis, Plus } from "lucide-react";
import { useCreateChat } from "../_actions/side-chat-header.actions";

export function SideChatHeader() {
  const router = useRouter();
  const createChatMutation = useCreateChat(router);

  return (
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-2xl">محادثاتي</h2>

      <ul className="flex gap-2.5">
        <li
          className={`flex justify-center items-center bg-teal-600 text-zinc-100 transition-colors w-fit p-2 rounded-xl ${createChatMutation.isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onClick={() => !createChatMutation.isPending && createChatMutation.mutate()}
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