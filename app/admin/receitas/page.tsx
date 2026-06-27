"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Pill, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";

interface Item { medicamento: string; dosagem: string; posologia: string; duracao: string; quantidade: string }
interface Prescription {
  _id: string; code: string; medicoName: string; medicoNumeroOrdem: string; especialidade: string;
  patientName: string; patientIdade?: string; items: Item[]; observacoes?: string; status: string; createdAt: string;
}

export default function ReceitasAdminPage() {
  const [items, setItems] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    api.get<Prescription[]>("/prescriptions/admin/all", true).then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  const q = search.trim().toLowerCase();
  const shown = q
    ? items.filter((p) => [p.code, p.medicoName, p.patientName, p.medicoNumeroOrdem].some((v) => (v || "").toLowerCase().includes(q)))
    : items;

  return (
    <div className="max-w-4xl">
      <PageHeader title="Receitas (Prescrições)" description="Histórico de todas as receitas médicas eletrónicas emitidas na plataforma." />

      <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg px-3 py-2 mb-4">
        As receitas são <strong>emitidas pelos médicos</strong> na Área do Membro (portal do médico). Aqui a Ordem consulta o histórico.
      </div>

      <div className="flex gap-2 mb-5">
        <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-3 bg-white">
          <Search className="w-4 h-4 text-gray-400" />
          <input className="flex-1 py-2 text-sm outline-none text-gray-900" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por código, médico, utente, nº de ordem..." />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : shown.length === 0 ? (
        <p className="text-gray-500 text-center py-12">{items.length === 0 ? "Ainda não há receitas emitidas." : "Sem resultados."}</p>
      ) : (
        <div className="space-y-2">
          {shown.map((p) => {
            const isOpen = open === p._id;
            return (
              <div key={p._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button type="button" onClick={() => setOpen(isOpen ? null : p._id)} className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50">
                  <span className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><Pill className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{p.patientName} <span className="text-xs text-gray-400 font-normal">· {p.items.length} medicamento(s)</span></p>
                    <p className="text-xs text-gray-500 font-mono">{p.code} · {p.medicoName} · {new Date(p.createdAt).toLocaleDateString("pt-PT")}</p>
                  </div>
                  {p.status === "anulada"
                    ? <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold shrink-0">Anulada</span>
                    : <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold shrink-0">Válida</span>}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3 mb-3">
                      <p><span className="text-gray-400">Médico:</span> {p.medicoName} (Nº Ordem {p.medicoNumeroOrdem})</p>
                      <p><span className="text-gray-400">Especialidade:</span> {p.especialidade || "—"}</p>
                      <p><span className="text-gray-400">Utente:</span> {p.patientName}{p.patientIdade ? ` · ${p.patientIdade} anos` : ""}</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg divide-y">
                      {p.items.map((it, i) => (
                        <div key={i} className="px-3 py-2">
                          <p className="text-sm font-medium text-gray-900">{it.medicamento}{it.dosagem ? ` — ${it.dosagem}` : ""}</p>
                          <p className="text-xs text-gray-500">{[it.posologia && `Posologia: ${it.posologia}`, it.duracao && `Duração: ${it.duracao}`, it.quantidade && `Qtd: ${it.quantidade}`].filter(Boolean).join(" · ")}</p>
                        </div>
                      ))}
                    </div>
                    {p.observacoes && <p className="text-sm text-gray-600 mt-3"><span className="text-gray-400">Observações:</span> {p.observacoes}</p>}
                    <Link href={`/receita/${encodeURIComponent(p.code)}/`} target="_blank" className="inline-flex items-center gap-1.5 mt-3 text-xs text-angola-blue hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Abrir página de verificação (imprimível)
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
