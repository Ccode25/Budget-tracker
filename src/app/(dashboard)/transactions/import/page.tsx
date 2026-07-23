import type { Metadata } from "next";
import { ImportWizard } from "@/features/import/components/ImportWizard";

export const metadata: Metadata = {
  title: "Import Statement — BudgetTracker",
  description: "Import bank statements from CSV or XLSX files.",
};

export default function ImportPage() {
  return <ImportWizard />;
}
