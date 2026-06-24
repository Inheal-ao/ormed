"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X, ClipboardList, Download, FileSignature, FileText, Check, Pencil } from "lucide-react";
import { api, API_URL, tokenStore } from "@/lib/api";
import { College, Interno, Rotation, Competencia, BankMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { MemberPicker } from "@/components/admin/member-picker";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";
const esc = (s: string) => (s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

/** Imprime o Mapa de Registo de Habilidades do interno (formato oficial). */
function printMapa(r: Rotation, collegeName: string) {
  const w = window.open("", "_blank", "width=1000,height=900");
  if (!w) return;
  const rows = (r.competencias ?? []).map((c) => `<tr>
    <td class="comp">${esc(c.competencia)}</td>
    <td>${c.totalMinimo || ""}</td><td>${c.observador || ""}</td><td>${c.ajudante || ""}</td>
    <td>${c.executor || ""}</td><td>${c.totalRealizado || ""}</td></tr>`).join("");
  w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Mapa de Habilidades — ${esc(r.internoName)}</title>
  <style>
  body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px}
  .center{text-align:center}.b{font-weight:bold}
  h1,h2,h3{margin:2px 0}h1{font-size:14px}h2{font-size:13px}h3{font-size:13px;margin-top:6px}
  .meta{font-size:12px;margin:3px 0}
  table{width:100%;border-collapse:collapse;margin-top:14px;font-size:11px}
  th,td{border:1px solid #333;padding:5px 6px;text-align:center;vertical-align:middle}
  td.comp{text-align:left;width:34%}
  th{background:#f0f0f0;font-size:11px}
  .obs{margin-top:14px;font-size:12px}
  .sign{margin-top:60px;display:flex;justify-content:space-around;font-size:12px}
  .line{border-top:1px solid #333;width:240px;text-align:center;padding-top:5px}
  </style></head><body>
  <div class="center">
    <p class="b">ORDEM DOS MÉDICOS DE ANGOLA</p>
    <p class="b">COLÉGIO DE ESPECIALIDADE DE ${esc((r.especialidade || collegeName).toUpperCase())}</p>
    <p class="b">MAPA DE REGISTO DE HABILIDADES DO INTERNO DE ${esc((r.especialidade || "").toUpperCase())}</p>
    <p class="b">${esc((r.anoInternato || "").toUpperCase())}</p>
  </div>
  <p class="meta"><span class="b">PERÍODO DE AVALIAÇÃO:</span> ${esc(r.periodoInicio)} a ${esc(r.periodoFim)}</p>
  <p class="meta"><span class="b">ROTAÇÃO/MÓDULO DE:</span> ${esc(r.rotationName)}</p>
  <p class="meta"><span class="b">NOME E SOBRENOME:</span> ${esc(r.internoName)} &nbsp;&nbsp; <span class="b">ANO DE INTERNATO:</span> ${esc(r.anoInternato)}</p>
  <p class="meta"><span class="b">PROVÍNCIA:</span> ${esc(r.provincia)} &nbsp;&nbsp; <span class="b">MUNICÍPIO:</span> ${esc(r.municipio)} &nbsp;&nbsp; <span class="b">HOSPITAL:</span> ${esc(r.hospital)}</p>
  <p class="meta"><span class="b">INSTITUIÇÃO RESPONSÁVEL PELO INTERNO:</span> ${esc(r.instituicaoResponsavel)}</p>
  <table>
    <thead><tr><th>COMPETÊNCIAS</th><th>Total mínimo a realizar/Avaliação</th><th>Observador</th><th>Ajudante</th><th>Executor</th><th>Total realizado</th></tr></thead>
    <tbody>${rows || `<tr><td class="comp">&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>`}</tbody>
  </table>
  <p class="obs"><span class="b">Observações:</span> ${esc(r.observacoes)}</p>
  <div class="sign"><div class="line">O Orientador${r.evaluator ? ` — ${esc(r.evaluator)}` : ""}</div><div class="line">O Interno</div></div>
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
  const [editing, setEditing] = useState<Rotation | "new" | null>(null);

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
    if (!confirm("Eliminar este mapa de avaliação?")) return;
    await api.delete(`/colleges/rotations/${r._id}`);
    setRotations((p) => p.filter((x) => x._id !== r._id));
  };
  const onSigned = (updated: Rotation) => setRotations((p) => p.map((x) => (x._id === updated._id ? updated : x)));
  const collegeName = (id: string) => colleges.find((c) => c._id === id)?.name ?? "";

  return (
    <div className="max-w-3xl">
      <PageHeader title="Notas das Rotações" description="Mapa de Registo de Habilidades do interno — preenchido pelo orientador em cada rotação/módulo." />

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
        <p className="text-gray-500 text-center py-12 flex flex-col items-center gap-2"><ClipboardList className="w-8 h-8 text-gray-300" />Selecione um interno para ver e lançar os mapas de avaliação das rotações.</p>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-bold text-gray-900">{interno.name}</p>
              <p className="text-xs text-gray-500">{interno.anoInternato} {interno.hospital ? `· ${interno.hospital}` : ""}</p>
            </div>
            <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95">
              <Plus className="w-4 h-4" /> Novo mapa
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : rotations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Ainda sem mapas de avaliação para este interno.</p>
          ) : (
            <div className="space-y-2">
              {rotations.map((r) => (
                <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                        {r.rotationName}
                        {r.status === "final"
                          ? <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 inline-flex items-center gap-1"><Check className="w-3 h-3" /> Assinado / Final</span>
                          : <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">Rascunho · por assinar</span>}
                      </p>
                      <p className="text-xs text-gray-500">
                        {r.periodoInicio && `${r.periodoInicio} a ${r.periodoFim}`}
                        {r.evaluator ? ` · Orientador: ${r.evaluator}` : ""}
                        {` · ${(r.competencias ?? []).length} competência(s)`}
                      </p>
                    </div>
                    <button type="button" onClick={() => setEditing(r)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button type="button" onClick={() => remove(r)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
                    <button type="button" onClick={() => printMapa(r, collegeName(r.college))} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">
                      <Download className="w-3.5 h-3.5" /> Descarregar mapa
                    </button>
                    <SignButton rotation={r} onSigned={onSigned} />
                    {r.signedDocument && (
                      <a href={r.signedDocument.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 text-angola-blue hover:underline">
                        <FileText className="w-3.5 h-3.5" /> Ver mapa assinado
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editing && interno && (
        <RotationForm rotation={editing === "new" ? undefined : editing} interno={interno} isColegio={isColegio}
          college={college || interno.college} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); loadRotations(interno); }} />
      )}
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
      {rotation.status === "final" ? "Substituir assinado" : "Anexar assinado e enviar"}
      <input type="file" accept="application/pdf" className="hidden" disabled={busy} onChange={(e) => { const fl = e.target.files?.[0]; if (fl) upload(fl); e.target.value = ""; }} />
    </label>
  );
}

const emptyComp = (): Competencia => ({ competencia: "", totalMinimo: 0, observador: 0, ajudante: 0, executor: 0, totalRealizado: 0 });

function RotationForm({ rotation, interno, isColegio, college, onClose, onSaved }: {
  rotation?: Rotation; interno: Interno; isColegio: boolean; college: string; onClose: () => void; onSaved: () => void;
}) {
  const [f, setF] = useState({
    rotationName: rotation?.rotationName ?? "", periodoInicio: rotation?.periodoInicio ?? "", periodoFim: rotation?.periodoFim ?? "",
    anoInternato: rotation?.anoInternato ?? interno.anoInternato ?? "", provincia: rotation?.provincia ?? "",
    municipio: rotation?.municipio ?? "", hospital: rotation?.hospital ?? interno.hospital ?? "",
    instituicaoResponsavel: rotation?.instituicaoResponsavel ?? interno.hospital ?? "", observacoes: rotation?.observacoes ?? "",
  });
  const [comps, setComps] = useState<Competencia[]>(rotation?.competencias?.length ? rotation.competencias : [emptyComp(), emptyComp(), emptyComp()]);
  const [orientador, setOrientador] = useState<{ id: string; name: string } | null>(
    rotation?.evaluatorId ? { id: rotation.evaluatorId, name: rotation.evaluator } : null,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const setComp = (i: number, k: keyof Competencia, v: string) =>
    setComps((p) => p.map((c, idx) => (idx === i ? { ...c, [k]: k === "competencia" ? v : Number(v) || 0 } : c)));
  const addRow = () => setComps((p) => [...p, emptyComp()]);
  const removeRow = (i: number) => setComps((p) => p.filter((_, idx) => idx !== i));

  const submit = async () => {
    setError(null);
    if (!f.rotationName.trim()) { setError("Indique a rotação/módulo."); return; }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { ...f, competencias: comps.filter((c) => c.competencia.trim()), evaluatorId: orientador?.id ?? "" };
      if (rotation) await api.patch(`/colleges/rotations/${rotation._id}`, body);
      else { body.interno = interno._id; if (!isColegio) body.college = college; await api.post("/colleges/rotations", body, true); }
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };

  const numCell = "w-16 px-1.5 py-1 border border-gray-300 rounded text-sm text-center outline-none focus:ring-1 focus:ring-angola-gold";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">Mapa de Registo de Habilidades</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{interno.name}{rotation?.especialidade ? ` · ${rotation.especialidade}` : ""}</p>

        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Rotação / Módulo de (ex: Pediatria) *" value={f.rotationName} onChange={(e) => set("rotationName", e.target.value)} />
          <input className={inputClass} placeholder="Ano de internato (ex: 1º ano)" value={f.anoInternato} onChange={(e) => set("anoInternato", e.target.value)} />
          <label className="text-xs text-gray-500">Período — início<input className={inputClass} type="text" placeholder="15/Junho/2026" value={f.periodoInicio} onChange={(e) => set("periodoInicio", e.target.value)} /></label>
          <label className="text-xs text-gray-500">Período — fim<input className={inputClass} type="text" placeholder="24/Julho/2026" value={f.periodoFim} onChange={(e) => set("periodoFim", e.target.value)} /></label>
          <input className={inputClass} placeholder="Província" value={f.provincia} onChange={(e) => set("provincia", e.target.value)} />
          <input className={inputClass} placeholder="Município" value={f.municipio} onChange={(e) => set("municipio", e.target.value)} />
          <input className={inputClass} placeholder="Hospital" value={f.hospital} onChange={(e) => set("hospital", e.target.value)} />
          <input className={inputClass} placeholder="Instituição responsável pelo interno" value={f.instituicaoResponsavel} onChange={(e) => set("instituicaoResponsavel", e.target.value)} />
        </div>

        <div className="mt-4">
          <MemberPicker label="Orientador avaliador (especialista com categoria de orientador)" categoria="orientador" allowClear
            placeholder="Procurar orientador no banco..."
            selected={orientador ? { id: orientador.id, name: orientador.name } : null}
            onSelect={(m: BankMember | null) => setOrientador(m ? { id: m._id, name: m.name } : null)} />
        </div>

        {/* Tabela de competências */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Competências / Habilidades</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left font-medium p-1">Competência</th>
                  <th className="font-medium p-1">Mín.</th>
                  <th className="font-medium p-1">Observ.</th>
                  <th className="font-medium p-1">Ajud.</th>
                  <th className="font-medium p-1">Execut.</th>
                  <th className="font-medium p-1">Total</th>
                  <th className="p-1" aria-label="Ações"><span className="sr-only">Ações</span></th>
                </tr>
              </thead>
              <tbody>
                {comps.map((c, i) => (
                  <tr key={i}>
                    <td className="p-1"><input className="w-full px-2 py-1 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-angola-gold" value={c.competencia} onChange={(e) => setComp(i, "competencia", e.target.value)} placeholder="Descrição da competência" /></td>
                    <td className="p-1"><input type="number" aria-label="Total mínimo" className={numCell} value={c.totalMinimo || ""} onChange={(e) => setComp(i, "totalMinimo", e.target.value)} /></td>
                    <td className="p-1"><input type="number" aria-label="Observador" className={numCell} value={c.observador || ""} onChange={(e) => setComp(i, "observador", e.target.value)} /></td>
                    <td className="p-1"><input type="number" aria-label="Ajudante" className={numCell} value={c.ajudante || ""} onChange={(e) => setComp(i, "ajudante", e.target.value)} /></td>
                    <td className="p-1"><input type="number" aria-label="Executor" className={numCell} value={c.executor || ""} onChange={(e) => setComp(i, "executor", e.target.value)} /></td>
                    <td className="p-1"><input type="number" aria-label="Total realizado" className={numCell} value={c.totalRealizado || ""} onChange={(e) => setComp(i, "totalRealizado", e.target.value)} /></td>
                    <td className="p-1"><button type="button" onClick={() => removeRow(i)} className="text-gray-300 hover:text-red-600" aria-label="Remover linha"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addRow} className="mt-2 inline-flex items-center gap-1 text-xs text-angola-navy hover:underline"><Plus className="w-3.5 h-3.5" /> Adicionar competência</button>
        </div>

        <textarea className={`${inputClass} min-h-[60px] mt-4`} placeholder="Observações" value={f.observacoes} onChange={(e) => set("observacoes", e.target.value)} />
        <p className="text-[11px] text-gray-400 mt-2">Após guardar, descarregue o mapa, recolha a assinatura do orientador e anexe-o para o enviar definitivamente.</p>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
          <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-angola-navy text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Guardar mapa
          </button>
        </div>
      </div>
    </div>
  );
}
