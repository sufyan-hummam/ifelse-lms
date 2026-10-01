import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandPalette } from "@/components/command-palette";

const fontOutfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | IF/ELSE Intelligence LMS",
    default: "IF/ELSE Intelligence LMS | Beyond Binaries",
  },
  description:
    "Applied AI Engineering and Intelligence Systems learning portal by IF/ELSE Intelligence. Master production AI, RAG, computer vision, and autonomous agent systems.",
  keywords: [
    "AI Engineering",
    "Machine Learning",
    "Generative AI",
    "RAG",
    "Computer Vision",
    "AI LMS",
    "IF/ELSE Intelligence",
  ],
  authors: [{ name: "IF/ELSE Intelligence", url: "https://www.ifelseintelligence.com" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontOutfit.variable} ${fontInter.variable} ${fontMono.variable} dark`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-brand-blue/30 selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  );
}
