import type { Metadata, Viewport } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/config";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: Turn your photo into GTA character art`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "GTA art",
    "GTA character portrait",
    "custom GTA style art",
    "loading screen art",
    "photo to GTA character",
    "Vice City portrait",
    "personalized gift",
  ],
  openGraph: {
    title: `${SITE.name}: Turn your photo into GTA character art`,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: Turn your photo into GTA character art`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#09080f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
