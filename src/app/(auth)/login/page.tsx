"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/services/auth.service";
import type { LoginInput } from "@/features/auth/validation/auth.validation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.login(data);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("budget_tracker_user", JSON.stringify(res.user));
        window.localStorage.setItem("budget_tracker_token", res.accessToken);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your BudgetTracker account to manage your finances"
    >
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </AuthLayout>
  );
}
