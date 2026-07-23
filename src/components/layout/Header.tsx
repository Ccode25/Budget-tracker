"use client";

import { Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
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
      <div className="flex items-center gap-1 shrink-0">
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

        {/* Avatar */}
        <button
          type="button"
          aria-label="Open user menu"
          className="focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded-full"
        >
          <Avatar className="h-8 w-8 ring-2 ring-border ring-offset-2 ring-offset-background">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              AJ
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
