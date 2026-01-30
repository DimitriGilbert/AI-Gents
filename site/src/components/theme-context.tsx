"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "ubuntu" | "xp";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("ubuntu");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("ai-gents-theme") as Theme;
    if (savedTheme && (savedTheme === "ubuntu" || savedTheme === "xp")) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Save theme preference
    localStorage.setItem("ai-gents-theme", theme);

    // Apply theme classes to body
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove(
      "ubuntu-wallpaper",
      "ubuntu-wallpaper-clean",
      "xp-wallpaper",
      "xp-wallpaper-bliss"
    );

    // Add new theme class
    if (theme === "ubuntu") {
      body.classList.add("ubuntu-wallpaper");
    } else {
      body.classList.add("xp-wallpaper-bliss");
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "ubuntu" ? "xp" : "ubuntu"));
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export default ThemeProvider;
