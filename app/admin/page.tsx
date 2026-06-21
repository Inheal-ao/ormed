"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import Link from "next/link";
import {
  Loader2, Layers, Eye, Bell, ArrowRight, Activity, Users,
  FileCheck, FileText, ShieldAlert, MessageSquare, Inbox, School, CalendarDays,
} from "lucide-react";
import { api } from "@/lib/api";
import { ManagedUser } from "@/lib/admin-types";
import { useAdminAuth } from "@/components/admin/auth-context";
import { useNotifications, NotifItem } from "@/components/admin/notifications-context";
import { isManagerRole } from "@/lib/permissions";

interface Source { key: string; path: string; paged: boolean; content?: boolean; perm: string; }

const SOURCES: Source[] = [
  { key: "Notícias", path: "/news/admin/all?limit=300", paged: true, content: true, perm: "noticias" },
  { key: "Comunicados", path: "/announcements/admin/all?limit=300", paged: true, content: true, perm: "comunicados" },
  { key: "Vagas", path: "/jobs/admin/all?limit=300", paged: true, content: true, perm: "vagas" },
  { key: "Eventos", path: "/events/admin/all?limit=300", paged: true, content: true, perm: "eventos" },
  { key: "Cursos", path: "/courses/admin/all?limit=300", paged: true, content: true, perm: "cursos" },
  { key: "Revistas", path: "/magazines/admin/all?limit=300", paged: true, content: true, perm: "revistas" },
  { key: "Boletins", path: "/bulletins/admin/all?limit=300", paged: true, content: true, perm: "boletins" },
  { key: "Livros", path: "/books/admin/all?limit=300", paged: true, content: true, perm: "livros" },
  { key: "Podcast", path: "/podcast/admin/all?limit=300", paged: true, content: true, perm: "podcast" },
  { key: "RevMed", path: "/revmed/admin/all?limit=300", paged: true, content: true, perm: "revmed" },
  { key: "Bastonários", path: "/bastonarios/admin/all", paged: false, perm: "bastonarios" },
  { key: "Parceiros", path: "/partners/admin/all", paged: false, perm: "parceiros" },
  { key: "Galeria", path: "/gallery/admin/all", paged: false, perm: "galeria" },
];

interface ItemLike { isPublished?: boolean; category?: string; createdAt?: string; }

const COLORS = ["#002147", "#FFD700", "#14B8A6", "#6366F1", "#10B981", "#0EA5E9", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const NOTIF_META: { key: string; label: string; link: string; perm: string[] }[] = [
  { key: "validacoes", label: "Validações", link: "/admin/validacoes", perm: ["validacoes"] },
  { key: "solicitacoes", label: "Documentos da Ordem", link: "/admin/solicitacoes", perm: ["solicitacoes"] },
  { key: "denuncias", label: "Denúncias", link: "/admin/denuncias", perm: ["denuncias"] },
  { key: "mensagens", label: "Mensagens", link: "/admin/mensagens", perm: ["mensagens"] },
  { key: "inscricoes", label: "Inscrições", link: "/admin/eventos", perm: ["eventos", "cursos"] },
  { key: "apoioPesquisa", label: "Apoio à Pesquisa", link: "/admin/apoio-pesquisa", perm: ["apoio-pesquisa"] },
  { key: "listas", label: "Listas de finalistas", link: "/admin/listas-universidades", perm: ["listas-universidades"] },
];

const TYPE_ICON: Record<string, { icon: typeof FileCheck; color: string }> = {
  "Validação": { icon: FileCheck, color: "bg-blue-100 text-blue-600" },
  "Documento da Ordem": { icon: FileText, color: "bg-indigo-100 text-indigo-600" },
  "Denúncia/Reclamação": { icon: ShieldAlert, color: "bg-red-100 text-red-600" },
  "Mensagem": { icon: MessageSquare, color: "bg-teal-100 text-teal-600" },
  "Apoio à Pesquisa": { icon: Inbox, color: "bg-amber-100 text-amber-600" },
  "Lista de Finalistas": { icon: School, color: "bg-emerald-100 text-emerald-600" },
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Administrador", admin: "Administrador", bastonaria: "Bastonária",
  funcionario: "Funcionário", editor: "Editor",
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60); if (m < 60) return `há ${m}min`;
  const h = Math.floor(m / 60); if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24); if (d < 7) return `há ${d}d`;
  return new Date(iso).toLocaleDateString("pt-PT");
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const { summary } = useNotifications();
  const manager = isManagerRole(user?.role);
  const perms = user?.permissions ?? [];
  const [loading, setLoading] = useState(true);
  const [byType, setByType] = useState<{ name: string; total: number }[]>([]);
  const [pubData, setPubData] = useState<{ name: string; value: number }[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; value: number }[]>([]);
  const [perMonth, setPerMonth] = useState<{ name: string; total: number }[]>([]);
  const [totals, setTotals] = useState({ all: 0, published: 0, draft: 0 });
  const [team, setTeam] = useState<ManagedUser[]>([]);

  useEffect(() => {
    const load = async () => {
      const mySources = manager ? SOURCES : SOURCES.filter((s) => perms.includes(s.perm));
      const results = await Promise.allSettled(mySources.map((s) => api.get<unknown>(s.path, true)));

      const typeCounts: { name: string; total: number }[] = [];
      const categoryMap: Record<string, number> = {};
      const monthMap: Record<string, number> = {};
      let published = 0, draft = 0, all = 0;

      results.forEach((r, i) => {
        const src = mySources[i];
        if (r.status !== "fulfilled") { typeCounts.push({ name: src.key, total: 0 }); return; }
        const value = r.value as { items?: ItemLike[]; total?: number } | ItemLike[];
        const items: ItemLike[] = Array.isArray(value) ? value : value.items ?? [];
        const total = Array.isArray(value) ? value.length : value.total ?? items.length;
        typeCounts.push({ name: src.key, total });
        all += total;
        items.forEach((it) => {
          if (src.content) { if (it.isPublished) published += 1; else draft += 1; }
          if ((src.key === "Notícias" || src.key === "Comunicados") && it.category) {
            categoryMap[it.category] = (categoryMap[it.category] ?? 0) + 1;
          }
          if (it.createdAt) {
            const d = new Date(it.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            monthMap[key] = (monthMap[key] ?? 0) + 1;
          }
        });
      });

      const months: { name: string; total: number }[] = [];
      const now = new Date();
      for (let k = 7; k >= 0; k--) {
        const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ name: MONTHS[d.getMonth()], total: monthMap[key] ?? 0 });
      }

      setByType(typeCounts.sort((a, b) => b.total - a.total));
      setPubData([{ name: "Publicado", value: published }, { name: "Rascunho", value: draft }]);
      setByCategory(Object.entries(categoryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value));
      setPerMonth(months);
      setTotals({ all, published, draft });

      // Equipa (só gestores)
      if (manager) {
        try {
          const users = await api.get<ManagedUser[]>("/users", true);
          setTeam(users.filter((u) => u.role !== "universidade").slice(0, 10));
        } catch { /* ignora */ }
      }
      setLoading(false);
    };
    load();
  }, [user]); // eslint-disable-line

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
        <p className="text-gray-500 text-sm">A carregar o painel...</p>
      </div>
    );
  }

  const pendencias = summary?.total ?? 0;
  const solicitacoes = (summary?.counts.validacoes ?? 0) + (summary?.counts.solicitacoes ?? 0);
  const allowedNotif = NOTIF_META.filter((m) => manager || m.perm.some((p) => perms.includes(p)));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(" ")[0]}</h1>
        <p className="text-gray-500">Visão geral da plataforma ORMED.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6 items-start">
        {/* ===== Coluna principal ===== */}
        <div className="space-y-6 min-w-0">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi icon={Layers} label="Total de registos" value={totals.all} color="bg-angola-navy" />
            <Kpi icon={Eye} label="Publicados" value={totals.published} color="bg-emerald-500" />
            <Kpi icon={Bell} label="Pendências" value={pendencias} color="bg-amber-500" highlight={pendencias > 0} />
            <Kpi icon={FileCheck} label="Solicitações em curso" value={solicitacoes} color="bg-indigo-500" />
          </div>

          {/* Tiras de pendentes por serviço */}
          {allowedNotif.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Pendentes por serviço</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {allowedNotif.map((m) => {
                  const n = (summary?.counts as Record<string, number>)?.[m.key] ?? 0;
                  return (
                    <Link key={m.key} href={m.link} className={`rounded-xl p-3 border transition flex items-center justify-between ${n > 0 ? "border-angola-gold/40 bg-angola-cream/40 hover:bg-angola-cream" : "border-gray-100 bg-gray-50"}`}>
                      <span className="text-xs text-gray-600 leading-tight">{m.label}</span>
                      <span className={`text-lg font-bold ${n > 0 ? "text-angola-navy" : "text-gray-300"}`}>{n}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gráficos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card title="Conteúdo por tipo" className="sm:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byType} margin={{ top: 8, right: 8, left: -20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Atividade por mês">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={perMonth} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#C9A400" fill="url(#g)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Publicado vs. Rascunho">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pubData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} label>
                    <Cell fill="#10B981" />
                    <Cell fill="#F59E0B" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {byCategory.length > 0 && (
              <Card title="Notícias e comunicados por categoria" className="sm:col-span-2">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        </div>

        {/* ===== Coluna lateral ===== */}
        <aside className="space-y-6 xl:sticky xl:top-6">
          {/* Centro de notificações */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-angola-navy" />
                {pendencias > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
              </div>
              <h2 className="font-bold text-gray-900">Notificações</h2>
              {pendencias > 0 && <span className="ml-auto text-xs bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">{pendencias}</span>}
            </div>
            {!summary || summary.recent.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Sem operações pendentes. Tudo em dia! ✅</p>
            ) : (
              <div className="space-y-1 max-h-[420px] overflow-y-auto -mx-1">
                {summary.recent.map((r, i) => <NotifRow key={i} item={r} />)}
              </div>
            )}
          </div>

          {/* Equipa (gestores) */}
          {manager && team.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-angola-navy" />
                <h2 className="font-bold text-gray-900">Equipa</h2>
                <Link href="/admin/utilizadores" className="ml-auto text-xs text-angola-blue hover:underline">Gerir</Link>
              </div>
              <div className="space-y-3">
                {team.map((u) => (
                  <div key={u._id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-angola-gold/20 text-angola-navy flex items-center justify-center text-sm font-bold shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-500">{ROLE_LABEL[u.role] ?? u.role}</p>
                    </div>
                    {u.isBlocked && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">bloqueado</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color, highlight }: { icon: typeof Layers; label: string; value: number; color: string; highlight?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border p-5 ${highlight ? "border-angola-gold/50" : "border-gray-200"}`}>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-5 ${className}`}>
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function NotifRow({ item }: { item: NotifItem }) {
  const meta = TYPE_ICON[item.type] ?? { icon: CalendarDays, color: "bg-gray-100 text-gray-500" };
  const Icon = meta.icon;
  return (
    <Link href={item.link} className="flex items-start gap-3 px-1 py-2.5 rounded-lg hover:bg-gray-50 group">
      <div className={`w-8 h-8 rounded-lg ${meta.color} flex items-center justify-center shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-angola-navy">{item.type}</p>
        <p className="text-sm text-gray-700 truncate">{item.label}</p>
        <p className="text-[11px] text-gray-400">{timeAgo(item.at)}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-angola-navy shrink-0 mt-1" />
    </Link>
  );
}
