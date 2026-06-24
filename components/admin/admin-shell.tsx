"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  ChevronDown,
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
  IdCard,
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
  key?: string; manager?: boolean; uni?: boolean; colegio?: boolean; group?: string;
};

// Ordem das secções na barra lateral
const GROUP_ORDER = ["Conteúdo", "Institucional", "Serviços & Membros", "Colégios de Especialidades", "Comunicação", "Gestão"];

const navLinks: NavLink[] = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard, exact: true },

  { href: "/admin/noticias", label: "Notícias", icon: Newspaper, key: "noticias", group: "Conteúdo" },
  { href: "/admin/comunicados", label: "Comunicados", icon: Megaphone, key: "comunicados", group: "Conteúdo" },
  { href: "/admin/vagas", label: "Vagas de Emprego", icon: Briefcase, key: "vagas", group: "Conteúdo" },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, key: "eventos", group: "Conteúdo" },
  { href: "/admin/cursos", label: "Formação/Cursos", icon: GraduationCap, key: "cursos", group: "Conteúdo" },
  { href: "/admin/revistas", label: "Revistas", icon: BookOpen, key: "revistas", group: "Conteúdo" },
  { href: "/admin/revmed", label: "RevMed", icon: FlaskConical, key: "revmed", group: "Conteúdo" },
  { href: "/admin/documentos", label: "Documentos", icon: FileText, key: "documentos", group: "Conteúdo" },
  { href: "/admin/boletins", label: "Boletins", icon: FileText, key: "boletins", group: "Conteúdo" },
  { href: "/admin/livros", label: "Livros", icon: BookMarked, key: "livros", group: "Conteúdo" },
  { href: "/admin/podcast", label: "Podcast", icon: Mic, key: "podcast", group: "Conteúdo" },
  { href: "/admin/galeria", label: "Galeria", icon: Images, key: "galeria", group: "Conteúdo" },

  { href: "/admin/bastonarios", label: "Bastonários", icon: Users, key: "bastonarios", group: "Institucional" },
  { href: "/admin/orgaos", label: "Órgãos", icon: Building2, key: "orgaos", group: "Institucional" },
  { href: "/admin/parceiros", label: "Parceiros", icon: Handshake, key: "parceiros", group: "Institucional" },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3, key: "estatisticas", group: "Institucional" },
  { href: "/admin/especialidades", label: "Especialidades", icon: Stethoscope, key: "especialidades", group: "Institucional" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, key: "faqs", group: "Institucional" },
  { href: "/admin/testemunhos", label: "Testemunhos", icon: Quote, key: "testemunhos", group: "Institucional" },
  { href: "/admin/cronologia", label: "Cronologia", icon: History, key: "cronologia", group: "Institucional" },

  { href: "/admin/membros", label: "Membros (Médicos)", icon: IdCard, key: "membros", group: "Serviços & Membros" },
  { href: "/admin/validacoes", label: "Validação de Docs", icon: FileCheck, key: "validacoes", group: "Serviços & Membros" },
  { href: "/admin/solicitacoes", label: "Documentos da Ordem", icon: FileText, key: "solicitacoes", group: "Serviços & Membros" },
  { href: "/admin/apoio-pesquisa", label: "Apoio à Pesquisa", icon: Inbox, key: "apoio-pesquisa", group: "Serviços & Membros" },
  { href: "/admin/listas-universidades", label: "Universidades", icon: School, key: "listas-universidades", group: "Gestão" },

  { href: "/admin/colegios", label: "Colégios", icon: Stethoscope, key: "colegios", group: "Colégios de Especialidades" },
  { href: "/admin/internos", label: "Internos", icon: GraduationCap, key: "internos", group: "Colégios de Especialidades" },
  { href: "/admin/programas-internato", label: "Programas de Ensino", icon: BookOpen, key: "programas-internato", group: "Colégios de Especialidades" },
  { href: "/admin/notas-rotacoes", label: "Notas das Rotações", icon: ClipboardList, key: "notas-rotacoes", group: "Colégios de Especialidades" },

  { href: "/admin/denuncias", label: "Denúncias", icon: ShieldAlert, key: "denuncias", group: "Comunicação" },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare, key: "mensagens", group: "Comunicação" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, key: "newsletter", group: "Comunicação" },

  { href: "/admin/utilizadores", label: "Utilizadores", icon: UserCog, manager: true, group: "Gestão" },
  { href: "/admin/relatorios", label: "Relatórios", icon: Activity, manager: true, group: "Gestão" },
  { href: "/admin/definicoes", label: "Definições", icon: Settings, manager: true, group: "Gestão" },

  // Portais dedicados (perfis específicos)
  { href: "/admin/minhas-listas", label: "Listas de Finalistas", icon: School, uni: true },
];

const COLEGIO_KEYS = ["colegios", "internos", "programas-internato", "notas-rotacoes"];

/** Determina se o utilizador pode aceder a um caminho do painel. */
function isPathAllowed(role: string, permissions: string[], path: string): boolean {
  if (role === "super_admin" || role === "admin" || role === "bastonaria") return true;
  if (role === "universidade") return path.startsWith("/admin/minhas-listas") || path === "/admin/perfil";
  if (path === "/admin" || path === "/admin/perfil") return true;
  const allowed = visibleLinks(role, permissions).map((l) => l.href);
  return allowed.some((href) => href !== "/admin" && path.startsWith(href));
}

function visibleLinks(role: string, permissions: string[]): NavLink[] {
  if (role === "universidade") {
    return navLinks.filter((l) => l.uni);
  }
  if (role === "colegio") {
    // Colégio: só a secção dos colégios de especialidades
    return navLinks.filter((l) => l.exact || COLEGIO_KEYS.includes(l.key ?? ""));
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

/** Agrupa os links visíveis por secção, na ordem definida. */
function groupedNav(links: NavLink[]) {
  const standalone = links.filter((l) => !l.group);
  const groups = GROUP_ORDER.map((g) => ({ label: g, links: links.filter((l) => l.group === g) })).filter((g) => g.links.length > 0);
  return { standalone, groups };
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();
  const { summary } = useNotifications();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  // Funcionário só pode abrir páginas a que tem permissão (bloqueia acesso direto por URL)
  useEffect(() => {
    if (loading || !user || isLoginPage) return;
    if (user.role === "universidade") return; // tratado acima
    if (!isPathAllowed(user.role, user.permissions ?? [], normalizedPath)) {
      router.replace("/admin");
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
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {(() => {
            const { standalone, groups } = groupedNav(visibleLinks(user.role, user.permissions ?? []));
            const renderItem = (link: NavLink) => {
              const active = link.exact ? normalizedPath === link.href : normalizedPath.startsWith(link.href);
              const count = badgeFor(link, summary);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? "bg-angola-gold text-angola-navy font-medium" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{link.label}</span>
                  {count > 0 && (
                    <span className={`text-[11px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ${active ? "bg-angola-navy text-white" : "bg-angola-gold text-angola-navy"}`}>
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              );
            };
            return (
              <>
                <div className="space-y-1 mb-2">{standalone.map(renderItem)}</div>
                {groups.map((g) => {
                  const isCollapsed = collapsed[g.label];
                  const groupTotal = g.links.reduce((a, l) => a + badgeFor(l, summary), 0);
                  return (
                    <div key={g.label} className="mb-1">
                      <button
                        type="button"
                        onClick={() => setCollapsed((p) => ({ ...p, [g.label]: !p[g.label] }))}
                        className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-200"
                      >
                        <span className="flex-1 text-left truncate">{g.label}</span>
                        {groupTotal > 0 && isCollapsed && (
                          <span className="text-[10px] font-bold bg-angola-gold text-angola-navy rounded-full px-1.5">{groupTotal}</span>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                      </button>
                      {!isCollapsed && <div className="space-y-1">{g.links.map(renderItem)}</div>}
                    </div>
                  );
                })}
              </>
            );
          })()}
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
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
          {isPathAllowed(user.role, user.permissions ?? [], normalizedPath) ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-6 h-6 animate-spin text-angola-gold mb-3" />
              <p className="text-gray-500 text-sm">Não tem permissão para esta secção. A redirecionar...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
