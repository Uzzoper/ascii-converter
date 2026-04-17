import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { I18nProvider } from "@/i18n/I18nProvider";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ASCII Converter — Convert Images to ASCII Art",
    template: "%s | ASCII Converter",
  },
  description: "Convert images to ASCII art directly in your browser. Free, fast, and private — no uploads to any server.",
  keywords: ["ascii art", "image to ascii", "ascii converter", "terminal art", "text art"],
  authors: [{ name: "Juan Antonio Peruzzo", url: "https://juanperuzzo.is-a.dev/" }],
  creator: "Juan Antonio Peruzzo",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ascii-converter.vercel.app",
    title: "ASCII Converter — Convert Images to ASCII Art",
    description: "Convert images to ASCII art directly in your browser. Free, fast, and private.",
    siteName: "ASCII Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "ASCII Converter — Convert Images to ASCII Art",
    description: "Convert images to ASCII art directly in your browser. Free, fast, and private.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen font-mono">
        <I18nProvider>
          {children}
          <noscript>
            <p style={{ textAlign: "center", padding: "2rem", fontFamily: "monospace", color: "#00ff41", background: "#0a0a0a" }}>
              This application requires JavaScript to run. Please enable JavaScript in your browser settings.
            </p>
          </noscript>
          <Analytics />
        </I18nProvider>
      </body>
    </html>
  );
}
