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
  BarChart3,
  Stethoscope,
  Mic,
  BookMarked,
  Images,
  FileText,
  FlaskConical,
  HelpCircle,
  Quote,
  History,
  GraduationCap,
  Briefcase,
  Megaphone,
  Inbox,
  ShieldAlert,
  Mail,
  FileCheck,
  MessageSquare,
  Building2,
  School,
  UserCog,
  User,
  Activity,
} from "lucide-react";
import { useAdminAuth } from "@/components/admin/auth-context";
import { useNotifications, NotifSummary } from "@/components/admin/notifications-context";

function badgeFor(link: NavLink, summary: NotifSummary | null): number {
  if (!summary) return 0;
  if (link.exact) return summary.total; // Painel
  const c = summary.counts;
  switch (link.key) {
    case "validacoes": return c.validacoes;
    case "solicitacoes": return c.solicitacoes;
    case "denuncias": return c.denuncias;
    case "mensagens": return c.mensagens;
    case "apoio-pesquisa": return c.apoioPesquisa;
    case "listas-universidades": return c.listas;
    case "eventos": return c.inscricoes;
    default: return 0;
  }
}

type NavLink = {
  href: string; label: string; icon: any; exact?: boolean;
  key?: string; manager?: boolean; uni?: boolean;
};

const navLinks: NavLink[] = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper, key: "noticias" },
  { href: "/admin/comunicados", label: "Comunicados", icon: Megaphone, key: "comunicados" },
  { href: "/admin/vagas", label: "Vagas de Emprego", icon: Briefcase, key: "vagas" },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, key: "eventos" },
  { href: "/admin/cursos", label: "Formação/Cursos", icon: GraduationCap, key: "cursos" },
  { href: "/admin/revistas", label: "Revistas", icon: BookOpen, key: "revistas" },
  { href: "/admin/revmed", label: "RevMed", icon: FlaskConical, key: "revmed" },
  { href: "/admin/documentos", label: "Documentos", icon: FileText, key: "documentos" },
  { href: "/admin/boletins", label: "Boletins", icon: FileText, key: "boletins" },
  { href: "/admin/livros", label: "Livros", icon: BookMarked, key: "livros" },
  { href: "/admin/podcast", label: "Podcast", icon: Mic, key: "podcast" },
  { href: "/admin/galeria", label: "Galeria", icon: Images, key: "galeria" },
  { href: "/admin/bastonarios", label: "Bastonários", icon: Users, key: "bastonarios" },
  { href: "/admin/orgaos", label: "Órgãos", icon: Building2, key: "orgaos" },
  { href: "/admin/parceiros", label: "Parceiros", icon: Handshake, key: "parceiros" },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3, key: "estatisticas" },
  { href: "/admin/especialidades", label: "Especialidades", icon: Stethoscope, key: "especialidades" },
  { href: "/admin/apoio-pesquisa", label: "Apoio à Pesquisa", icon: Inbox, key: "apoio-pesquisa" },
  { href: "/admin/validacoes", label: "Validação de Docs", icon: FileCheck, key: "validacoes" },
  { href: "/admin/solicitacoes", label: "Documentos da Ordem", icon: FileText, key: "solicitacoes" },
  { href: "/admin/listas-universidades", label: "Listas das Universidades", icon: School, key: "listas-universidades" },
  { href: "/admin/denuncias", label: "Denúncias", icon: ShieldAlert, key: "denuncias" },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare, key: "mensagens" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, key: "newsletter" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, key: "faqs" },
  { href: "/admin/testemunhos", label: "Testemunhos", icon: Quote, key: "testemunhos" },
  { href: "/admin/cronologia", label: "Cronologia", icon: History, key: "cronologia" },
  // Gestão (apenas Admin/Bastonária)
  { href: "/admin/utilizadores", label: "Utilizadores", icon: UserCog, manager: true },
  { href: "/admin/relatorios", label: "Relatórios", icon: Activity, manager: true },
  { href: "/admin/definicoes", label: "Definições", icon: Settings, manager: true },
  // Portal da universidade
  { href: "/admin/minhas-listas", label: "Listas de Finalistas", icon: School, uni: true },
];

function visibleLinks(role: string, permissions: string[]): NavLink[] {
  if (role === "universidade") {
    return navLinks.filter((l) => l.uni);
  }
  const manager = role === "super_admin" || role === "admin" || role === "bastonaria";
  return navLinks.filter((l) => {
    if (l.uni) return false;
    if (l.manager) return manager;
    if (l.exact) return true; // Painel
    if (manager) return true; // gestores veem tudo
    // funcionário: só as secções permitidas
    return l.key ? permissions.includes(l.key) : false;
  });
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();
  const { summary } = useNotifications();

  // Normaliza barras finais (o site usa trailingSlash)
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/admin";
  const isLoginPage = normalizedPath === "/admin/login";

  // Redireciona para login se não autenticado (exceto na própria página de login)
  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, user, isLoginPage, router]);

  // Universidade só acede ao seu portal de listas
  useEffect(() => {
    if (!loading && user?.role === "universidade" && !isLoginPage && !normalizedPath.startsWith("/admin/minhas-listas") && normalizedPath !== "/admin/perfil") {
      router.replace("/admin/minhas-listas");
    }
  }, [loading, user, isLoginPage, normalizedPath, router]);

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
          {visibleLinks(user.role, user.permissions ?? []).map((link) => {
            const active = link.exact
              ? normalizedPath === link.href
              : normalizedPath.startsWith(link.href);
            const count = badgeFor(link, summary);
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
                <span className="flex-1">{link.label}</span>
                {count > 0 && (
                  <span className={`text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ${active ? "bg-angola-navy text-white" : "bg-angola-gold text-angola-navy"}`}>
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-2 text-xs text-gray-400 truncate">{user.email}</div>
          <Link
            href="/admin/perfil"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              normalizedPath === "/admin/perfil" ? "bg-angola-gold text-angola-navy font-medium" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <User className="w-4 h-4" />
            O meu perfil
          </Link>
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
