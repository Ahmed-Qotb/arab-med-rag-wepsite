import { Bookmark, Ellipsis, MessageCircle, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatList from "@/app/(pages)/chat/_components/chat-list";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SideChat() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl">My Chats</h2>
        <ul className="flex gap-2.5">
          <li className="flex justify-center items-center bg-teal-600 text-zinc-100 cursor-pointer transition-colors w-fit p-2 rounded-xl">
            <Plus strokeWidth="1.5" />
          </li>
          <li className="flex justify-center items-center bg-zinc-900 text-zinc-100 cursor-pointer transition-colors w-fit p-2 rounded-xl">
            <Ellipsis strokeWidth="1" />
          </li>
        </ul>
      </div>

      <div>
        <Tabs defaultValue="chats" className="pt-4">
          <TabsList className="w-full bg-zinc-700 h-fit p-1 rounded-md">
            <TabsTrigger
              value="chats"
              className="rounded-md text-xs text-zinc-100 data-[state=active]:bg-dark-nutral data-[state=active]:text-emerald-400 py-2.5 font-semibold cursor-pointer"
            >
              <MessageCircle fill="currentColor" />
              CHATS
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="text-zinc-100 data-[state=active]:bg-dark-nutral data-[state=active]:text-emerald-400 text-xs py-2.5 font-semibold cursor-pointer"
            >
              <Bookmark fill="currentColor" />
              SAVED
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chats">
            <ScrollArea className="h-192 w-full ">
              <ChatList />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="saved">
            <ScrollArea className="h-192 w-full ">saved</ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
