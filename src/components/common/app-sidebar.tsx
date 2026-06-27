"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logo from "@/../../public/medical-cardiogram-svgrepo-com.svg";
import { LocationEdit, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const pathName = usePathname();

  return (
    <div className="bg-dark-nutral">
      <Sidebar className="bg-dark-nutral border-none" collapsible="icon" side="right">
        <SidebarTrigger className="m-auto w-full bg-dark-nutral text-white cursor-pointer border-none rounded-none" />
        <SidebarHeader className="bg-dark-nutral">
          <Image
            src={logo}
            width={40}
            height={40}
            alt="شعار الروبوت"
            className="mx-auto"
          />
        </SidebarHeader>
        <SidebarContent className="bg-dark-nutral pt-11">
          <SidebarGroup />
          <ul className="flex flex-col justify-center items-center gap-6">
            <Link href="/chat">
              <li
                className={cn(
                  "flex justify-center items-center cursor-pointer transition-colors w-fit p-2.5 rounded-xl",
                  "bg-zinc-800 text-teal-600 hover:bg-teal-600 hover:text-zinc-100",
                  pathName === "/chat" && "bg-teal-600 text-zinc-100"
                )}
              >
                <MessageCircle strokeWidth={2} />
                <p
                  className={cn(
                    "ps-2 transition-all duration-300",
                    state === "expanded"
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  )}
                >
                  الدردشة
                </p>
              </li>
            </Link>

            <Link href="/settings">
              <li
                className={cn(
                  "flex justify-center items-center cursor-pointer transition-colors w-fit p-2.5 rounded-xl",
                  "bg-zinc-800 text-teal-600 hover:bg-teal-600 hover:text-zinc-100",
                  pathName === "/settings" && "bg-teal-600 text-zinc-100"
                )}
              >
                <Settings strokeWidth={2} />
                <p
                  className={cn(
                    "ps-2 transition-all duration-300",
                    state === "expanded"
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  )}
                >
                  الإعدادات
                </p>
              </li>
            </Link>

            <Link href="/discover">
              <li
                className={cn(
                  "flex justify-center items-center cursor-pointer transition-colors w-fit p-2.5 rounded-xl",
                  "bg-zinc-800 text-teal-600 hover:bg-teal-600 hover:text-zinc-100",
                  pathName === "/discover" && "bg-teal-600 text-zinc-100"
                )}
              >
                <LocationEdit strokeWidth={2} />
                <p
                  className={cn(
                    "ps-2 transition-all duration-300",
                    state === "expanded"
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  )}
                >
                  اكتشف
                </p>
              </li>
            </Link>
          </ul>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter className="bg-dark-nutral" />
      </Sidebar>
    </div>
  );
}
