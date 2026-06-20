"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { MilestoneItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function CronologiaPage() {
  const [items, setItems] = useState<MilestoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<MilestoneItem[]>("/timeline/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const setLocal = (id: string, patch: Partial<MilestoneItem>) =>
    setItems((prev) => prev.map((m) => (m._id === id ? { ...m, ...patch } : m)));

  const addNew = async () => {
    const created = await api.post<MilestoneItem>(
      "/timeline",
      { year: "2026", title: "Novo marco", description: "", order: items.length },
      true,
    );
    setItems((prev) => [...prev, created]);
  };

  const save = async (m: MilestoneItem) => {
    setSavingId(m._id);
    try {
      await api.patch(`/timeline/${m._id}`, { year: m.year, title: m.title, description: m.description });
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este marco?")) return;
    await api.delete(`/timeline/${id}`);
    setItems((prev) => prev.filter((m) => m._id !== id));
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Cronologia / História" description="Marcos históricos mostrados na página inicial e na História." />
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex gap-3 mb-2">
                <input value={m.year} onChange={(e) => setLocal(m._id, { year: e.target.value })} className="w-24 font-bold px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900" placeholder="Ano" />
                <input value={m.title} onChange={(e) => setLocal(m._id, { title: e.target.value })} className="flex-1 font-medium px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900" placeholder="Título" />
              </div>
              <textarea value={m.description} onChange={(e) => setLocal(m._id, { description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-700 min-h-[70px] mb-2" placeholder="Descrição" />
              <div className="flex gap-2">
                <button type="button" onClick={() => save(m)} disabled={savingId === m._id} className="inline-flex items-center gap-1.5 bg-angola-navy text-white px-4 py-2 rounded-lg text-sm hover:brightness-110 disabled:opacity-60">
                  {savingId === m._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Guardar
                </button>
                <button type="button" onClick={() => remove(m._id)} className="p-2 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg" aria-label="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNew} className="flex items-center gap-2 text-angola-navy font-medium px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-angola-gold w-full justify-center">
            <Plus className="w-4 h-4" />Adicionar marco
          </button>
        </div>
      )}
    </div>
  );
}
