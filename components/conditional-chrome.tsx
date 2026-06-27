"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AiAssistant } from "@/components/ai-assistant";

/**
 * Mostra o header/footer públicos em todas as páginas exceto no painel admin,
 * que tem o seu próprio layout (sidebar).
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // O painel admin e o portal do médico têm o seu próprio shell (sidebar).
  const isApp = pathname?.startsWith("/admin") || pathname?.startsWith("/area-membro");

  if (isApp) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <AiAssistant />
    </>
  );
}
