"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { SpecialtyItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function EspecialidadesPage() {
  const [items, setItems] = useState<SpecialtyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<SpecialtyItem[]>("/specialties/admin/all", true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const created = await api.post<SpecialtyItem>(
        "/specialties",
        { name: newName.trim(), order: items.length },
        true,
      );
      setItems((prev) => [...prev, created]);
      setNewName("");
    } finally {
      setAdding(false);
    }
  };

  const remove = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/specialties/${id}`);
      setItems((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Especialidades"
        description="Lista de especialidades médicas reconhecidas, mostrada no site."
      />

      <form onSubmit={add} className="flex gap-2 mb-6">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nova especialidade"
          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900"
        />
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2.5 rounded-lg hover:brightness-95 disabled:opacity-60"
        >
          {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Adicionar
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between px-4 py-3">
              <span className="text-gray-800">{item.name}</span>
              <button
                type="button"
                onClick={() => remove(item._id)}
                disabled={deleting === item._id}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                aria-label="Eliminar"
              >
                {deleting === item._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-500 text-center py-10">Ainda não há especialidades.</p>
          )}
        </div>
      )}
    </div>
  );
}
