import { Message } from "@/lib/chat-storage";
import { cn } from "@/lib/utils";

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   // createdAt: number | any;
// }

export default function ChatBubble({ message }: { message: Message }) {
  return (
    <div
      className="
    relative
    bg-[#4B4F5B]
    w-fit
    rounded-2xl
    px-3
    py-2

    before:content-['']
    before:absolute
    before:top-0
    before:start-0
    before:size-8
    before:-translate-x-1/2
    before:-translate-y-1/2
    before:bg-zinc-800
    before:rounded-xl
  "
    >
      {message.content}
    </div>
  );
}
