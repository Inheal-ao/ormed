"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, FileSignature, School, KeyRound, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";

interface UniList {
  _id: string;
  universityName: string;
  year: string;
  digitalPdf: Asset;
  signedScan: Asset;
  notes: string;
  submittedBy: string;
  status: string;
  createdAt: string;
  lastViewedAt?: string | null;
  viewCount?: number;
}

export default function ListasUniversidadesPage() {
  const { user } = useAdminAuth();
  const isGod = user?.role === "super_admin" || user?.role === "admin";
  const [lists, setLists] = useState<UniList[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async (codeValue?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<UniList[]>("/university-lists/admin/view", codeValue ? { code: codeValue } : {}, true);
      setLists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro. Verifique o código.");
    } finally {
      setLoading(false);
    }
  };

  // Admin (deus) carrega diretamente; Bastonária precisa de código.
  useEffect(() => {
    if (isGod) load();
  }, [isGod]); // eslint-disable-line

  // Marca como vista pela Ordem ao abrir um documento (o reitor passa a saber).
  const markSeen = (id: string) => {
    api.post(`/university-lists/admin/${id}/seen`, {}, true).catch(() => {});
    setLists((prev) => prev && prev.map((l) => (l._id === id ? { ...l, lastViewedAt: new Date().toISOString(), viewCount: (l.viewCount ?? 0) + 1 } : l)));
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Universidades" description="Canal de comunicação com as universidades — listas de finalistas enviadas, por ano académico." />

      {/* Bastonária: desbloquear com código */}
      {!isGod && lists === null && (
        <form onSubmit={(e) => { e.preventDefault(); load(code); }} className="bg-white border border-angola-gold/40 rounded-xl p-5 max-w-sm">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-angola-gold" /> Verificação de identidade</p>
          <p className="text-xs text-gray-500 mb-3">Introduza um dos seus códigos de acesso (uso único) para ver as listas.</p>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-center outline-none focus:ring-2 focus:ring-angola-gold" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" />
            <button type="submit" disabled={loading || code.length !== 6} className="px-4 rounded-lg bg-angola-navy text-white disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        </form>
      )}

      {loading && isGod && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>}
      {error && isGod && <p className="text-red-600">{error}</p>}

      {lists !== null && (
        lists.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Ainda não há listas enviadas.</p>
        ) : (
          <div className="space-y-3">
            {lists.map((l) => (
              <div key={l._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><School className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{l.universityName}</p>
                    <p className="text-xs text-gray-500">Finalistas {l.year} · enviado por {l.submittedBy || "—"} · {new Date(l.createdAt).toLocaleDateString("pt-PT")}</p>
                    {l.notes && <p className="text-sm text-gray-600 mt-1">{l.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t items-center">
                  <a href={l.digitalPdf.url} target="_blank" rel="noopener noreferrer" onClick={() => markSeen(l._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileText className="w-3.5 h-3.5" /> Lista digital (PDF)
                  </a>
                  <a href={l.signedScan.url} target="_blank" rel="noopener noreferrer" onClick={() => markSeen(l._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <FileSignature className="w-3.5 h-3.5" /> Documento assinado
                  </a>
                  {l.lastViewedAt && <span className="ml-auto text-xs text-gray-400">vista {l.viewCount ? `${l.viewCount}x` : ""}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
