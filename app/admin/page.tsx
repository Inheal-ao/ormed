"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import Link from "next/link";
import { Loader2, FileText, Eye, EyeOff, Layers, Bell, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/components/admin/auth-context";
import { useNotifications } from "@/components/admin/notifications-context";
import { isManagerRole } from "@/lib/permissions";

const NOTIF_META: { key: string; label: string; link: string; perm: string[] }[] = [
  { key: "validacoes", label: "Validações", link: "/admin/validacoes", perm: ["validacoes"] },
  { key: "solicitacoes", label: "Documentos da Ordem", link: "/admin/solicitacoes", perm: ["solicitacoes"] },
  { key: "denuncias", label: "Denúncias", link: "/admin/denuncias", perm: ["denuncias"] },
  { key: "mensagens", label: "Mensagens", link: "/admin/mensagens", perm: ["mensagens"] },
  { key: "inscricoes", label: "Inscrições", link: "/admin/eventos", perm: ["eventos", "cursos"] },
  { key: "apoioPesquisa", label: "Apoio à Pesquisa", link: "/admin/apoio-pesquisa", perm: ["apoio-pesquisa"] },
  { key: "listas", label: "Listas de finalistas", link: "/admin/listas-universidades", perm: ["listas-universidades"] },
];

function NotificationsPanel() {
  const { summary } = useNotifications();
  const { user } = useAdminAuth();
  const manager = isManagerRole(user?.role);
  const perms = user?.permissions ?? [];
  const allowed = NOTIF_META.filter((m) => manager || m.perm.some((p) => perms.includes(p)));
  if (!summary || allowed.length === 0) return null;
  const counts = summary.counts as Record<string, number>;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-angola-navy" />
          {summary.total > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />}
        </div>
        <h2 className="font-bold text-gray-900">Notificações</h2>
        <span className="text-sm text-gray-400">{summary.total} pendente(s)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-5">
        {allowed.map((m) => {
          const n = counts[m.key] ?? 0;
          return (
            <Link key={m.key} href={m.link} className={`rounded-xl p-3 text-center border transition ${n > 0 ? "border-angola-gold/40 bg-angola-cream/40 hover:bg-angola-cream" : "border-gray-100 bg-gray-50"}`}>
              <p className={`text-2xl font-bold ${n > 0 ? "text-angola-navy" : "text-gray-300"}`}>{n}</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{m.label}</p>
            </Link>
          );
        })}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Operações em curso</p>
        {summary.recent.length === 0 ? (
          <p className="text-sm text-gray-400 py-3">Sem operações pendentes. Tudo em dia! ✅</p>
        ) : (
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {summary.recent.map((r, i) => (
              <Link key={i} href={r.link} className="flex items-center gap-3 py-2.5 hover:bg-gray-50 -mx-2 px-2 rounded-lg group">
                <span className="text-[10px] font-medium bg-angola-navy/5 text-angola-navy px-2 py-0.5 rounded-full shrink-0">{r.type}</span>
                <span className="text-sm text-gray-700 truncate flex-1">{r.label}</span>
                <span className="text-xs text-gray-400 shrink-0">{new Date(r.at).toLocaleDateString("pt-PT")}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-angola-navy shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface Source {
  key: string;
  path: string;
  paged: boolean;
  content?: boolean; // tem isPublished
  perm: string;
}

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

interface ItemLike {
  isPublished?: boolean;
  category?: string;
  createdAt?: string;
}

const COLORS = ["#002147", "#FFD700", "#14B8A6", "#6366F1", "#10B981", "#0EA5E9", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [byType, setByType] = useState<{ name: string; total: number }[]>([]);
  const [pubData, setPubData] = useState<{ name: string; value: number }[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; value: number }[]>([]);
  const [perMonth, setPerMonth] = useState<{ name: string; total: number }[]>([]);
  const [totals, setTotals] = useState({ all: 0, published: 0, draft: 0 });

  useEffect(() => {
    const load = async () => {
      // Só agrega as secções a que o utilizador tem acesso
      const manager = isManagerRole(user?.role);
      const perms = user?.permissions ?? [];
      const mySources = manager ? SOURCES : SOURCES.filter((s) => perms.includes(s.perm));

      const results = await Promise.allSettled(
        mySources.map((s) => api.get<unknown>(s.path, true)),
      );

      const typeCounts: { name: string; total: number }[] = [];
      const categoryMap: Record<string, number> = {};
      const monthMap: Record<string, number> = {};
      let published = 0;
      let draft = 0;
      let all = 0;

      results.forEach((r, i) => {
        const src = mySources[i];
        if (r.status !== "fulfilled") {
          typeCounts.push({ name: src.key, total: 0 });
          return;
        }
        const value = r.value as { items?: ItemLike[]; total?: number } | ItemLike[];
        const items: ItemLike[] = Array.isArray(value) ? value : value.items ?? [];
        const total = Array.isArray(value) ? value.length : value.total ?? items.length;
        typeCounts.push({ name: src.key, total });
        all += total;

        items.forEach((it) => {
          if (src.content) {
            if (it.isPublished) published += 1;
            else draft += 1;
          }
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

      // Últimos 8 meses
      const months: { name: string; total: number }[] = [];
      const now = new Date();
      for (let k = 7; k >= 0; k--) {
        const d = new Date(now.getFullYear(), now.getMonth() - k, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ name: `${MONTHS[d.getMonth()]}`, total: monthMap[key] ?? 0 });
      }

      setByType(typeCounts.sort((a, b) => b.total - a.total));
      setPubData([
        { name: "Publicado", value: published },
        { name: "Rascunho", value: draft },
      ]);
      setByCategory(
        Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value),
      );
      setPerMonth(months);
      setTotals({ all, published, draft });
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
        <p className="text-gray-500 text-sm">A carregar estatísticas...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Olá, {user?.name?.split(" ")[0]}</h1>
      <p className="text-gray-500 mb-8">Visão geral de toda a plataforma ORMED.</p>

      <NotificationsPanel />

      {/* Cartões de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={Layers} label="Total de registos" value={totals.all} color="bg-angola-navy" />
        <SummaryCard icon={Eye} label="Publicados" value={totals.published} color="bg-medical-emerald" />
        <SummaryCard icon={EyeOff} label="Rascunhos" value={totals.draft} color="bg-amber-500" />
        <SummaryCard icon={FileText} label="Tipos de conteúdo" value={byType.filter((t) => t.total > 0).length} color="bg-medical-indigo" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conteúdo por tipo */}
        <ChartCard title="Conteúdo por tipo" full>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byType} margin={{ top: 8, right: 8, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                {byType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Publicado vs rascunho */}
        <ChartCard title="Publicado vs. Rascunho">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={pubData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} label>
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Por categoria */}
        <ChartCard title="Notícias e comunicados por categoria">
          {byCategory.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {byCategory.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Atividade por mês */}
        <ChartCard title="Conteúdo criado por mês (últimos 8 meses)">
          <ResponsiveContainer width="100%" height={320}>
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
        </ChartCard>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon, label, value, color,
}: {
  icon: typeof Layers;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function ChartCard({ title, children, full }: { title: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${full ? "lg:col-span-2" : ""}`}>
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="h-[320px] flex items-center justify-center text-gray-400 text-sm">
      Sem dados ainda.
    </div>
  );
}
