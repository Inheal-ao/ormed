"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, LayoutTemplate, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { HeroSlide, Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

export default function HeroAdminPage() {
  const [items, setItems] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HeroSlide | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.get<HeroSlide[]>("/hero/admin/all", true)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (s: HeroSlide) => {
    if (!confirm(`Eliminar o slide "${s.title}"?`)) return;
    await api.delete(`/hero/${s._id}`);
    setItems((p) => p.filter((x) => x._id !== s._id));
  };
  const togglePub = async (s: HeroSlide) => {
    const u = await api.patch<HeroSlide>(`/hero/${s._id}`, { isPublished: !s.isPublished });
    setItems((p) => p.map((x) => (x._id === s._id ? u : x)));
  };
  const move = async (s: HeroSlide, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x._id === s._id);
    const other = items[idx + dir];
    if (!other) return;
    await Promise.all([
      api.patch(`/hero/${s._id}`, { order: other.order }),
      api.patch(`/hero/${other._id}`, { order: s.order }),
    ]);
    load();
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title="Hero (Início)" description="Fotos e textos do banner principal da página inicial." />
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
          <Plus className="w-4 h-4" /> Novo slide
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Sem slides. Crie o primeiro.</p>
      ) : (
        <div className="space-y-3">
          {items.map((s, i) => (
            <div key={s._id} className={`bg-white border rounded-xl p-3 flex items-center gap-4 ${s.isPublished ? "border-gray-200" : "border-gray-200 opacity-60"}`}>
              {s.image?.url
                ? <img src={s.image.url} alt="" className="w-28 h-20 object-cover rounded-lg shrink-0" />
                : <div className="w-28 h-20 rounded-lg bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><LayoutTemplate className="w-6 h-6" /></div>}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{s.title}</p>
                <p className="text-xs text-angola-gold truncate">{s.subtitle}</p>
                <p className="text-xs text-gray-500 truncate">{s.description}</p>
              </div>
              <div className="flex flex-col gap-0.5 shrink-0">
                <button type="button" onClick={() => move(s, -1)} disabled={i === 0} className="p-1 text-gray-400 hover:text-angola-navy disabled:opacity-30" title="Subir"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => move(s, 1)} disabled={i === items.length - 1} className="p-1 text-gray-400 hover:text-angola-navy disabled:opacity-30" title="Descer"><ArrowDown className="w-4 h-4" /></button>
              </div>
              <div className="flex gap-1 shrink-0">
                <button type="button" onClick={() => togglePub(s)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title={s.isPublished ? "Despublicar" : "Publicar"}>{s.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                <button type="button" onClick={() => setEditing(s)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => remove(s)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <SlideForm slide={editing === "new" ? undefined : editing} nextOrder={items.length} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function SlideForm({ slide, nextOrder, onClose, onSaved }: { slide?: HeroSlide; nextOrder: number; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    title: slide?.title ?? "", subtitle: slide?.subtitle ?? "", description: slide?.description ?? "",
    ctaLabel: slide?.ctaLabel ?? "", ctaHref: slide?.ctaHref ?? "", cta2Label: slide?.cta2Label ?? "", cta2Href: slide?.cta2Href ?? "",
  });
  const [image, setImage] = useState<Asset | null>(slide?.image ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setError(null);
    if (!f.title.trim()) { setError("Indique o título."); return; }
    setSaving(true);
    try {
      const body = { ...f, image };
      if (slide) await api.patch(`/hero/${slide._id}`, body);
      else await api.post("/hero", { ...body, order: nextOrder }, true);
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{slide ? "Editar slide" : "Novo slide"}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <MediaUpload label="Foto do slide" kind="image" value={image} onChange={setImage} />
          <input className={inputClass} placeholder="Título *" value={f.title} onChange={(e) => set("title", e.target.value)} />
          <input className={inputClass} placeholder="Subtítulo" value={f.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          <textarea className={`${inputClass} min-h-[80px]`} placeholder="Descrição" value={f.description} onChange={(e) => set("description", e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inputClass} placeholder="Botão 1 — texto" value={f.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
            <input className={inputClass} placeholder="Botão 1 — link (ex: /inscricao/)" value={f.ctaHref} onChange={(e) => set("ctaHref", e.target.value)} />
            <input className={inputClass} placeholder="Botão 2 — texto" value={f.cta2Label} onChange={(e) => set("cta2Label", e.target.value)} />
            <input className={inputClass} placeholder="Botão 2 — link (ex: /sobre/)" value={f.cta2Href} onChange={(e) => set("cta2Href", e.target.value)} />
          </div>
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
