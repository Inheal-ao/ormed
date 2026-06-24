"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, BookOpen, FileText, Upload } from "lucide-react";
import { api, API_URL, tokenStore } from "@/lib/api";
import { College, Programa } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

const TIPOS = [
  { v: "programa", label: "Programa de Ensino" },
  { v: "mapa_rotacoes", label: "Mapa de Rotações" },
  { v: "comunicado", label: "Comunicado" },
  { v: "outro", label: "Outro Documento" },
];
const TIPO_LABEL: Record<string, string> = Object.fromEntries(TIPOS.map((t) => [t.v, t.label]));
const TIPO_STYLE: Record<string, string> = {
  programa: "bg-indigo-100 text-indigo-700", mapa_rotacoes: "bg-teal-100 text-teal-700",
  comunicado: "bg-amber-100 text-amber-700", outro: "bg-gray-100 text-gray-600",
};

export default function ProgramasPage() {
  const { user } = useAdminAuth();
  const isColegio = user?.role === "colegio";
  const [colleges, setColleges] = useState<College[]>([]);
  const [college, setCollege] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [items, setItems] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Programa | "new" | null>(null);

  useEffect(() => {
    api.get<College[]>("/colleges", true).then((c) => { setColleges(c); if (isColegio && c[0]) setCollege(c[0]._id); }).catch(() => {});
  }, []); // eslint-disable-line

  const load = async () => {
    setLoading(true);
    try { setItems(await api.get<Programa[]>(`/colleges/programas/list${college ? `?college=${college}` : ""}`, true)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [college]); // eslint-disable-line

  const remove = async (p: Programa) => {
    if (!confirm(`Eliminar o programa "${p.title}"?`)) return;
    await api.delete(`/colleges/programas/${p._id}`);
    setItems((x) => x.filter((y) => y._id !== p._id));
  };
  const collegeName = (id: string) => colleges.find((c) => c._id === id)?.name ?? "—";

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title="Programas & Documentos do Colégio" description="Programas de ensino dos internatos, mapas de rotações e comunicados, por colégio." />
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
          <Plus className="w-4 h-4" /> Novo documento
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {!isColegio && (
          <select className={`${inputClass} max-w-xs`} value={college} onChange={(e) => setCollege(e.target.value)} aria-label="Colégio">
            <option value="">Todos os colégios</option>
            {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        )}
        <select className={`${inputClass} max-w-[200px]`} value={fTipo} onChange={(e) => setFTipo(e.target.value)} aria-label="Tipo de documento">
          <option value="">Todos os tipos</option>
          {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Sem programas registados.</p>
      ) : (
        <div className="space-y-2">
          {items.filter((p) => !fTipo || (p.tipo || "programa") === fTipo).map((p) => (
            <div key={p._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><BookOpen className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                  {p.title}
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${TIPO_STYLE[p.tipo || "programa"]}`}>{TIPO_LABEL[p.tipo || "programa"]}</span>
                </p>
                <p className="text-xs text-gray-500">{collegeName(p.college)}{p.ano ? ` · ${p.ano}` : ""}</p>
              </div>
              {p.document && <a href={p.document.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-angola-blue hover:underline"><FileText className="w-3.5 h-3.5" /> PDF</a>}
              <div className="flex gap-1">
                <button type="button" onClick={() => setEditing(p)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => remove(p)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <ProgramaForm programa={editing === "new" ? undefined : editing} colleges={colleges} isColegio={isColegio} defaultCollege={college} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ProgramaForm({ programa, colleges, isColegio, defaultCollege, onClose, onSaved }: {
  programa?: Programa; colleges: College[]; isColegio: boolean; defaultCollege: string; onClose: () => void; onSaved: () => void;
}) {
  const [f, setF] = useState({ college: programa?.college ?? defaultCollege ?? "", tipo: programa?.tipo ?? "programa", title: programa?.title ?? "", ano: programa?.ano ?? "", description: programa?.description ?? "" });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const submit = async () => {
    setError(null);
    if (!f.title.trim() || (!isColegio && !f.college)) { setError("Preencha o título e o colégio."); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      if (!isColegio) fd.append("college", f.college);
      fd.append("tipo", f.tipo); fd.append("title", f.title); fd.append("ano", f.ano); fd.append("description", f.description);
      if (file) fd.append("document", file);
      const url = programa ? `${API_URL}/colleges/programas/${programa._id}` : `${API_URL}/colleges/programas`;
      const res = await fetch(url, { method: programa ? "PATCH" : "POST", headers: { Authorization: `Bearer ${tokenStore.getAccess()}` }, body: fd });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao guardar."); }
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{programa ? "Editar documento" : "Novo documento"}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {!isColegio && (
            <select className={inputClass} value={f.college} onChange={(e) => set("college", e.target.value)} aria-label="Colégio">
              <option value="">Colégio *</option>
              {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
          <select className={inputClass} value={f.tipo} onChange={(e) => set("tipo", e.target.value)} aria-label="Tipo de documento">
            {TIPOS.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
          </select>
          <input className={inputClass} placeholder="Título *" value={f.title} onChange={(e) => set("title", e.target.value)} />
          <input className={inputClass} placeholder="Ano / Nível (ex: 1º ano)" value={f.ano} onChange={(e) => set("ano", e.target.value)} />
          <textarea className={`${inputClass} min-h-[90px]`} placeholder="Descrição / conteúdo" value={f.description} onChange={(e) => set("description", e.target.value)} />
          <label className={`flex items-center gap-2 border-2 border-dashed rounded-lg px-3 py-2.5 text-sm cursor-pointer ${file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-angola-gold"}`}>
            <Upload className="w-4 h-4" /> {file ? file.name : (programa?.document ? "Substituir PDF" : "Anexar PDF")}
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
          <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-angola-navy text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
