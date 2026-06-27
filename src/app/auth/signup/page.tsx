import SignUpForm from "./_components/signup-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-[#3F424A] border border-zinc-800 px-8 py-10 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">إنشاء حساب</h1>
        <p className="mt-1 text-sm text-zinc-400">
          سجّل الاشتراك لتبدأ استخدام مساعدك الذكي.
        </p>
      </div>

      <SignUpForm />

      <div className="mt-6 text-center text-sm text-zinc-400">
        <p>
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/signin" className="text-teal-500 hover:text-teal-400 font-medium">
            سجل الدخول هنا
          </Link>
        </p>
      </div>
    </div>
  );
}
