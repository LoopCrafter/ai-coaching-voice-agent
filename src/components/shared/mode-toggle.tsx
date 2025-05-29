"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLayoutEffect } from "react";
import { useGeneralStore } from "@/stores/generalStore";

export function ModeToggle() {
  const theme = useGeneralStore((state) => state.theme);
  const toggleTheme = useGeneralStore((state) => state.toggleTheme);
  const handleTheme = () => {
    toggleTheme();
  };
  useLayoutEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={handleTheme}
    >
      {theme === "light" ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
