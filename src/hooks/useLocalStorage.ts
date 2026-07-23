"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Sync from localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error(`useLocalStorage read error for key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key, newValue: valueToStore } }));
          }
          return valueToStore;
        });
      } catch (error) {
        console.error(`useLocalStorage set error for key "${key}":`, error);
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        window.dispatchEvent(new CustomEvent("local-storage-update", { detail: { key, newValue: null } }));
      }
    } catch (error) {
      console.error(`useLocalStorage remove error for key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sync across tabs and same-tab components
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue) as T);
        } catch {
          // ignore
        }
      }
    };

    const customHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.newValue ?? initialValue);
      }
    };

    window.addEventListener("storage", handler);
    window.addEventListener("local-storage-update", customHandler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("local-storage-update", customHandler);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
