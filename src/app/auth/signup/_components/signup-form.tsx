"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSignUp } from "../_hooks/use-signup";

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
      await mutateAsync(values);
      // Nav
      router.push("/chat");
    } catch (error: any) {
      // To handle error
      setFormError(error?.message ?? "Something went wrong. Please try again.");
    }
  }

  return (
    // FORM
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* NAME FIELD */}
      <div className="space-y-2">
        {/* NAME LABEL */}
        <label className="block text-sm font-medium text-zinc-200">Name</label>

        {/* NAME INPUT */}
        <Input
          type="text"
          placeholder="John Doe"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.name}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
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
          Email
        </label>

        {/* EMAIL INPUT */}
        <Input
          type="email"
          placeholder="you@example.com"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.email}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
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
          Password
        </label>

        {/* PASSWORD INPUT */}
        <Input
          type="password"
          placeholder="••••••••"
          className="bg-[#4B4F5B] border-none placeholder:text-[#A0A7BB]"
          aria-invalid={!!errors.password}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
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
        className="w-full bg-zinc-800 hover:bg-zinc-700"
      >
        {isPending ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}


