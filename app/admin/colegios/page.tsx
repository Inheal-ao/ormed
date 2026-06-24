"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, Stethoscope } from "lucide-react";
import { api } from "@/lib/api";
import { College, BankMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { MemberPicker } from "@/components/admin/member-picker";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

export default function ColegiosPage() {
  const { user } = useAdminAuth();
  const isManager = ["super_admin", "admin", "bastonaria"].includes(user?.role ?? "");
  const [items, setItems] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<College | "new" | null>(null);

  const load = async () => {
    setLoading(true);
    try { setItems(await api.get<College[]>("/colleges", true)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const remove = async (c: College) => {
    if (!confirm(`Eliminar o ${c.name}?`)) return;
    await api.delete(`/colleges/${c._id}`);
    setItems((p) => p.filter((x) => x._id !== c._id));
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Colégios de Especialidades" description="Colégios responsáveis pelos internatos e questões específicas das especialidades." />
        {isManager && (
          <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
            <Plus className="w-4 h-4" /> Novo colégio
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Sem colégios registados.</p>
      ) : (
        <div className="space-y-2">
          {items.map((c) => (
            <div key={c._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><Stethoscope className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.especialidade}{c.coordinator ? ` · Presidente: ${c.coordinator}` : ""}</p>
              </div>
              {c.status !== "ativo" && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{c.status}</span>}
              {isManager && (
                <div className="flex gap-1">
                  <button type="button" onClick={() => setEditing(c)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => remove(c)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && <CollegeForm college={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function CollegeForm({ college, onClose, onSaved }: { college?: College; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({ name: college?.name ?? "", especialidade: college?.especialidade ?? "", description: college?.description ?? "", status: college?.status ?? "ativo" });
  const [president, setPresident] = useState<{ id: string; name: string } | null>(
    college?.presidentId ? { id: college.presidentId, name: college.coordinator } : null,
  );
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    api.get<{ _id: string; name: string }[]>("/specialties").then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  // Ao escolher a especialidade, sugere o nome do colégio automaticamente.
  const pickEspecialidade = (esp: string) => {
    setF((p) => ({
      ...p,
      especialidade: esp,
      name: !p.name.trim() || p.name === `Colégio de ${p.especialidade}` ? `Colégio de ${esp}` : p.name,
    }));
  };

  const submit = async () => {
    if (!f.name.trim() || !f.especialidade.trim()) return;
    setSaving(true);
    try {
      const body = { ...f, presidentId: president?.id ?? "" };
      if (college) await api.patch(`/colleges/${college._id}`, body);
      else await api.post("/colleges", body, true);
      onSaved();
    } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{college ? "Editar colégio" : "Novo colégio"}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Especialidade (da base de dados oficial) *</label>
            <select className={inputClass} value={f.especialidade} onChange={(e) => pickEspecialidade(e.target.value)} aria-label="Especialidade">
              <option value="">— Selecionar especialidade reconhecida —</option>
              {specialties.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <input className={inputClass} placeholder="Nome do colégio *" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <MemberPicker label="Presidente do Colégio (médico do banco, em situação regular)" allowClear
            placeholder="Procurar médico no banco (nome, nº ordem, nº utente)..."
            selected={president} onSelect={(m: BankMember | null) => setPresident(m ? { id: m._id, name: m.name } : null)} />
          <textarea className={`${inputClass} min-h-[80px]`} placeholder="Descrição" value={f.description} onChange={(e) => set("description", e.target.value)} />
          {college && (
            <select className={inputClass} value={f.status} onChange={(e) => set("status", e.target.value)} aria-label="Estado">
              <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
            </select>
          )}
        </div>
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
