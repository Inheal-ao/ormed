"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  ShieldCheck,
  Coins,
  LayoutTemplate,
  Mail,
  FileCheck,
  MessageSquare,
  Building2,
  School,
  UserCog,
  User,
  Activity,
  IdCard,
  Menu,
  Search,
  Bell,
  X,
  Pill,
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
    case "aprovacoes": return c.aprovacoes;
    default: return 0;
  }
}

type NavLink = {
  href: string; label: string; icon: any; exact?: boolean;
  key?: string; manager?: boolean; uni?: boolean; colegio?: boolean; group?: string;
};

// Ordem das secções na barra lateral
const GROUP_ORDER = ["Conteúdo", "Institucional", "Médicos & Serviços", "Colégios & Internatos", "Instituições de Ensino", "Comunicação", "Administração"];

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
  { href: "/admin/hero", label: "Hero (Início)", icon: LayoutTemplate, key: "hero", group: "Institucional" },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3, key: "estatisticas", group: "Institucional" },
  { href: "/admin/especialidades", label: "Especialidades", icon: Stethoscope, key: "especialidades", group: "Institucional" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, key: "faqs", group: "Institucional" },
  { href: "/admin/testemunhos", label: "Testemunhos", icon: Quote, key: "testemunhos", group: "Institucional" },
  { href: "/admin/cronologia", label: "Cronologia", icon: History, key: "cronologia", group: "Institucional" },

  { href: "/admin/membros", label: "Membros (Médicos)", icon: IdCard, key: "membros", group: "Médicos & Serviços" },
  { href: "/admin/validacoes", label: "Validação de Docs", icon: FileCheck, key: "validacoes", group: "Médicos & Serviços" },
  { href: "/admin/solicitacoes", label: "Documentos da Ordem", icon: FileText, key: "solicitacoes", group: "Médicos & Serviços" },
  { href: "/admin/apoio-pesquisa", label: "Apoio à Pesquisa", icon: Inbox, key: "apoio-pesquisa", group: "Médicos & Serviços" },
  { href: "/admin/receitas", label: "Receitas (Prescrições)", icon: Pill, key: "receitas", group: "Médicos & Serviços" },
  { href: "/admin/listas-universidades", label: "Universidades", icon: School, key: "listas-universidades", group: "Instituições de Ensino" },
  { href: "/admin/listas-universidades?tipo=ies", label: "IES", icon: Building2, key: "listas-universidades", group: "Instituições de Ensino" },
  { href: "/admin/listas-universidades?tipo=inaarees", label: "INAAREES", icon: Building2, key: "listas-universidades", group: "Instituições de Ensino" },

  { href: "/admin/colegios", label: "Colégios", icon: Stethoscope, key: "colegios", group: "Colégios & Internatos" },
  { href: "/admin/internos", label: "Internos", icon: GraduationCap, key: "internos", group: "Colégios & Internatos" },
  { href: "/admin/programas-internato", label: "Programas de Ensino", icon: BookOpen, key: "programas-internato", group: "Colégios & Internatos" },
  { href: "/admin/notas-rotacoes", label: "Notas das Rotações", icon: ClipboardList, key: "notas-rotacoes", group: "Colégios & Internatos" },

  { href: "/admin/denuncias", label: "Denúncias", icon: ShieldAlert, key: "denuncias", group: "Comunicação" },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare, key: "mensagens", group: "Comunicação" },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail, key: "newsletter", group: "Comunicação" },

  { href: "/admin/aprovacoes", label: "Aprovações", icon: ShieldCheck, key: "aprovacoes", manager: true, group: "Administração" },
  { href: "/admin/cotas", label: "Cotas", icon: Coins, manager: true, group: "Administração" },
  { href: "/admin/utilizadores", label: "Utilizadores", icon: UserCog, manager: true, group: "Administração" },
  { href: "/admin/relatorios", label: "Relatórios", icon: Activity, manager: true, group: "Administração" },
  { href: "/admin/definicoes", label: "Definições", icon: Settings, manager: true, group: "Administração" },

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

// Extrai o valor de ?tipo= de um href (ou "" se não existir).
function hrefTipo(href: string): string {
  const i = href.indexOf("tipo=");
  return i >= 0 ? href.slice(i + 5).split("&")[0] : "";
}

function pageTitleFor(path: string, tipo: string): string {
  if (path === "/admin") return "Painel";
  if (path === "/admin/perfil") return "O meu perfil";
  // Universidades / IES / INAAREES partilham o mesmo caminho — distingue-se pelo ?tipo=.
  if (path === "/admin/listas-universidades") {
    return tipo === "ies" ? "IES" : tipo === "inaarees" ? "INAAREES" : "Universidades";
  }
  const match = navLinks
    .filter((l) => !l.exact && path.startsWith(l.href.split("?")[0]))
    .sort((a, b) => b.href.split("?")[0].length - a.href.split("?")[0].length)[0];
  return match?.label ?? "Painel";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo") || "";
  const router = useRouter();
  const { user, loading, logout } = useAdminAuth();
  const { summary } = useNotifications();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navQuery, setNavQuery] = useState("");
  const [topSearch, setTopSearch] = useState("");
  const [userMenu, setUserMenu] = useState(false);

  // Normaliza barras finais (o site usa trailingSlash)
  const normalizedPath = pathname?.replace(/\/+$/, "") || "/admin";
  const isLoginPage = normalizedPath === "/admin/login";

  // Fecha o drawer/menus ao mudar de página
  useEffect(() => { setMobileOpen(false); setUserMenu(false); }, [normalizedPath]);

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

  const links = visibleLinks(user.role, user.permissions ?? []);
  const q = navQuery.trim().toLowerCase();
  const filtered = q ? links.filter((l) => l.label.toLowerCase().includes(q)) : null;
  const pageTitle = pageTitleFor(normalizedPath, tipo);
  const allowed = isPathAllowed(user.role, user.permissions ?? [], normalizedPath);
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();

  // Pesquisa global do topo: salta para a secção cujo nome corresponde.
  const submitTop = (e: React.FormEvent) => {
    e.preventDefault();
    const term = topSearch.trim().toLowerCase();
    if (!term) return;
    const match = links.find((l) => l.label.toLowerCase().includes(term));
    if (match) { router.push(match.href); setTopSearch(""); }
  };

  const renderItem = (link: NavLink) => {
    const linkPath = link.href.split("?")[0];
    let active: boolean;
    if (linkPath === "/admin/listas-universidades") {
      // As três entradas partilham o caminho; distingue-se pelo ?tipo=.
      active = normalizedPath === linkPath && hrefTipo(link.href) === tipo;
    } else {
      active = link.exact ? normalizedPath === link.href : normalizedPath.startsWith(linkPath);
    }
    const count = badgeFor(link, summary);
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`group relative flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-lg text-[13.5px] transition-colors ${
          active
            ? "bg-white/[0.07] text-white font-medium before:absolute before:left-0 before:inset-y-1.5 before:w-[3px] before:rounded-r-full before:bg-angola-gold"
            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
        }`}
      >
        <link.icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-angola-gold" : "text-slate-500 group-hover:text-slate-300"}`} />
        <span className="flex-1 truncate">{link.label}</span>
        {count > 0 && (
          <span className="text-[10.5px] font-bold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center bg-angola-gold text-angola-navy">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    );
  };

  // Função (não componente) para preservar o foco da pesquisa entre teclas.
  const sidebar = () => {
    const { standalone, groups } = groupedNav(links);
    return (
      <div className="flex flex-col h-full bg-angola-navy text-white">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
          <img src="/images/logo.svg" alt="ORMED" className="w-8 h-8 object-contain" />
          <div className="leading-tight">
            <p className="font-semibold text-sm">ORMED</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.15em]">Gestão</p>
          </div>
          <button type="button" onClick={() => setMobileOpen(false)} className="ml-auto md:hidden text-slate-300 hover:text-white" aria-label="Fechar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2 bg-white/[0.06] rounded-lg px-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              value={navQuery}
              onChange={(e) => setNavQuery(e.target.value)}
              placeholder="Procurar secção..."
              className="flex-1 bg-transparent py-2 text-[13px] text-white placeholder:text-slate-500 outline-none"
            />
            {navQuery && <button type="button" onClick={() => setNavQuery("")} aria-label="Limpar" className="text-slate-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>}
          </div>
        </div>

        <nav className="flex-1 px-3 pb-4 overflow-y-auto">
          {filtered ? (
            <div className="space-y-0.5 pt-1">
              {filtered.length === 0 ? <p className="text-xs text-slate-500 px-3 py-4">Nada encontrado.</p> : filtered.map(renderItem)}
            </div>
          ) : (
            <>
              <div className="space-y-0.5 mb-1.5 pt-1">{standalone.map(renderItem)}</div>
              {groups.map((g) => {
                const isCollapsed = collapsed[g.label];
                const groupTotal = g.links.reduce((a, l) => a + badgeFor(l, summary), 0);
                return (
                  <div key={g.label} className="mb-1">
                    <button
                      type="button"
                      onClick={() => setCollapsed((p) => ({ ...p, [g.label]: !p[g.label] }))}
                      className="w-full flex items-center gap-2 px-3 pt-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-500 hover:text-slate-300"
                    >
                      <span className="flex-1 text-left truncate">{g.label}</span>
                      {groupTotal > 0 && isCollapsed && (
                        <span className="text-[9px] font-bold bg-angola-gold text-angola-navy rounded-full px-1.5 py-0.5">{groupTotal}</span>
                      )}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                    </button>
                    {!isCollapsed && <div className="space-y-0.5">{g.links.map(renderItem)}</div>}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        <Link href="/admin/perfil" className="flex items-center gap-3 px-4 py-3 border-t border-white/10 hover:bg-white/[0.04] shrink-0">
          <span className="w-8 h-8 rounded-full bg-angola-gold/20 text-angola-gold flex items-center justify-center text-xs font-bold shrink-0">{initial}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar desktop */}
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-30">{sidebar()}</aside>

      {/* Drawer mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[82%] shadow-2xl">{sidebar()}</div>
        </div>
      )}

      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur border-b border-gray-200 flex items-center gap-3 px-4 md:px-7">
          <button type="button" onClick={() => setMobileOpen(true)} className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900" aria-label="Abrir menu">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate shrink-0">{pageTitle}</h1>

          {/* Pesquisa em destaque (salta para a secção) */}
          <form onSubmit={submitTop} className="hidden lg:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                placeholder="Pesquisar secção do painel…"
                aria-label="Pesquisar no painel"
                className="w-full h-10 pl-10 pr-4 rounded-full bg-gray-100 border border-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:bg-white focus:border-angola-gold focus:ring-2 focus:ring-angola-gold/20"
              />
            </div>
          </form>

          <div className="ml-auto lg:ml-0 flex items-center gap-1">
            {user.role !== "universidade" && (
              <Link href="/admin" className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors" aria-label="Notificações">
                <Bell className="w-5 h-5" />
                {(summary?.total ?? 0) > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {(summary?.total ?? 0) > 99 ? "99+" : summary?.total}
                  </span>
                )}
              </Link>
            )}
            <div className="relative">
              <button type="button" onClick={() => setUserMenu((v) => !v)} className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="w-8 h-8 rounded-full bg-angola-navy text-white flex items-center justify-center text-xs font-bold">{initial}</span>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{user.name?.split(" ")[0]}</span>
                <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400" />
              </button>
              {userMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-20 py-1.5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/admin/perfil" className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 text-gray-400" /> O meu perfil
                    </Link>
                    <button type="button" onClick={() => logout()} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Terminar sessão
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-7 lg:p-8 max-w-6xl w-full mx-auto">
          {allowed ? children : (
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
