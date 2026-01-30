import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider, ThemeToggle } from "~/components/theme-provider";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { NavigationMenu } from "~/components/ui/navigation-menu";
import Link from "next/link";
export const metadata: Metadata = {
  title: "AI-gents",
  description: "Gently AI-up your terminal and CLI apps",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <ThemeProvider className="bg-gradient-to-b from-[#088da5] to-[#228c22] dark:from-[#006b3c] dark:to-[#004080]">
        <nav className="fixed top-0 right-0 left-0 bg-white/10 p-4 backdrop-blur-md">
          <div className="mx-auto max-w-7xl">
            <NavigationMenu>
              <NavigationMenuList className="flex justify-center">
                <NavigationMenuItem>
                  {/*<Link href="/" passHref>*/}
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300`}
                    href="/"
                  >
                    AI-Gents
                  </NavigationMenuLink>
                  {/*</Link>*/}
                </NavigationMenuItem>
                <NavigationMenuItem>
                  {/*<Link href="/docs" legacyBehavior passHref>*/}
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300`}
                    href="/docs"
                  >
                    Docs
                  </NavigationMenuLink>
                  {/*</Link>*/}
                </NavigationMenuItem>
                <NavigationMenuItem>
                  {/*<Link
                    href="https://github.com/DimitriGilbert/ai-gents"
                    legacyBehavior
                    passHref
                  >*/}
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300`}
                    href="https://github.com/DimitriGilbert/ai-gents"
                  >
                    GitHub
                  </NavigationMenuLink>
                  {/*</Link>*/}
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <ThemeToggle />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </nav>
        <div className="mc pt-16">{children}</div>
      </ThemeProvider>
    </html>
  );
}
