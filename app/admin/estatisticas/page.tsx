"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { api } from "@/lib/api";
import { StatItem } from "@/lib/admin-types";
import { PageHeader, TextInput } from "@/components/admin/admin-ui";

const ICON_OPTIONS = [
  "Calendar", "Users", "MapPin", "Heart", "Award", "Activity",
  "Stethoscope", "Building", "GraduationCap", "ShieldCheck",
];

export default function EstatisticasPage() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<StatItem[]>("/stats/admin/all", true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLocal = (id: string, patch: Partial<StatItem>) =>
    setItems((prev) => prev.map((s) => (s._id === id ? { ...s, ...patch } : s)));

  const addNew = async () => {
    const created = await api.post<StatItem>(
      "/stats",
      { value: "0", label: "Novo indicador", icon: "Activity", order: items.length },
      true,
    );
    setItems((prev) => [...prev, created]);
  };

  const save = async (item: StatItem) => {
    setSavingId(item._id);
    try {
      await api.patch(`/stats/${item._id}`, {
        value: item.value,
        label: item.label,
        icon: item.icon,
        order: item.order,
      });
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este indicador?")) return;
    await api.delete(`/stats/${id}`);
    setItems((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div>
      <PageHeader
        title="Estatísticas"
        description="Números mostrados na página inicial (médicos inscritos, anos, etc.)."
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-end"
            >
              <div className="w-full sm:w-28">
                <label className="block text-xs text-gray-500 mb-1">Valor</label>
                <TextInput
                  value={item.value}
                  onChange={(e) => updateLocal(item._id, { value: e.target.value })}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Legenda</label>
                <TextInput
                  value={item.label}
                  onChange={(e) => updateLocal(item._id, { label: e.target.value })}
                />
              </div>
              <div className="w-full sm:w-44">
                <label className="block text-xs text-gray-500 mb-1">Ícone</label>
                <select
                  value={item.icon}
                  onChange={(e) => updateLocal(item._id, { icon: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-900"
                >
                  {ICON_OPTIONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => save(item)}
                  disabled={savingId === item._id}
                  className="flex items-center gap-1.5 bg-angola-navy text-white px-4 py-2.5 rounded-lg text-sm hover:brightness-110 disabled:opacity-60"
                >
                  {savingId === item._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => remove(item._id)}
                  className="p-2.5 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg"
                  aria-label="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addNew}
            className="flex items-center gap-2 text-angola-navy font-medium px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-angola-gold w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Adicionar indicador
          </button>
        </div>
      )}
    </div>
  );
}
