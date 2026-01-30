import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";
import { ClientLayout } from "~/components/client-layout";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "AI-Gents",
  description: "Gently AI-up your terminal and CLI apps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="ubuntu"
          enableSystem={false}
          themes={["ubuntu", "xp"]}
        >
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
