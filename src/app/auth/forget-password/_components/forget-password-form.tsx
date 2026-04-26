"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgetPassword } from "../_hooks/use-forget-password";

// Types
type ForgetPasswordFormValues = {
  email: string;
};

export default function ForgetPasswordForm() {
  // Hooks
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgetPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync, isPending } = useForgetPassword();

  // Handlers
  async function onSubmit(values: ForgetPasswordFormValues) {
    setFormError(null);
    setSuccessMessage(null);

    try {
      await mutateAsync(values);

      // Response
      setSuccessMessage(
        "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، سيتم إرسال رابط إعادة التعيين."
      );
      reset();
    } catch (error: any) {
      // To handle error
      setFormError(error?.message ?? "حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    // FORM
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* EMAIL FIELD */}
      <div className="space-y-2">
        {/* EMAIL LABEL */}
        <label className="block text-sm font-medium text-zinc-200">
          البريد الإلكتروني
        </label>

        {/* EMAIL INPUT */}
        <Input
          type="email"
          placeholder="you@example.com"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.email}
          {...register("email", {
            required: "البريد الإلكتروني مطلوب",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "يرجى إدخال بريد إلكتروني صحيح",
            },
          })}
        />

        {/* EMAIL ERROR */}
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* FORM ERROR MESSAGE */}
      {formError && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
          {formError}
        </p>
      )}

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <p className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 rounded-md px-3 py-2">
          {successMessage}
        </p>
      )}

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal-600 hover:bg-teal-500"
      >
        {isPending ? "جاري إرسال الرابط..." : "إرسال رابط إعادة التعيين"}
      </Button>
    </form>
  );
}


