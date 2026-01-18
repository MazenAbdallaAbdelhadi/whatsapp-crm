"use client";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./theme-provider";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NuqsAdapter>
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        {children}
        <Toaster position="top-right" />
      </NuqsAdapter>
    </ThemeProvider>
  );
};
