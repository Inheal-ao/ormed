"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ShieldCheck, ShieldAlert, ShieldX, Stethoscope } from "lucide-react";
import { API_URL } from "@/lib/api";

interface PublicMedico {
  name: string; numeroOrdem: string; especialidade: string; situacao: string;
  categorias: string[]; photo?: { url: string } | null;
}

const SITUACAO: Record<string, { label: string; cls: string; icon: typeof ShieldCheck }> = {
  vigor: { label: "Inscrição em Vigor", cls: "bg-green-100 text-green-700", icon: ShieldCheck },
  suspensa: { label: "Inscrição Suspensa", cls: "bg-amber-100 text-amber-700", icon: ShieldAlert },
  cancelada: { label: "Inscrição Cancelada", cls: "bg-red-100 text-red-700", icon: ShieldX },
};
const CAT: Record<string, string> = { clinico_geral: "Clínico Geral", interno: "Interno", especialista: "Especialista", orientador: "Orientador" };

export default function VerificarMedicoPage() {
  const params = useParams();
  const numeroOrdem = decodeURIComponent(String(params.numeroOrdem ?? ""));
  const [data, setData] = useState<PublicMedico | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/members/public/${encodeURIComponent(numeroOrdem)}`);
        if (!res.ok) { setNotFound(true); return; }
        setData(await res.json());
      } catch { setNotFound(true); } finally { setLoading(false); }
    })();
  }, [numeroOrdem]);

  const sit = data ? (SITUACAO[data.situacao] ?? SITUACAO.vigor) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-angola-navy text-white p-5 flex items-center gap-3">
          <img src="/images/logo-real.png" alt="ORMED" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-angola-gold text-[11px] font-semibold uppercase tracking-wide">Ordem dos Médicos de Angola</p>
            <p className="text-sm font-medium">Verificação de Médico</p>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : notFound || !data ? (
            <div className="text-center py-8">
              <ShieldX className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <p className="text-gray-700 font-medium">Médico não encontrado</p>
              <p className="text-sm text-gray-500 mt-1">O número de ordem <span className="font-mono">{numeroOrdem}</span> não consta no registo da Ordem.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                {data.photo?.url
                  ? <img src={data.photo.url} alt="" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                  : <div className="w-20 h-20 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center"><Stethoscope className="w-8 h-8" /></div>}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
                  <p className="text-sm text-gray-500">{data.especialidade || "Médico"}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">Nº de Ordem: {data.numeroOrdem}</p>
                </div>
              </div>

              {sit && (
                <div className={`mt-5 rounded-xl px-4 py-3 flex items-center gap-2 ${sit.cls}`}>
                  <sit.icon className="w-5 h-5" />
                  <span className="font-semibold">{sit.label}</span>
                </div>
              )}

              {(data.categorias ?? []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {data.categorias.map((c) => (
                    <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{CAT[c] ?? c}</span>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-gray-400 mt-5 text-center">Informação verificada junto da Ordem dos Médicos de Angola.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
