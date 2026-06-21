"use client";

import { useEffect, useState } from "react";
import { Loader2, Upload, Send, FileText, FileSignature, School, Ticket, Check, KeyRound } from "lucide-react";
import { api, API_URL, tokenStore } from "@/lib/api";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";

interface UniList {
  _id: string; universityName: string; year: string;
  digitalPdf: Asset; signedScan: Asset; notes: string; createdAt: string;
  lastViewedAt?: string | null; lastViewedByName?: string; viewCount?: number;
}

const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900";

export default function MinhasListasPage() {
  const { user } = useAdminAuth();
  const [tab, setTab] = useState<"enviar" | "ver">("enviar");
  const [remaining, setRemaining] = useState<number | null>(null);

  const loadStats = () => api.get<{ unused: number }>("/access-codes/mine/stats", true).then((s) => setRemaining(s.unused)).catch(() => {});
  useEffect(() => { loadStats(); }, []);

  return (
    <div className="max-w-2xl">
      <PageHeader title="Listas de Finalistas" description={user?.universityName || "Portal da universidade"} />

      <div className="bg-angola-cream/60 border border-angola-gold/30 rounded-xl p-4 mb-6 flex items-center gap-2 text-sm">
        <Ticket className="w-4 h-4 text-angola-gold" />
        {remaining === null ? "A carregar códigos..." : <span><strong>{remaining}</strong> código(s) de acesso por usar. Cada envio ou consulta usa um código.</span>}
      </div>

      <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1 max-w-sm">
        <button type="button" onClick={() => setTab("enviar")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${tab === "enviar" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>Enviar Lista</button>
        <button type="button" onClick={() => setTab("ver")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium ${tab === "ver" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>As Minhas Listas</button>
      </div>

      {tab === "enviar" ? <SubmitForm onDone={loadStats} /> : <ViewLists onConsumed={loadStats} />}
    </div>
  );
}

function SubmitForm({ onDone }: { onDone: () => void }) {
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("");
  const [digital, setDigital] = useState<File | null>(null);
  const [signed, setSigned] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!digital || !signed) { setError("Anexe a lista digital (PDF) e o documento assinado digitalizado."); return; }
    if (code.length !== 6) { setError("Introduza o código de acesso de 6 dígitos."); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("year", year);
      fd.append("code", code);
      if (notes) fd.append("notes", notes);
      fd.append("digital", digital);
      fd.append("signed", signed);
      const res = await fetch(`${API_URL}/university-lists`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
        body: fd,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao enviar.");
      }
      setDone(true);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Lista enviada!</h2>
        <p className="text-gray-600">A lista de finalistas foi recebida pela Ordem.</p>
        <button type="button" onClick={() => { setDone(false); setYear(""); setNotes(""); setCode(""); setDigital(null); setSigned(null); }} className="mt-4 text-sm text-angola-blue hover:underline">Enviar outra lista</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ano académico dos finalistas *</label>
        <input className={inputClass} required value={year} onChange={(e) => setYear(e.target.value)} placeholder="Ex: 2024/2025" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Lista digital (PDF) *</label>
        <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg text-sm cursor-pointer ${digital ? "border-green-400 bg-green-50 text-gray-700" : "border-gray-300 text-gray-600 hover:border-angola-gold"}`}>
          <Upload className="w-4 h-4" /> {digital ? digital.name : "Anexar PDF da lista"}
          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setDigital(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documento assinado e digitalizado *</label>
        <label className={`flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg text-sm cursor-pointer ${signed ? "border-green-400 bg-green-50 text-gray-700" : "border-gray-300 text-gray-600 hover:border-angola-gold"}`}>
          <Upload className="w-4 h-4" /> {signed ? signed.name : "Anexar PDF/imagem assinado pelo responsável"}
          <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setSigned(e.target.files?.[0] ?? null)} />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
        <textarea className={`${inputClass} min-h-[70px]`} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-angola-gold" /> Código de acesso (uso único) *</label>
        <input className={`${inputClass} font-mono text-center`} maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" />
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg disabled:opacity-60">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar Lista
      </button>
    </form>
  );
}

function ViewLists({ onConsumed }: { onConsumed: () => void }) {
  const [code, setCode] = useState("");
  const [lists, setLists] = useState<UniList[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.post<UniList[]>("/university-lists/mine/unlock", { code }, true);
      setLists(data);
      onConsumed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Código inválido.");
    } finally {
      setLoading(false);
    }
  };

  if (lists === null) {
    return (
      <form onSubmit={unlock} className="bg-white border border-angola-gold/40 rounded-2xl p-6 max-w-sm">
        <p className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2"><KeyRound className="w-4 h-4 text-angola-gold" /> Ver/imprimir as minhas listas</p>
        <p className="text-xs text-gray-500 mb-3">Introduza um código de acesso (uso único) para desbloquear a consulta.</p>
        <div className="flex gap-2">
          <input className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg font-mono text-center outline-none focus:ring-2 focus:ring-angola-gold" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" />
          <button type="submit" disabled={loading || code.length !== 6} className="px-4 rounded-lg bg-angola-navy text-white disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ver"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </form>
    );
  }

  return lists.length === 0 ? (
    <p className="text-gray-500 text-center py-12">Ainda não enviou nenhuma lista.</p>
  ) : (
    <div className="space-y-3">
      {lists.map((l) => (
        <div key={l._id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-angola-navy" />
            <p className="font-semibold text-gray-900">Finalistas {l.year}</p>
            <span className="ml-auto text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString("pt-PT")}</span>
          </div>
          {l.notes && <p className="text-sm text-gray-600 mt-1">{l.notes}</p>}
          {l.lastViewedAt ? (
            <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Vista pela Ordem em {new Date(l.lastViewedAt).toLocaleDateString("pt-PT")}
              {l.lastViewedByName ? ` (${l.lastViewedByName})` : ""}
            </p>
          ) : (
            <p className="text-xs text-amber-600 mt-1">Ainda não vista pela Ordem</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            <a href={l.digitalPdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FileText className="w-3.5 h-3.5" /> Lista digital
            </a>
            <a href={l.signedScan.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <FileSignature className="w-3.5 h-3.5" /> Documento assinado
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
