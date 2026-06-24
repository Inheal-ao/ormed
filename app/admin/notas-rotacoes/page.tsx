"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X, ClipboardList, Download, FileSignature, FileText, Check } from "lucide-react";
import { api, API_URL, tokenStore } from "@/lib/api";
import { College, Interno, Rotation, BankMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { MemberPicker } from "@/components/admin/member-picker";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

/** Abre uma folha imprimível da nota para o orientador assinar. */
function printNotaSheet(interno: Interno, r: Rotation, collegeName: string) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const today = new Date().toLocaleDateString("pt-PT");
  w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Nota de Rotação — ${interno.name}</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:680px;margin:40px auto;padding:0 24px}
  h1{font-size:18px;color:#002147;border-bottom:2px solid #FFD700;padding-bottom:8px}
  .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:14px}
  .label{color:#6b7280}.grade{font-size:28px;font-weight:bold;color:#002147}
  .sign{margin-top:80px;display:flex;justify-content:space-between;font-size:13px;color:#6b7280}
  .line{border-top:1px solid #333;width:260px;text-align:center;padding-top:6px}
  .head{font-size:12px;color:#6b7280;text-align:center;margin-bottom:4px}</style></head><body>
  <p class="head">ORDEM DOS MÉDICOS DE ANGOLA · ${collegeName || "Colégio de Especialidade"}</p>
  <h1>Avaliação de Rotação — Internato de Especialidade</h1>
  <div class="row"><span class="label">Interno</span><span>${interno.name}${interno.numeroOrdem ? ` (${interno.numeroOrdem})` : ""}</span></div>
  <div class="row"><span class="label">Ano do internato</span><span>${interno.anoInternato || "—"}</span></div>
  <div class="row"><span class="label">Rotação</span><span>${r.rotationName}</span></div>
  <div class="row"><span class="label">Período</span><span>${r.period || "—"}</span></div>
  <div class="row"><span class="label">Orientador avaliador</span><span>${r.evaluator || "—"}</span></div>
  <div class="row"><span class="label">Observações</span><span>${r.notes || "—"}</span></div>
  <div class="row"><span class="label">Classificação</span><span class="grade">${r.grade}<span style="font-size:14px;color:#9ca3af">/${r.maxGrade}</span></span></div>
  <div class="sign"><div class="line">O Orientador (assinatura)</div><div class="line">Data: ${today}</div></div>
  <script>window.onload=function(){window.print()}</script></body></html>`);
  w.document.close();
}

export default function NotasRotacoesPage() {
  const { user } = useAdminAuth();
  const isColegio = user?.role === "colegio";
  const [colleges, setColleges] = useState<College[]>([]);
  const [college, setCollege] = useState("");
  const [internos, setInternos] = useState<Interno[]>([]);
  const [interno, setInterno] = useState<Interno | null>(null);
  const [rotations, setRotations] = useState<Rotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    api.get<College[]>("/colleges", true).then((c) => { setColleges(c); if (isColegio && c[0]) setCollege(c[0]._id); }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    setInterno(null); setRotations([]);
    if (isColegio || college) api.get<Interno[]>(`/colleges/internos/list${college ? `?college=${college}` : ""}`, true).then(setInternos).catch(() => {});
    else setInternos([]);
  }, [college]); // eslint-disable-line

  const loadRotations = async (it: Interno) => {
    setInterno(it); setLoading(true);
    try { setRotations(await api.get<Rotation[]>(`/colleges/rotations/list?interno=${it._id}`, true)); } finally { setLoading(false); }
  };
  const remove = async (r: Rotation) => {
    if (!confirm("Eliminar esta nota?")) return;
    await api.delete(`/colleges/rotations/${r._id}`);
    setRotations((p) => p.filter((x) => x._id !== r._id));
  };
  const onSigned = (updated: Rotation) => setRotations((p) => p.map((x) => (x._id === updated._id ? updated : x)));
  const collegeName = (id: string) => colleges.find((c) => c._id === id)?.name ?? "";

  return (
    <div className="max-w-3xl">
      <PageHeader title="Notas das Rotações" description="Avaliação das rotações dos internos durante a especialização." />

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        {!isColegio && (
          <select className={inputClass} value={college} onChange={(e) => setCollege(e.target.value)} aria-label="Colégio">
            <option value="">Escolha o colégio</option>
            {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}
        <select className={inputClass} value={interno?._id ?? ""} onChange={(e) => { const it = internos.find((i) => i._id === e.target.value); if (it) loadRotations(it); }} aria-label="Interno">
          <option value="">Escolha o interno</option>
          {internos.map((i) => <option key={i._id} value={i._id}>{i.name}{i.anoInternato ? ` (${i.anoInternato})` : ""}</option>)}
        </select>
      </div>

      {!interno ? (
        <p className="text-gray-500 text-center py-12 flex flex-col items-center gap-2"><ClipboardList className="w-8 h-8 text-gray-300" />Selecione um interno para ver e lançar as notas das rotações.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900">{interno.name}</p>
              <p className="text-xs text-gray-500">{interno.anoInternato} {interno.hospital ? `· ${interno.hospital}` : ""}</p>
            </div>
            <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95">
              <Plus className="w-4 h-4" /> Lançar nota
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : rotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ainda sem notas para este interno.</p>
          ) : (
            <div className="space-y-2">
              {rotations.map((r) => (
                <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                        {r.rotationName}
                        {r.status === "final"
                          ? <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1"><Check className="w-3 h-3" /> Assinada / Final</span>
                          : <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Rascunho · por assinar</span>}
                      </p>
                      <p className="text-xs text-gray-500">{r.period}{r.evaluator ? ` · Orientador: ${r.evaluator}` : ""}{r.notes ? ` · ${r.notes}` : ""}</p>
                    </div>
                    <span className={`text-lg font-bold ${r.grade >= (r.maxGrade * 0.5) ? "text-green-600" : "text-red-600"}`}>{r.grade}<span className="text-xs text-gray-400">/{r.maxGrade}</span></span>
                    <button type="button" onClick={() => remove(r)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
                    <button type="button" onClick={() => printNotaSheet(interno, r, collegeName(r.college))} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Download className="w-3.5 h-3.5" /> Descarregar folha
                    </button>
                    <SignButton rotation={r} onSigned={onSigned} />
                    {r.signedDocument && (
                      <a href={r.signedDocument.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 text-angola-blue hover:underline">
                        <FileText className="w-3.5 h-3.5" /> Ver nota assinada
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adding && interno && <RotationForm interno={interno} isColegio={isColegio} college={college || interno.college} onClose={() => setAdding(false)} onSaved={() => { setAdding(false); loadRotations(interno); }} />}
    </div>
  );
}

function SignButton({ rotation, onSigned }: { rotation: Rotation; onSigned: (r: Rotation) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("document", file);
      const res = await fetch(`${API_URL}/colleges/rotations/${rotation._id}/sign`, {
        method: "PATCH", headers: { Authorization: `Bearer ${tokenStore.getAccess()}` }, body: fd,
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao enviar."); }
      onSigned(await res.json());
    } catch (err) { alert(err instanceof Error ? err.message : "Erro."); } finally { setBusy(false); }
  };
  return (
    <label className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer ${rotation.status === "final" ? "border border-gray-200 text-gray-600 hover:bg-gray-50" : "bg-angola-navy text-white hover:brightness-110"}`}>
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSignature className="w-3.5 h-3.5" />}
      {rotation.status === "final" ? "Substituir assinada" : "Anexar assinada e enviar"}
      <input type="file" accept="application/pdf" className="hidden" disabled={busy} onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); e.target.value = ""; }} />
    </label>
  );
}

function RotationForm({ interno, isColegio, college, onClose, onSaved }: { interno: Interno; isColegio: boolean; college: string; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ rotationName: "", period: "", grade: "", maxGrade: "20", notes: "" });
  const [orientador, setOrientador] = useState<{ id: string; name: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    setError(null);
    if (!f.rotationName.trim()) { setError("Indique o nome da rotação."); return; }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { interno: interno._id, rotationName: f.rotationName, period: f.period, grade: Number(f.grade) || 0, maxGrade: Number(f.maxGrade) || 20, evaluatorId: orientador?.id ?? "", notes: f.notes };
      if (!isColegio) body.college = college;
      await api.post("/colleges/rotations", body, true);
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">Lançar nota de rotação</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{interno.name}</p>
        <div className="space-y-3">
          <input className={inputClass} placeholder="Rotação (ex: Cardiologia de Intervenção) *" value={f.rotationName} onChange={(e) => set("rotationName", e.target.value)} />
          <input className={inputClass} placeholder="Período (ex: 2025 - 1º semestre)" value={f.period} onChange={(e) => set("period", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" className={inputClass} placeholder="Nota" value={f.grade} onChange={(e) => set("grade", e.target.value)} />
            <input type="number" className={inputClass} placeholder="Máx (20)" value={f.maxGrade} onChange={(e) => set("maxGrade", e.target.value)} />
          </div>
          <MemberPicker label="Orientador avaliador (especialista com categoria de orientador)" categoria="orientador" allowClear
            placeholder="Procurar orientador no banco..."
            selected={orientador ? { id: orientador.id, name: orientador.name } : null}
            onSelect={(m: BankMember | null) => setOrientador(m ? { id: m._id, name: m.name } : null)} />
          <textarea className={`${inputClass} min-h-[70px]`} placeholder="Observações" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
          <p className="text-[11px] text-gray-400">Após guardar, a nota fica em <strong>rascunho</strong>. Descarregue a folha, recolha a assinatura do orientador e anexe o documento para a enviar definitivamente.</p>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
          <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-angola-navy text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Guardar nota
          </button>
        </div>
      </div>
    </div>
  );
}
