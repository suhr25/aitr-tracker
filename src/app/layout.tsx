import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AITR Progress Tracker",
  description: "Track NBA / NAAC accreditation progress across all departments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
