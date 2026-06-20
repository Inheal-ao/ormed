"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { FaqItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function FaqsPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<FaqItem[]>("/faqs/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const setLocal = (id: string, patch: Partial<FaqItem>) =>
    setItems((prev) => prev.map((f) => (f._id === id ? { ...f, ...patch } : f)));

  const addNew = async () => {
    setError(null);
    try {
      const created = await api.post<FaqItem>(
        "/faqs",
        { question: "Nova pergunta", answer: "Resposta", order: items.length },
        true,
      );
      setItems((prev) => [...prev, created]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao adicionar.");
    }
  };

  const save = async (f: FaqItem) => {
    setSavingId(f._id);
    setError(null);
    try {
      await api.patch(`/faqs/${f._id}`, { question: f.question, answer: f.answer });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta pergunta?")) return;
    await api.delete(`/faqs/${id}`);
    setItems((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Perguntas Frequentes" description="Editáveis e mostradas na página inicial." />

      {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f._id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <input
                value={f.question}
                onChange={(e) => setLocal(f._id, { question: e.target.value })}
                className="w-full font-medium px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900"
                placeholder="Pergunta"
              />
              <textarea
                value={f.answer}
                onChange={(e) => setLocal(f._id, { answer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-700 min-h-[80px]"
                placeholder="Resposta"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => save(f)} disabled={savingId === f._id} className="inline-flex items-center gap-1.5 bg-angola-navy text-white px-4 py-2 rounded-lg text-sm hover:brightness-110 disabled:opacity-60">
                  {savingId === f._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Guardar
                </button>
                <button type="button" onClick={() => remove(f._id)} className="p-2 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg" aria-label="Eliminar">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addNew} className="flex items-center gap-2 text-angola-navy font-medium px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-angola-gold w-full justify-center">
            <Plus className="w-4 h-4" />Adicionar pergunta
          </button>
        </div>
      )}
    </div>
  );
}
