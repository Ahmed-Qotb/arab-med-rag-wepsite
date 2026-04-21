import SignInForm from "./_components/signin-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="w-full max-w-md rounded-xl bg-[#3F424A] border border-zinc-800 px-8 py-10 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Sign in to continue chatting with your AI assistant.
        </p>
      </div>

      <SignInForm />

      <div className="mt-6 text-center text-sm text-zinc-400">
        <p>
          Do not have an account?{" "}
          <Link href="/auth/signup" className="text-teal-500 hover:text-teal-400 font-medium">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
