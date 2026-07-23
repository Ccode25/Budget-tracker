"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async () => {
    // Navigates to dashboard upon login submission
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your BudgetTracker account to manage your finances"
    >
      <LoginForm onSubmit={handleLoginSubmit} />
    </AuthLayout>
  );
}
