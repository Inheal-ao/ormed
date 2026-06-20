"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  BookOpen,
  Users,
  Handshake,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { useAdminAuth } from "@/components/admin/auth-context";

const navLinks = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/revistas", label: "Revistas", icon: BookOpen },
  { href: "/admin/bastonarios", label: "Bastonários", icon: Users },
  { href: "/admin/parceiros", label: "Parceiros", icon: Handshake },
  { href: "/admin/definicoes", label: "Definições", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  // Redireciona para login se não autenticado (exceto na própria página de login)
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  // A página de login renderiza sem o shell
  if (isLoginPage) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-angola-navy text-white fixed inset-y-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-white/10">
          <img src="/images/logo.svg" alt="ORMED" className="w-8 h-8 object-contain" />
          <span className="font-semibold">Gestão ORMED</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-angola-gold text-angola-navy font-medium"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-gray-400 truncate">{user.email}</div>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 md:ml-64">
        {/* Topbar mobile */}
        <header className="md:hidden h-14 bg-angola-navy text-white flex items-center justify-between px-4 sticky top-0 z-10">
          <span className="font-semibold">Gestão ORMED</span>
          <button type="button" onClick={() => logout()} aria-label="Terminar sessão">
            <LogOut className="w-5 h-5" />
          </button>
        </header>
        <main className="p-4 md:p-8 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
