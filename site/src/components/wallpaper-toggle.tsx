"use client";

import { useState, useEffect } from "react";
import { Monitor } from "lucide-react";

export function WallpaperToggle() {
  const [showWallpaper, setShowWallpaper] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (showWallpaper) {
      body.classList.remove("ubuntu-wallpaper-clean");
      body.classList.add("ubuntu-wallpaper");
    } else {
      body.classList.remove("ubuntu-wallpaper");
      body.classList.add("ubuntu-wallpaper-clean");
    }
  }, [showWallpaper]);

  return (
    <button
      onClick={() => setShowWallpaper(!showWallpaper)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold menu-item rounded transition-all"
      style={{ color: '#3C2F2F' }}
      type="button"
      title={showWallpaper ? "Hide wallpaper" : "Show wallpaper"}
    >
      <Monitor size={16} />
      <span className="hidden sm:inline">{showWallpaper ? "Clean" : "Wallpaper"}</span>
    </button>
  );
}

export default WallpaperToggle;
