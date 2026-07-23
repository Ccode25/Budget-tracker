"use client";

import { useState, useEffect } from "react";
import { Search, Bell, LogOut, User as UserIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  className?: string;
}

interface UserSession {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  isDemo?: boolean;
}

export function Header({ title, className }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("budget_tracker_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse user session", e);
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("budget_tracker_user");
        window.localStorage.removeItem("budget_tracker_token");
      }
      setIsMenuOpen(false);
      router.push("/login");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between gap-4",
        "border-b border-border px-4 sm:px-6",
        "glass",
        className,
      )}
    >
      {/* Left — Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="truncate text-base font-semibold text-foreground">
          {title ?? "Dashboard"}
        </h1>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1 shrink-0 relative">
        {/* Search */}
        <button
          type="button"
          aria-label="Search"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          )}
        >
          <Search size={16} aria-hidden />
        </button>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications (3 unread)"
          className={cn(
            "relative flex h-9 w-9 items-center justify-center rounded-lg",
            "text-muted-foreground transition-colors",
            "hover:bg-muted hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
          )}
        >
          <Bell size={16} aria-hidden />
          <Badge
            variant="destructive"
            className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px] font-bold"
            aria-hidden
          >
            3
          </Badge>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-border" aria-hidden />

        {/* Demo Mode Badge */}
        {user?.isDemo && (
          <Badge variant="outline" className="hidden sm:inline-flex bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
            Demo Mode
          </Badge>
        )}

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Open user menu"
            className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-full"
          >
            <Avatar className="h-8 w-8 ring-2 ring-border ring-offset-2 ring-offset-background transition-transform hover:scale-105">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User avatar"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Profile Dropdown Popup */}
          {isMenuOpen && (
            <div className="absolute right-0 top-11 w-56 rounded-xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 z-50">
              <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                <p className="text-xs font-bold text-foreground truncate">{user?.name || "Logged In User"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors text-left"
                >
                  <UserIcon size={14} className="text-muted-foreground" />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
