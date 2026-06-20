"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { TestimonialItem, Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function TestemunhosPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<TestimonialItem[]>("/testimonials/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const setLocal = (id: string, patch: Partial<TestimonialItem>) =>
    setItems((prev) => prev.map((t) => (t._id === id ? { ...t, ...patch } : t)));

  const addNew = async () => {
    const created = await api.post<TestimonialItem>(
      "/testimonials",
      { name: "Novo testemunho", role: "", location: "", text: "", order: items.length },
      true,
    );
    setItems((prev) => [...prev, created]);
  };

  const save = async (t: TestimonialItem) => {
    setSavingId(t._id);
    try {
      await api.patch(`/testimonials/${t._id}`, {
        name: t.name, role: t.role, location: t.location, text: t.text, avatar: t.avatar ?? undefined,
      });
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este testemunho?")) return;
    await api.delete(`/testimonials/${id}`);
    setItems((prev) => prev.filter((t) => t._id !== id));
  };

  const input = "px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900";

  return (
    <div className="max-w-3xl">
      <PageHeader title="Testemunhos" description="Depoimentos de membros, mostrados na página inicial." />
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t._id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="grid sm:grid-cols-3 gap-2">
                <input value={t.name} onChange={(e) => setLocal(t._id, { name: e.target.value })} className={`${input} font-medium`} placeholder="Nome" />
                <input value={t.role} onChange={(e) => setLocal(t._id, { role: e.target.value })} className={input} placeholder="Cargo/Especialidade" />
                <input value={t.location} onChange={(e) => setLocal(t._id, { location: e.target.value })} className={input} placeholder="Localidade" />
              </div>
              <textarea value={t.text} onChange={(e) => setLocal(t._id, { text: e.target.value })} className={`${input} w-full min-h-[80px]`} placeholder="Depoimento" />
              <MediaUpload label="Foto (opcional)" kind="image" value={t.avatar} onChange={(a) => setLocal(t._id, { avatar: a })} />
              <div className="flex gap-2">
                <button type="button" onClick={() => save(t)} disabled={savingId === t._id} className="inline-flex items-center gap-1.5 bg-angola-navy text-white px-4 py-2 rounded-lg text-sm hover:brightness-110 disabled:opacity-60">
                  {savingId === t._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Guardar
                </button>
                <button type="button" onClick={() => remove(t._id)} className="p-2 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg" aria-label="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNew} className="flex items-center gap-2 text-angola-navy font-medium px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-angola-gold w-full justify-center">
            <Plus className="w-4 h-4" />Adicionar testemunho
          </button>
        </div>
      )}
    </div>
  );
}
