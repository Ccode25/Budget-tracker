"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3500);
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [wasOffline]);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
      >
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/90 backdrop-blur-md px-4 py-2.5 shadow-lg">
          <Wifi className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium text-emerald-300">
            You&apos;re back online!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm"
    >
      <div className="flex items-center gap-2.5 rounded-xl border border-orange-500/30 bg-orange-950/90 backdrop-blur-md px-4 py-2.5 shadow-lg">
        <WifiOff className="h-4 w-4 text-orange-400 shrink-0 animate-pulse" />
        <span className="text-sm font-medium text-orange-300">
          You&apos;re offline — some features may be unavailable
        </span>
      </div>
    </div>
  );
}
