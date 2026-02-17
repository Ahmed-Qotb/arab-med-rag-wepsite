"use client";

import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordResetAction,
  type ForgetPasswordInput,
} from "../_actions/forget-password.actions";

// Hooks
export function useForgetPassword() {
  return useMutation({
    mutationFn: async (values: ForgetPasswordInput) => {
      // Request
      return await requestPasswordResetAction(values);
    },
  });
}


