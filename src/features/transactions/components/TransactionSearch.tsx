"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface TransactionSearchProps {
  value: string;
  onChange: (val: string) => void;
  count?: number;
}

export function TransactionSearch({ value, onChange, count }: TransactionSearchProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, 300);

  useEffect(() => {
    if (debounced !== value) {
      onChange(debounced);
    }
  }, [debounced, value, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative flex-1">
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        id="transaction-search"
        placeholder="Search transactions…"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        className="pl-9 pr-9"
        aria-label="Search transactions"
      />
      {local && (
        <button
          type="button"
          onClick={() => { setLocal(""); onChange(""); }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}
      {count !== undefined && value && (
        <p className="mt-1 text-xs text-muted-foreground pl-1">
          {count} result{count !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
