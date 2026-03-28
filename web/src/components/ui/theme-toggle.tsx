"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 rotate-0 scale-100 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
