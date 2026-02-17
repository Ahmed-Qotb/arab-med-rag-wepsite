"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithEmail, type SignInInput } from "../_actions/signin.actions";

// Hooks
export function useSignIn() {
  return useMutation({
    mutationFn: async (values: SignInInput) => {
      // Request
      return await signInWithEmail(values);
    },
  });
}


