"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ShieldCheck, ShieldAlert, ShieldX, Pill, FileX } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Item { medicamento: string; dosagem: string; posologia: string; duracao: string; quantidade: string }
interface Receita {
  code: string; medicoName: string; medicoNumeroOrdem: string; especialidade: string; medicoSituacao: string;
  patientName: string; patientIdade?: string; items: Item[]; observacoes?: string; status: string; data?: string;
}

const SIT: Record<string, { label: string; cls: string; icon: typeof ShieldCheck }> = {
  vigor: { label: "Médico em situação regular", cls: "bg-green-100 text-green-700", icon: ShieldCheck },
  suspensa: { label: "Médico com inscrição suspensa", cls: "bg-amber-100 text-amber-700", icon: ShieldAlert },
  cancelada: { label: "Médico com inscrição cancelada", cls: "bg-red-100 text-red-700", icon: ShieldX },
};

export default function VerificarReceitaPage() {
  const params = useParams();
  const code = decodeURIComponent(String(params.code ?? ""));
  const [data, setData] = useState<Receita | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/prescriptions/public/${encodeURIComponent(code)}`);
        if (!res.ok) { setNotFound(true); return; }
        setData(await res.json());
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [code]);

  const sit = data ? (SIT[data.medicoSituacao] ?? null) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-angola-navy text-white p-5 flex items-center gap-3">
          <img src="/images/logo.svg" alt="ORMED" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-angola-gold text-[11px] font-semibold uppercase tracking-wide">Ordem dos Médicos de Angola</p>
            <p className="text-sm font-medium">Verificação de Receita Médica</p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : notFound || !data ? (
            <div className="text-center py-8">
              <FileX className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Receita não encontrada</p>
              <p className="text-sm text-gray-500 mt-1">O código <span className="font-mono">{code}</span> não consta no registo da Ordem.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-xs text-gray-400">Receita</p>
                  <p className="font-mono font-bold text-gray-900">{data.code}</p>
                </div>
                {data.status === "anulada"
                  ? <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">ANULADA</span>
                  : <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">VÁLIDA</span>}
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <div><p className="text-gray-400 text-xs">Médico</p><p className="font-medium text-gray-900">{data.medicoName}</p>
                  <p className="text-xs text-gray-500 font-mono">Nº Ordem {data.medicoNumeroOrdem}{data.especialidade ? ` · ${data.especialidade}` : ""}</p></div>
                <div><p className="text-gray-400 text-xs">Utente</p><p className="font-medium text-gray-900">{data.patientName}</p>
                  <p className="text-xs text-gray-500">{data.data ? new Date(data.data).toLocaleDateString("pt-PT") : ""}{data.patientIdade ? ` · ${data.patientIdade} anos` : ""}</p></div>
              </div>

              {sit && (
                <div className={`mt-4 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm ${sit.cls}`}>
                  <sit.icon className="w-5 h-5" /> <span className="font-semibold">{sit.label}</span>
                </div>
              )}

              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Pill className="w-4 h-4" /> Medicamentos prescritos</p>
                <div className="border border-gray-200 rounded-xl divide-y">
                  {data.items.map((it, i) => (
                    <div key={i} className="px-4 py-2.5">
                      <p className="text-sm font-medium text-gray-900">{it.medicamento}{it.dosagem ? ` — ${it.dosagem}` : ""}</p>
                      <p className="text-xs text-gray-500">
                        {[it.posologia && `Posologia: ${it.posologia}`, it.duracao && `Duração: ${it.duracao}`, it.quantidade && `Qtd: ${it.quantidade}`].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {data.observacoes && <p className="text-sm text-gray-600 mt-4"><span className="text-gray-400">Observações:</span> {data.observacoes}</p>}
              <p className="text-[11px] text-gray-400 mt-5 text-center">Documento verificado junto da Ordem dos Médicos de Angola.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
