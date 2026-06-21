"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save, ChevronDown, ChevronUp, X, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { OrgaoItem, OrgaoMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

const REGION_LABEL: Record<string, string> = { norte: "Região Norte", centro: "Região Centro", sul: "Região Sul" };
const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

export default function OrgaosAdminPage() {
  const [items, setItems] = useState<OrgaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<OrgaoItem[]>("/orgaos/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const addNew = async () => {
    setCreating(true);
    try {
      const created = await api.post<OrgaoItem>("/orgaos", { name: "Novo órgão", scope: "nacional", order: items.length }, true);
      setItems((prev) => [...prev, created]);
    } finally {
      setCreating(false);
    }
  };

  const onSaved = (saved: OrgaoItem) => setItems((prev) => prev.map((o) => (o._id === saved._id ? saved : o)));
  const onRemoved = (id: string) => setItems((prev) => prev.filter((o) => o._id !== id));

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Órgãos" description="Órgãos nacionais e regionais (Norte, Centro, Sul) mostrados no site." />
        <button type="button" onClick={addNew} disabled={creating} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 disabled:opacity-60 shrink-0">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Novo órgão
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((o) => <OrgaoCard key={o._id} orgao={o} onSaved={onSaved} onRemoved={onRemoved} />)}
          {items.length === 0 && <p className="text-gray-500 text-center py-12">Ainda não há órgãos.</p>}
        </div>
      )}
    </div>
  );
}

function OrgaoCard({ orgao, onSaved, onRemoved }: { orgao: OrgaoItem; onSaved: (o: OrgaoItem) => void; onRemoved: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(orgao.name);
  const [scope, setScope] = useState(orgao.scope);
  const [region, setRegion] = useState(orgao.region);
  const [description, setDescription] = useState(orgao.description);
  const [members, setMembers] = useState<OrgaoMember[]>(orgao.members ?? []);
  const [isPublished, setIsPublished] = useState(orgao.isPublished);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setMember = (i: number, patch: Partial<OrgaoMember>) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const save = async () => {
    setSaving(true);
    try {
      const cleanMembers = members.filter((m) => m.name.trim());
      const saved = await api.patch<OrgaoItem>(`/orgaos/${orgao._id}`, {
        name, scope, region: scope === "regional" ? region : "", description,
        members: cleanMembers, isPublished,
      });
      onSaved(saved);
      setMembers(cleanMembers);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm("Eliminar este órgão?")) return;
    setDeleting(true);
    try {
      await api.delete(`/orgaos/${orgao._id}`);
      onRemoved(orgao._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50">
        <div>
          <p className="font-semibold text-gray-900">{orgao.name}</p>
          <p className="text-xs text-gray-500">
            {orgao.scope === "regional" ? REGION_LABEL[orgao.region] || "Regional" : "Nacional"}
            {" · "}{orgao.members?.length ?? 0} membro(s){!orgao.isPublished && " · oculto"}
          </p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Âmbito</label>
              <select className={inputClass} value={scope} onChange={(e) => setScope(e.target.value as OrgaoItem["scope"])}>
                <option value="nacional">Nacional</option>
                <option value="regional">Regional</option>
              </select>
            </div>
            {scope === "regional" && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Região</label>
                <select className={inputClass} value={region} onChange={(e) => setRegion(e.target.value as OrgaoItem["region"])}>
                  <option value="">—</option>
                  <option value="norte">Região Norte</option>
                  <option value="centro">Região Centro</option>
                  <option value="sul">Região Sul</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Descrição (opcional)</label>
            <textarea className={`${inputClass} min-h-[70px]`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição das competências do órgão" />
          </div>

          {/* Membros */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Membros / Composição</label>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${inputClass} flex-1`} value={m.name} onChange={(e) => setMember(i, { name: e.target.value })} placeholder="Nome" />
                  <input className={`${inputClass} flex-1`} value={m.role ?? ""} onChange={(e) => setMember(i, { role: e.target.value })} placeholder="Cargo (ex: Presidente)" />
                  <button type="button" onClick={() => setMembers((prev) => prev.filter((_, idx) => idx !== i))} className="p-2 text-gray-400 hover:text-red-600 shrink-0" aria-label="Remover membro">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setMembers((prev) => [...prev, { name: "", role: "" }])} className="mt-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:border-angola-gold text-gray-600">
              <UserPlus className="w-3.5 h-3.5" /> Adicionar membro
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-angola-navy" />
            Visível no site
          </label>

          <div className="flex justify-between items-center pt-3 border-t">
            <button type="button" onClick={remove} disabled={deleting} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} Eliminar
            </button>
            <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-angola-navy text-white rounded-lg disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
