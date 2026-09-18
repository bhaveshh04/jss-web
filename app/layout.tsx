import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jssinnovative.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JSS Innovative Solutions | 200% Customized ERP Solutions, Pune",
    template: "%s | JSS Innovative Solutions",
  },
  description:
    "JSS Innovative Solutions is a Pune-based ERP implementation and custom software partner delivering 200% customized ERP, inventory, billing, GST, payroll and CRM solutions for manufacturing, textile and process industries across India.",
  keywords: [
    "ERP software Pune",
    "custom ERP solutions India",
    "ERP implementation company",
    "GST billing software",
    "payroll software Pune",
    "manufacturing ERP",
    "JSS Innovative Solutions",
  ],
  authors: [{ name: "JSS Innovative Solutions" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "JSS Innovative Solutions",
    title: "JSS Innovative Solutions | 200% Customized ERP Solutions",
    description:
      "Pune-based ERP implementation and custom software partner — 200% customized ERP, inventory, billing, GST, payroll and CRM.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "JSS Innovative Solutions | 200% Customized ERP Solutions",
    description:
      "Pune-based ERP implementation and custom software partner — 200% customized ERP, inventory, billing, GST, payroll and CRM.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
