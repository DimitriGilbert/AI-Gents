"use client";

import { createContext, useContext, useState } from "react";
import { Button } from "~/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";
import { Toaster } from "~/components/ui/sonner";
type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, className }: { children: React.ReactNode, className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <body className={theme === "dark" ? "dark" : ""}>
        <div className={className}>{children}</div>
        <Toaster />
      </body>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-white/20"
    >
      {theme === "dark" ? (
        <FaSun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <FaMoon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
