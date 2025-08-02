import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeGenie AI - Powered Trade Intelligence",
  description: "AI-powered global trade platform with document generation, partner matching, risk analysis, and market intelligence. Empowering women entrepreneurs worldwide.",
  keywords: ["TradeGenie", "AI trade", "export documents", "trade partners", "risk analysis", "market intelligence", "global trade"],
  authors: [{ name: "TradeGenie Team" }],
  openGraph: {
    title: "TradeGenie AI - Powered Trade Intelligence",
    description: "AI-powered global trade platform empowering entrepreneurs worldwide",
    url: "https://tradegenie.ai",
    siteName: "TradeGenie",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeGenie AI - Powered Trade Intelligence",
    description: "AI-powered global trade platform empowering entrepreneurs worldwide",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
