import type { Metadata } from "next";

import { Inter } from "next/font/google";

import "@/styles/globals.css";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/common/theme-provider";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create T3 App",
  description: appConfig.description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  authors: [{ name: appConfig.name }],
  creator: appConfig.name,
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
