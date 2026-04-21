import ForgetPasswordForm from "./_components/forget-password-form";
import Link from "next/link";

export default function ForgetPasswordPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-[#3F424A] border border-zinc-800 px-8 py-10 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Forgot password</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      <ForgetPasswordForm />

      <div className="mt-6 text-center text-sm text-zinc-400">
        <p>
          Remember your password?{" "}
          <Link href="/auth/signin" className="text-teal-500 hover:text-teal-400 font-medium">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
