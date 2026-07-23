import { MOCK_CATEGORIES } from "@/features/categories/mock/categories";

const KEYWORD_RULES: Array<{ keywords: string[]; categoryId: string }> = [
  { keywords: ["starbucks", "jollibee", "mcdonald", "chipotle", "whole foods", "costco", "doordash", "ubereats", "restaurant", "cafe"], categoryId: "cat-food" },
  { keywords: ["uber", "grab", "lyft", "shell", "chevron", "gas", "parking", "transit", "metro"], categoryId: "cat-transport" },
  { keywords: ["netflix", "spotify", "hulu", "disney", "cinema", "movie", "steam"], categoryId: "cat-entertainment" },
  { keywords: ["meralco", "electric", "aws", "cloud", "google cloud", "internet", "utility", "water"], categoryId: "cat-utilities" },
  { keywords: ["amazon", "nike", "target", "walmart", "zara", "h&m", "apple store"], categoryId: "cat-shopping" },
  { keywords: ["rent", "landlord", "mortgage", "housing"], categoryId: "cat-housing" },
  { keywords: ["payroll", "salary", "stipend", "employer"], categoryId: "cat-salary" },
  { keywords: ["stripe", "freelance", "upwork", "fiverr", "client"], categoryId: "cat-freelance" },
  { keywords: ["dividend", "fidelity", "vanguard", "schwab", "robinhood"], categoryId: "cat-investment" },
  { keywords: ["pharmacy", "doctor", "clinic", "hospital", "fitness", "gym"], categoryId: "cat-health" },
];

export function autoCategorizeDescription(description: string): { categoryId: string; categoryName: string; isAutoAssigned: boolean } {
  const clean = description.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some((kw) => clean.includes(kw))) {
      const cat = MOCK_CATEGORIES.find((c) => c.id === rule.categoryId);
      if (cat) {
        return {
          categoryId: cat.id,
          categoryName: cat.name,
          isAutoAssigned: true,
        };
      }
    }
  }

  const defaultCat = MOCK_CATEGORIES.find((c) => c.id === "cat-other") || MOCK_CATEGORIES[0];
  return {
    categoryId: defaultCat.id,
    categoryName: defaultCat.name,
    isAutoAssigned: false,
  };
}
