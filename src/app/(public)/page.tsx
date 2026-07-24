import { HeroSection } from "@/components/sections/HeroSection";
import { DashboardPreviewSection } from "@/components/sections/DashboardPreviewSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { BudgetManagementSection } from "@/components/sections/BudgetManagementSection";
import { TransactionsSection } from "@/components/sections/TransactionsSection";
import { AnalyticsSection } from "@/components/sections/AnalyticsSection";
import { GoalsSection } from "@/components/sections/GoalsSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { ResponsivePreviewSection } from "@/components/sections/ResponsivePreviewSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <DashboardPreviewSection />
      <FeaturesSection />
      <BudgetManagementSection />
      <TransactionsSection />
      <AnalyticsSection />
      <GoalsSection />
      <CategoriesSection />
      <SecuritySection />
      <ResponsivePreviewSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
