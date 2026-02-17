import ForgetPasswordForm from "./_components/forget-password-form";

export default function ForgetPasswordPage() {
  return (
    // PAGE WRAPPER
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
      {/* CARD CONTAINER */}
      <div className="w-full max-w-md rounded-xl bg-[#3F424A] border border-zinc-800 px-8 py-10 shadow-lg">
        {/* HEADING SECTION */}
        <div className="mb-6 text-center">
          {/* TITLE */}
          <h1 className="text-2xl font-semibold">Forgot password</h1>

          {/* SUBTITLE */}
          <p className="mt-1 text-sm text-zinc-400">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        {/* FORGET PASSWORD FORM */}
        <ForgetPasswordForm />
      </div>
    </div>
  );
}


