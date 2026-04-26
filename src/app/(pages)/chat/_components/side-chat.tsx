import { Bookmark, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatList from "@/app/(pages)/chat/_components/chat-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SideChatHeader } from "@/app/(pages)/chat/_components/side-chat-header";

export default function SideChat() {
  return (
    <div>
      {/* HEADING & ACTIONS */}
      <SideChatHeader />

      <div>
        <Tabs defaultValue="chats" className="pt-4">
          <TabsList className="w-full bg-zinc-700 p-1 rounded-md">
            <TabsTrigger
              value="chats"
              className="rounded-md text-xs text-zinc-100 data-[state=active]:bg-dark-nutral data-[state=active]:text-emerald-400 py-2.5 font-semibold cursor-pointer"
            >
              <MessageCircle fill="currentColor" />
              المحادثات
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="text-zinc-100 data-[state=active]:bg-dark-nutral data-[state=active]:text-emerald-400 text-xs py-2.5 font-semibold cursor-pointer"
            >
              <Bookmark fill="currentColor" />
              محفوظة
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chats">
            <ScrollArea className="h-[calc(100vh-10rem)] w-full">
              <ChatList variant="all" />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="saved">
            <ScrollArea className="h-[calc(100vh-10rem)] w-full">
              <ChatList variant="saved" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
