"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useSettings } from "../hooks/useSettings";
import { Container } from "@/components/layout/Container";
import { PageWrapper } from "@/components/layout/PageWrapper";

export function SettingsContent() {
  const { settings, updateCurrency, updateImportPreferences } = useSettings();

  return (
    <PageWrapper>
      <Container className="py-6 space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your preferences, currency defaults, and import rules.
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Appearance & Theme</CardTitle>
              <CardDescription>Adjust how BudgetTracker looks on your device.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme Mode</p>
                <p className="text-xs text-muted-foreground">Cycle between Light, Dark, and System modes.</p>
              </div>
              <ThemeToggle iconSize={18} />
            </CardContent>
          </Card>

          {/* Localization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Currency & Regional Settings</CardTitle>
              <CardDescription>Set your primary currency display defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="currency-select">Primary Currency</Label>
                <select
                  id="currency-select"
                  value={settings.currency}
                  onChange={(e) => {
                    const val = e.target.value;
                    const sym = val === "EUR" ? "€" : val === "GBP" ? "£" : val === "USD" ? "$" : "₱";
                    updateCurrency(val, sym);
                  }}
                  className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="PHP">PHP — Philippine Peso (₱)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Import Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statement Import Preferences</CardTitle>
              <CardDescription>Default behaviors for statement parsing and duplicate handling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-Skip Duplicates</p>
                  <p className="text-xs text-muted-foreground">Automatically mark duplicate rows to be skipped.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.importPreferences.skipDuplicates}
                  onChange={(e) => updateImportPreferences("skipDuplicates", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Rule-Based Auto-Categorization</p>
                  <p className="text-xs text-muted-foreground">Assign categories based on merchant keyword rules.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.importPreferences.autoAssignCategories}
                  onChange={(e) => updateImportPreferences("autoAssignCategories", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </PageWrapper>
  );
}
