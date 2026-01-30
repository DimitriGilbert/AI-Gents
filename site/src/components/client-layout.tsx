"use client";

import { useTheme } from "next-themes";
import { ThemeToggle } from "~/components/theme-toggle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

function UbuntuNav() {
  return (
    <nav 
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, #F5F1E8 0%, #E8E0D5 50%, #DDD5CA 51%, #D0C8B8 100%)',
        borderBottom: '1px solid #B8B0A0',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 4px rgba(0,0,0,0.15)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-1">
            <Link 
              href="/" 
              className="menu-item px-3 py-1.5 text-sm font-semibold rounded"
              style={{ color: '#3C2F2F' }}
            >
              AI-Gents
            </Link>
            <Link 
              href="/docs" 
              className="menu-item px-3 py-1.5 text-sm font-semibold rounded"
              style={{ color: '#3C2F2F' }}
            >
              Documentation
            </Link>
            <a 
              href="https://github.com/DimitriGilbert/ai-gents"
              target="_blank"
              rel="noopener noreferrer"
              className="menu-item px-3 py-1.5 text-sm font-semibold rounded"
              style={{ color: '#3C2F2F' }}
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

function XPNav() {
  return (
    <nav 
      className="fixed top-0 right-0 left-0 z-50"
      style={{
        background: 'linear-gradient(to bottom, #3D95FF 0%, #245EDC 100%)',
        borderTop: '1px solid #5BA8FF',
        borderBottom: '1px solid #1A47B0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-1">
            <Link 
              href="/" 
              className="xp-menu-item px-3 py-1.5 text-sm font-semibold"
            >
              AI-Gents
            </Link>
            <Link 
              href="/docs" 
              className="xp-menu-item px-3 py-1.5 text-sm font-semibold"
            >
              Documentation
            </Link>
            <a 
              href="https://github.com/DimitriGilbert/ai-gents"
              target="_blank"
              rel="noopener noreferrer"
              className="xp-menu-item px-3 py-1.5 text-sm font-semibold"
            >
              GitHub
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isXP = mounted ? theme === "xp" : resolvedTheme === "xp";

  return (
    <>
      {isXP ? <XPNav /> : <UbuntuNav />}
      <div className="pt-16 min-h-screen">{children}</div>
      <Toaster />
    </>
  );
}
