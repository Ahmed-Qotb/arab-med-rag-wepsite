"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSignUp } from "../_hooks/use-signup";
import { toast } from "sonner";

// Types
type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpForm() {
  // Hooks
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useSignUp();

  // Handlers
  async function onSubmit(values: SignUpFormValues) {
    setFormError(null);
    try {
      const result = await mutateAsync(values);
      if (result.error) {
        setFormError(result.error);
        return;
      }
      toast.success("تم إنشاء الحساب بنجاح!");
      router.push("/chat");
    } catch {
      setFormError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    // FORM
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* NAME FIELD */}
      <div className="space-y-2">
        {/* NAME LABEL */}
        <label className="block text-sm font-medium text-zinc-200">الاسم</label>

        {/* NAME INPUT */}
        <Input
          type="text"
          placeholder="John Doe"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.name}
          {...register("name", {
            required: "الاسم مطلوب",
            minLength: {
              value: 2,
              message: "يجب أن يكون الاسم حرفين على الأقل",
            },
          })}
        />

        {/* NAME ERROR */}
        {errors.name && (
          <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
        )}
      </div>

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

      {/* PASSWORD FIELD */}
      <div className="space-y-2">
        {/* PASSWORD LABEL */}
        <label className="block text-sm font-medium text-zinc-200">
          كلمة المرور
        </label>

        {/* PASSWORD INPUT */}
        <Input
          type="password"
          placeholder="••••••••"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: "كلمة المرور مطلوبة",
            minLength: {
              value: 8,
              message: "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
            },
          })}
        />

        {/* PASSWORD ERROR */}
        {errors.password && (
          <p className="text-xs text-red-400 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* FORM ERROR MESSAGE */}
      {formError && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-md px-3 py-2">
          {formError}
        </p>
      )}

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal-600 hover:bg-teal-500"
      >
        {isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
      </Button>
    </form>
  );
}


