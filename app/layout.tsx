import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clarity",
  description: "Your personal habit tracker",
};

// Ensures proper scaling on mobile devices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents React warnings when the theme script
    // adds the 'dark' class before hydration, causing a class mismatch.
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} min-h-screen`}>
        {/* Runs before first paint to apply the saved theme without flash. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
