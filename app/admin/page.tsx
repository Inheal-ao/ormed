"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from "recharts";
import { Loader2, FileText, Eye, EyeOff, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/components/admin/auth-context";

interface Source {
  key: string;
  path: string;
  paged: boolean;
  content?: boolean; // tem isPublished
}

const SOURCES: Source[] = [
  { key: "Notícias", path: "/news/admin/all?limit=300", paged: true, content: true },
  { key: "Comunicados", path: "/announcements/admin/all?limit=300", paged: true, content: true },
  { key: "Vagas", path: "/jobs/admin/all?limit=300", paged: true, content: true },
  { key: "Eventos", path: "/events/admin/all?limit=300", paged: true, content: true },
  { key: "Cursos", path: "/courses/admin/all?limit=300", paged: true, content: true },
  { key: "Revistas", path: "/magazines/admin/all?limit=300", paged: true, content: true },
  { key: "Boletins", path: "/bulletins/admin/all?limit=300", paged: true, content: true },
  { key: "Livros", path: "/books/admin/all?limit=300", paged: true, content: true },
  { key: "Podcast", path: "/podcast/admin/all?limit=300", paged: true, content: true },
  { key: "RevMed", path: "/revmed/admin/all?limit=300", paged: true, content: true },
  { key: "Bastonários", path: "/bastonarios/admin/all", paged: false },
  { key: "Parceiros", path: "/partners/admin/all", paged: false },
  { key: "Galeria", path: "/gallery/admin/all", paged: false },
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
      const results = await Promise.allSettled(
        SOURCES.map((s) => api.get<unknown>(s.path, true)),
      );

      const typeCounts: { name: string; total: number }[] = [];
      const categoryMap: Record<string, number> = {};
      const monthMap: Record<string, number> = {};
      let published = 0;
      let draft = 0;
      let all = 0;

      results.forEach((r, i) => {
        const src = SOURCES[i];
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
  }, []);

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
