"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Mail } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/auth/signin");
    } catch {
      toast.error("فشل تسجيل الخروج. يرجى المحاولة مرة أخرى.");
      setSigningOut(false);
    }
  }

  return (
    <div className="h-full ps-3.5 pb-3.5 overflow-y-auto">
      <div className="min-h-full bg-[#3F424A] rounded-xl px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-8 text-right">
          الإعدادات
        </h1>

        {/* Email display */}
        <div className="bg-zinc-800 rounded-xl px-4 py-4 flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-teal-600/20 flex items-center justify-center shrink-0">
            <Mail size={17} className="text-teal-400" />
          </div>
          <div className="text-right">
            <p className="text-neutral-400 text-xs mb-0.5">البريد الإلكتروني</p>
            <p className="text-white text-sm font-medium">
              {session?.user?.email ?? "..."}
            </p>
          </div>
        </div>

        {/* Sign out */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="cursor-pointer w-full bg-zinc-800 hover:bg-red-500/20 border border-transparent hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <LogOut size={16} />
              تسجيل الخروج
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">تسجيل الخروج</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-300 text-sm text-right mb-6">
              هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
            </p>
            <div className="flex gap-3 flex-row-reverse">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="cursor-pointer flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white rounded-lg py-2 text-sm font-medium transition-colors"
              >
                {signingOut ? "جارٍ الخروج..." : "نعم، تسجيل الخروج"}
              </button>
              <DialogClose asChild>
                <button className="cursor-pointer flex-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 rounded-lg py-2 text-sm font-medium transition-colors">
                  إلغاء
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
