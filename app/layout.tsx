import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConditionalChrome } from "@/components/conditional-chrome";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Ordem dos Médicos de Angola | ORMED",
    template: "%s | ORMED",
  },
  description:
    "A Ordem dos Médicos de Angola é a instituição de utilidade pública que regula o exercício da profissão médica em Angola desde 1991. Pela Dignidade Médica Rumo à Excelência.",
  keywords: [
    "Ordem dos Médicos Angola",
    "ORMED",
    "medicina Angola",
    "médicos Angola",
    "regulação médica",
    "ética médica",
    "saúde Angola",
  ],
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
      </body>
    </html>
  );
}
