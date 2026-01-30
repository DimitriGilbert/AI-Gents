"use client";

import { useTheme } from "next-themes";
import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "ubuntu" ? "xp" : "ubuntu");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded menu-item"
      >
        <Monitor size={16} />
        <span className="hidden sm:inline">Ubuntu</span>
      </button>
    );
  }

  const isXP = theme === "xp";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded transition-all ${
        isXP ? "xp-menu-item" : "menu-item"
      }`}
      style={{ 
        color: isXP ? "#000000" : "#3C2F2F",
      }}
      title={isXP ? "Switch to Ubuntu 10.04" : "Switch to Windows XP"}
    >
      <Monitor size={16} />
      <span className="hidden sm:inline">
        {isXP ? "WinXP" : "Ubuntu"}
      </span>
    </button>
  );
}

export default ThemeToggle;
