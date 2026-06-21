import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalChrome } from "@/components/conditional-chrome";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/analytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ormed-qx3s.vercel.app";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const SITE_DESCRIPTION =
  "A Ordem dos Médicos de Angola é a instituição de utilidade pública que regula o exercício da profissão médica em Angola desde 1991. Pela Dignidade Médica Rumo à Excelência.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ordem dos Médicos de Angola | ORMED",
    template: "%s | ORMED",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Ordem dos Médicos Angola",
    "ORMED",
    "medicina Angola",
    "médicos Angola",
    "regulação médica",
    "ética médica",
    "saúde Angola",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: SITE_URL,
    siteName: "Ordem dos Médicos de Angola",
    title: "Ordem dos Médicos de Angola | ORMED",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/hero-1.jpg", width: 1200, height: 630, alt: "Ordem dos Médicos de Angola" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ordem dos Médicos de Angola | ORMED",
    description: SITE_DESCRIPTION,
    images: ["/images/hero-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/images/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} min-h-screen bg-background font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ConditionalChrome>{children}</ConditionalChrome>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
