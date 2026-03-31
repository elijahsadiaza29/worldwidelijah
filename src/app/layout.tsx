import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "worldwidelijah",
  description:
    "A modern developer portfolio showcasing projects, experience, and skills. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: [
    "developer",
    "portfolio",
    "full stack",
    "react",
    "nextjs",
    "typescript",
  ],
  openGraph: {
    title: "worldwidelijah",
    description:
      "A modern developer portfolio showcasing projects, experience, and skills.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
