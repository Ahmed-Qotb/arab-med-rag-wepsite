"use client";

import { usePathname } from "next/navigation";
import SideChat from "./_components/side-chat";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatOpen = pathname !== "/chat";

  return (
    <div className="grid grid-cols-12 w-full gap-3.5">
      <div className={`col-span-12 lg:col-span-9 ${!isChatOpen ? "hidden lg:block" : ""}`}>
        {children}
      </div>
      <div className={`col-span-12 lg:col-span-3 ${isChatOpen ? "hidden lg:block" : ""}`}>
        <SideChat />
      </div>
    </div>
  );
}
