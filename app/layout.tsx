import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Plus_Jakarta_Sans, Kode_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";

// Load Plus Jakarta Sans with explicit weights
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "POOL.AI - Contribute to AI. Earn Crypto.",
  description:
    "A decentralized, user-first platform where anyone can contribute to AI data and earn tokens in return.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${kodeMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="pt-16">
            {" "}
            {/* Add padding to account for fixed navbar */}
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
