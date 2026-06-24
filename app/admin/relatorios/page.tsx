"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Printer, Activity, User as UserIcon } from "lucide-react";
import { api } from "@/lib/api";
import { ManagedUser } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { printTable } from "@/lib/print";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Administrador", admin: "Administrador", editor: "Editor",
  bastonaria: "Bastonária", funcionario: "Funcionário", universidade: "Universidade",
  colegio: "Presidente do Colégio",
};

interface Report {
  from: string;
  to: string;
  total: number;
  byUser: { userId: string; email: string; role: string; count: number }[];
  operations: { email: string; role: string; action: string; section: string; method: string; at: string }[];
}

const RANGES = [
  { key: "today", label: "Hoje" },
  { key: "week", label: "Última semana" },
];

export default function RelatoriosPage() {
  const [range, setRange] = useState("today");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [names, setNames] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rep, users] = await Promise.all([
        api.get<Report>(`/audit/report?range=${range}`, true),
        api.get<ManagedUser[]>("/users", true).catch(() => [] as ManagedUser[]),
      ]);
      setReport(rep);
      const map: Record<string, string> = {};
      users.forEach((u) => { map[u.email] = u.name; });
      setNames(map);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  const nameOf = (email: string) => names[email] || email;

  const print = () => {
    if (!report) return;
    printTable(
      `Relatório de operações — ${RANGES.find((r) => r.key === range)?.label}`,
      `Total: ${report.total} operações · ${new Date(report.from).toLocaleString("pt-PT")} a ${new Date(report.to).toLocaleString("pt-PT")}`,
      ["Data/Hora", "Funcionário", "Perfil", "Operação"],
      report.operations.map((o) => [new Date(o.at).toLocaleString("pt-PT"), nameOf(o.email), ROLE_LABEL[o.role] ?? o.role, o.action]),
    );
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title="Relatório de Operações" description="Resumo das ações feitas pelos funcionários na plataforma." />
        {report && report.total > 0 && (
          <button type="button" onClick={print} className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 shrink-0">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6">
        {RANGES.map((r) => (
          <button key={r.key} type="button" onClick={() => setRange(r.key)} className={`px-4 py-2 rounded-lg text-sm font-medium ${range === r.key ? "bg-angola-navy text-white" : "bg-gray-100 text-gray-600"}`}>
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : !report || report.total === 0 ? (
        <p className="text-gray-500 text-center py-16">Sem operações registadas neste período.</p>
      ) : (
        <>
          {/* Resumo por funcionário */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-angola-navy" />
              <h2 className="font-bold text-gray-900">{report.total} operações</h2>
              <span className="text-sm text-gray-400">· {report.byUser.length} utilizador(es)</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {report.byUser.map((u) => (
                <div key={u.userId} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-9 h-9 rounded-full bg-angola-gold/20 text-angola-navy flex items-center justify-center shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{nameOf(u.email)}</p>
                    <p className="text-xs text-gray-500">{ROLE_LABEL[u.role] ?? u.role}</p>
                  </div>
                  <span className="text-lg font-bold text-angola-navy">{u.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista detalhada */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 pt-4 pb-2">Detalhe das operações</p>
            <div className="divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
              {report.operations.map((o, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-xs text-gray-400 w-32 shrink-0">{new Date(o.at).toLocaleString("pt-PT")}</span>
                  <span className="text-sm font-medium text-gray-800 truncate w-40 shrink-0">{nameOf(o.email)}</span>
                  <span className="text-sm text-gray-600 truncate flex-1">{o.action}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
