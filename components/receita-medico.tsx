"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, X, Pill, Printer, Search, FileText } from "lucide-react";
import { API_URL } from "@/lib/api";

interface Item { medicamento: string; dosagem: string; posologia: string; duracao: string; quantidade: string }
interface Prescription {
  _id?: string; code: string; patientName: string; patientBI?: string; patientIdade?: string;
  items: Item[]; observacoes?: string; status?: string; createdAt?: string;
}
interface Medico { name: string; numeroOrdem: string; especialidade: string }

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";
const esc = (s: string) => (s || "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

/** Imprime a receita médica (com logótipo, dados do médico, QR de verificação). */
function printReceita(p: Prescription, m: Medico) {
  const w = window.open("", "_blank", "width=820,height=1000");
  if (!w) return;
  const origin = window.location.origin;
  const logo = `${origin}/images/logo.svg`;
  const verifyUrl = `${origin}/receita/${encodeURIComponent(p.code)}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=4&data=${encodeURIComponent(verifyUrl)}`;
  const rows = p.items.map((it) => `<tr>
    <td>${esc(it.medicamento)}</td><td>${esc(it.dosagem)}</td><td>${esc(it.posologia)}</td>
    <td>${esc(it.duracao)}</td><td>${esc(it.quantidade)}</td></tr>`).join("");
  const today = p.createdAt ? new Date(p.createdAt).toLocaleDateString("pt-PT") : new Date().toLocaleDateString("pt-PT");
  w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Receita ${esc(p.code)}</title>
  <style>body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:28px;max-width:720px}
  .head{display:flex;align-items:center;gap:12px;border-bottom:2px solid #FFD700;padding-bottom:10px}
  .head img{height:56px}.org{font-size:13px;color:#002147;font-weight:bold}.t{font-size:12px;color:#555}
  h1{font-size:18px;margin:14px 0 2px;color:#002147}
  .grid{display:flex;justify-content:space-between;gap:16px;font-size:13px;margin-top:6px}
  .box{flex:1}.label{color:#777;font-size:11px}
  table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12px}
  th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#002147;color:#fff}
  .obs{margin-top:12px;font-size:12px}
  .foot{margin-top:46px;display:flex;justify-content:space-between;align-items:flex-end}
  .sign{border-top:1px solid #333;width:280px;text-align:center;padding-top:6px;font-size:12px}
  .qr{text-align:center;font-size:10px;color:#888}
  </style></head><body>
  <div class="head"><img src="${logo}" alt="ORMED" onerror="this.style.display='none'"/>
    <div><div class="org">ORDEM DOS MÉDICOS DE ANGOLA</div><div class="t">Receita Médica Eletrónica</div></div></div>
  <h1>Receita Médica</h1>
  <div class="grid">
    <div class="box"><span class="label">Médico</span><br><b>${esc(m.name)}</b><br>
      Nº de Ordem: ${esc(m.numeroOrdem)}${m.especialidade ? `<br>${esc(m.especialidade)}` : ""}</div>
    <div class="box" style="text-align:right"><span class="label">Receita</span><br><b>${esc(p.code)}</b><br>Data: ${today}</div>
  </div>
  <div class="grid"><div class="box"><span class="label">Utente</span><br><b>${esc(p.patientName)}</b>
    ${p.patientIdade ? ` · ${esc(p.patientIdade)} anos` : ""}${p.patientBI ? `<br>BI/Passaporte: ${esc(p.patientBI)}` : ""}</div></div>
  <table><thead><tr><th>Medicamento</th><th>Dosagem</th><th>Posologia</th><th>Duração</th><th>Quantidade</th></tr></thead>
  <tbody>${rows}</tbody></table>
  ${p.observacoes ? `<p class="obs"><b>Observações:</b> ${esc(p.observacoes)}</p>` : ""}
  <div class="foot">
    <div class="qr"><img src="${qr}" width="120" height="120" alt="QR"/><br>Verificar em<br>${esc(verifyUrl)}</div>
    <div class="sign">O Médico</div>
  </div>
  <script>window.onload=function(){setTimeout(function(){window.print()},500)}</script></body></html>`);
  w.document.close();
}

export function ReceitasSection({ numeroUtente, code, medico }: { numeroUtente: string; code: string; medico: Medico }) {
  const [items, setItems] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/prescriptions/mine`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente, code }),
      });
      if (res.ok) setItems(await res.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [numeroUtente, code]); // eslint-disable-line

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Pill className="w-5 h-5 text-angola-navy" /> Prescrição eletrónica</h3>
        <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-3.5 py-2 rounded-lg hover:brightness-95 text-sm">
          <Plus className="w-4 h-4" /> Nova receita
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Emita receitas médicas com QR de verificação para a farmácia.</p>

      {loading ? (
        <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-400">Ainda não emitiu receitas.</p>
      ) : (
        <div className="border border-gray-200 rounded-xl divide-y">
          {items.map((p) => (
            <div key={p.code} className="flex items-center gap-3 px-4 py-2.5 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{p.patientName} <span className="text-xs text-gray-400">· {p.items.length} medicamento(s)</span></p>
                <p className="text-xs text-gray-500 font-mono">{p.code}{p.createdAt ? ` · ${new Date(p.createdAt).toLocaleDateString("pt-PT")}` : ""}</p>
              </div>
              <button type="button" onClick={() => printReceita(p, medico)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"><Printer className="w-3.5 h-3.5" /> Imprimir</button>
            </div>
          ))}
        </div>
      )}

      {creating && <NovaReceita numeroUtente={numeroUtente} code={code} medico={medico} onClose={() => setCreating(false)} onCreated={(p) => { setItems((x) => [p, ...x]); printReceita(p, medico); setCreating(false); }} />}
    </div>
  );
}

function NovaReceita({ numeroUtente, code, medico, onClose, onCreated }: {
  numeroUtente: string; code: string; medico: Medico; onClose: () => void; onCreated: (p: Prescription) => void;
}) {
  const [patient, setPatient] = useState({ patientName: "", patientBI: "", patientIdade: "" });
  const [items, setItems] = useState<Item[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMed = (name: string) => setItems((p) => [...p, { medicamento: name, dosagem: "", posologia: "", duracao: "", quantidade: "" }]);
  const setItem = (i: number, k: keyof Item, v: string) => setItems((p) => p.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const submit = async () => {
    setError(null);
    if (!patient.patientName.trim()) { setError("Indique o nome do utente."); return; }
    if (items.length === 0) { setError("Adicione pelo menos um medicamento."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/prescriptions`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente, code, ...patient, items, observacoes }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao emitir."); }
      onCreated(await res.json());
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Pill className="w-5 h-5 text-angola-navy" /> Nova receita médica</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">Médico: <strong>{medico.name}</strong> · Nº Ordem {medico.numeroOrdem}</p>

        <div className="grid sm:grid-cols-3 gap-3">
          <input className={`${inputClass} sm:col-span-2`} placeholder="Nome do utente *" value={patient.patientName} onChange={(e) => setPatient((p) => ({ ...p, patientName: e.target.value }))} />
          <input className={inputClass} placeholder="Idade" value={patient.patientIdade} onChange={(e) => setPatient((p) => ({ ...p, patientIdade: e.target.value }))} />
          <input className={`${inputClass} sm:col-span-3`} placeholder="BI / Passaporte (opcional)" value={patient.patientBI} onChange={(e) => setPatient((p) => ({ ...p, patientBI: e.target.value }))} />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Adicionar medicamento</label>
          <MedSearch onPick={addMed} />
        </div>

        {items.length > 0 && (
          <div className="mt-3 space-y-2">
            {items.map((it, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">{it.medicamento}</p>
                  <button type="button" onClick={() => removeItem(i)} className="text-gray-300 hover:text-red-600" aria-label="Remover"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <input className={inputClass} placeholder="Dosagem (500 mg)" value={it.dosagem} onChange={(e) => setItem(i, "dosagem", e.target.value)} />
                  <input className={inputClass} placeholder="Posologia (8/8h)" value={it.posologia} onChange={(e) => setItem(i, "posologia", e.target.value)} />
                  <input className={inputClass} placeholder="Duração (7 dias)" value={it.duracao} onChange={(e) => setItem(i, "duracao", e.target.value)} />
                  <input className={inputClass} placeholder="Quantidade (1 caixa)" value={it.quantidade} onChange={(e) => setItem(i, "quantidade", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        <textarea className={`${inputClass} min-h-[60px] mt-4`} placeholder="Observações" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
          <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-angola-navy text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} Emitir e imprimir
          </button>
        </div>
      </div>
    </div>
  );
}

function MedSearch({ onPick }: { onPick: (name: string) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.trim().length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/prescriptions/medicamentos?q=${encodeURIComponent(q.trim())}`);
        if (res.ok) setResults(await res.json());
      } catch { setResults([]); } finally { setLoading(false); }
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input className="flex-1 py-2 text-sm outline-none bg-transparent text-gray-900" placeholder="Procurar medicamento (ex.: amoxicilina)..."
          value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 shrink-0" />}
        {q.trim() && <button type="button" onClick={() => { onPick(q.trim()); setQ(""); setResults([]); }} className="text-xs text-angola-navy font-medium shrink-0 px-1.5">+ usar "{q.trim().slice(0, 18)}"</button>}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {results.map((r) => (
            <button key={r.name} type="button" onClick={() => { onPick(r.name); setQ(""); setResults([]); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
              <Pill className="w-3.5 h-3.5 text-gray-400" /> {r.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
