import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Gitmap — Beautiful GitHub Contribution Heatmaps for React",
  description:
    "Gitmap is a lightweight React library for rendering beautiful, interactive GitHub-style contribution heatmaps. Supports multiple themes, custom data, animations, and more.",
  keywords: [
    "github heatmap",
    "contribution graph",
    "react component",
    "gitmap",
    "heatmap react",
    "github activity",
  ],
  authors: [{ name: "Arnab Jena" }],
  openGraph: {
    title: "Gitmap — Beautiful GitHub Contribution Heatmaps for React",
    description: "Beautiful GitHub contribution heatmaps for React applications.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gitmap",
    description: "Beautiful GitHub contribution heatmaps for React applications.",
  },
  metadataBase: new URL("https://gitmap-devo.vercel.app/"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${sansFont.variable} ${monoFont.variable}`}>
      <body
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        className="bg-background text-foreground antialiased min-h-screen transition-colors duration-300"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="pt-0">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
