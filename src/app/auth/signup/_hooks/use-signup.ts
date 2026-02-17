"use client";

import { useMutation } from "@tanstack/react-query";
import { signUpWithEmail, type SignUpInput } from "../_actions/signup.actions";

// Hooks
export function useSignUp() {
  return useMutation({
    mutationFn: async (values: SignUpInput) => {
      // Request
      return await signUpWithEmail(values);
    },
  });
}


