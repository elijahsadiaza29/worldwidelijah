import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const googleSans = localFont({
  src: [
    {
      path: "../assets/Google_Sans/GoogleSans-VariableFont_GRAD,opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "../assets/Google_Sans/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-sans",
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
        className={`${googleSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
