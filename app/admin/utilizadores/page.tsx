"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Trash2, Lock, Unlock, KeyRound, Ticket, X, Copy, Printer, ShieldCheck,
} from "lucide-react";
import { api } from "@/lib/api";
import { ManagedUser } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { PERMISSION_SECTIONS } from "@/lib/permissions";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

const ROLE_TABS = [
  { role: "bastonaria", label: "Bastonárias", godOnly: true },
  { role: "funcionario", label: "Funcionários", godOnly: false },
  { role: "universidade", label: "Universidades", godOnly: false },
];

export default function UtilizadoresPage() {
  const { user } = useAdminAuth();
  const isGod = user?.role === "super_admin" || user?.role === "admin";
  const [tab, setTab] = useState("funcionario");
  const [items, setItems] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [codesModal, setCodesModal] = useState<{ name: string; codes: string[] } | null>(null);

  const tabs = ROLE_TABS.filter((t) => !t.godOnly || isGod);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<ManagedUser[]>(`/users?role=${tab}`, true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [tab]); // eslint-disable-line

  const onCreated = (u: ManagedUser) => { setItems((p) => [u, ...p]); setCreating(false); };
  const patch = (id: string, p: Partial<ManagedUser>) => setItems((prev) => prev.map((u) => (u._id === id ? { ...u, ...p } : u)));

  const block = async (u: ManagedUser) => {
    const updated = await api.patch<ManagedUser>(`/users/${u._id}/block`, { blocked: !u.isBlocked });
    patch(u._id, { isBlocked: updated.isBlocked });
  };
  const remove = async (u: ManagedUser) => {
    if (!confirm(`Eliminar ${u.name}? Esta ação é irreversível.`)) return;
    await api.delete(`/users/${u._id}`);
    setItems((prev) => prev.filter((x) => x._id !== u._id));
  };
  const resetPassword = async (u: ManagedUser) => {
    const pw = prompt(`Nova password para ${u.name} (mín. 8 caracteres):`);
    if (!pw) return;
    if (pw.length < 8) { alert("Mínimo 8 caracteres."); return; }
    await api.post(`/users/${u._id}/password`, { password: pw });
    alert("Password redefinida.");
  };
  const genCodes = async (u: ManagedUser) => {
    const res = await api.post<{ codes: string[] }>("/access-codes/generate", { targetUserId: u._id, count: 50 }, true);
    setCodesModal({ name: u.universityName || u.name, codes: res.codes });
  };

  // Quem pode gerar códigos para quem
  const canGenCodes = (u: ManagedUser) =>
    (u.role === "universidade") || (u.role === "bastonaria" && isGod);

  return (
    <div className="max-w-3xl">
      <PageHeader title="Utilizadores" description="Gestão de perfis, permissões e códigos de acesso." />

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button key={t.role} type="button" onClick={() => { setTab(t.role); setCreating(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === t.role ? "bg-angola-navy text-white" : "bg-gray-100 text-gray-600"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex justify-end mb-4">
        <button type="button" onClick={() => setCreating((v) => !v)} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95">
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {creating ? "Cancelar" : `Novo`}
        </button>
      </div>

      {creating && <CreateForm role={tab} onCreated={onCreated} onCodes={(name, codes) => setCodesModal({ name, codes })} />}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Sem utilizadores neste perfil.</p>
      ) : (
        <div className="space-y-3">
          {items.map((u) => (
            <UserCard key={u._id} u={u} onBlock={block} onRemove={remove} onResetPw={resetPassword}
              onGenCodes={canGenCodes(u) ? genCodes : undefined} onSaved={(s) => patch(u._id, s)} />
          ))}
        </div>
      )}

      {codesModal && <CodesModal name={codesModal.name} codes={codesModal.codes} onClose={() => setCodesModal(null)} />}
    </div>
  );
}

function CreateForm({ role, onCreated, onCodes }: { role: string; onCreated: (u: ManagedUser) => void; onCodes: (name: string, codes: string[]) => void }) {
  const [f, setF] = useState({ name: "", email: "", password: "", phone: "", universityName: "", responsibleType: "reitor" });
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const togglePerm = (k: string) => setPermissions((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (role === "bastonaria") {
        const u = await api.post<ManagedUser>("/users/bastonaria", { name: f.name, email: f.email, password: f.password, phone: f.phone }, true);
        onCreated(u);
      } else if (role === "funcionario") {
        const u = await api.post<ManagedUser>("/users/funcionario", { name: f.name, email: f.email, password: f.password, phone: f.phone, permissions }, true);
        onCreated(u);
      } else {
        const u = await api.post<ManagedUser>("/users/universidade", { name: f.name, email: f.email, password: f.password, phone: f.phone, universityName: f.universityName, responsibleType: f.responsibleType }, true);
        onCreated(u);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border border-angola-gold/40 rounded-xl p-5 space-y-4 mb-5">
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Nome completo" value={f.name} onChange={(e) => set("name", e.target.value)} required />
        <input type="email" className={inputClass} placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} required />
        <input type="password" className={inputClass} placeholder="Password (mín. 8)" value={f.password} onChange={(e) => set("password", e.target.value)} required />
        <input className={inputClass} placeholder="Telefone (opcional)" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>

      {role === "universidade" && (
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Nome da universidade" value={f.universityName} onChange={(e) => set("universityName", e.target.value)} required />
          <select className={inputClass} value={f.responsibleType} onChange={(e) => set("responsibleType", e.target.value)} aria-label="Cargo">
            <option value="reitor">Reitor(a)</option>
            <option value="decano">Decano(a)</option>
          </select>
        </div>
      )}

      {role === "funcionario" && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Secções a que tem acesso</p>
          <div className="grid sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto border border-gray-100 rounded-lg p-2">
            {PERMISSION_SECTIONS.map((s) => (
              <label key={s.key} className="flex items-center gap-2 text-sm text-gray-700 px-1 py-0.5">
                <input type="checkbox" checked={permissions.includes(s.key)} onChange={() => togglePerm(s.key)} className="w-4 h-4 accent-angola-navy" />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Criar
      </button>
    </form>
  );
}

function UserCard({ u, onBlock, onRemove, onResetPw, onGenCodes, onSaved }: {
  u: ManagedUser; onBlock: (u: ManagedUser) => void; onRemove: (u: ManagedUser) => void;
  onResetPw: (u: ManagedUser) => void; onGenCodes?: (u: ManagedUser) => void; onSaved: (p: Partial<ManagedUser>) => void;
}) {
  const [stats, setStats] = useState<{ unused: number; total: number } | null>(null);
  const showCodes = u.role === "universidade" || u.role === "bastonaria";

  useEffect(() => {
    if (!showCodes) return;
    api.get<{ unused: number; total: number }>(`/access-codes/stats/${u._id}`, true).then(setStats).catch(() => {});
  }, [u._id]); // eslint-disable-line

  return (
    <div className={`bg-white border rounded-xl p-4 ${u.isBlocked ? "border-red-200 bg-red-50/30" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-gray-900">{u.universityName || u.name}</p>
          <p className="text-xs text-gray-500">{u.email}{u.phone ? ` · ${u.phone}` : ""}</p>
          {u.role === "universidade" && <p className="text-xs text-gray-500">{u.name} · {u.responsibleType === "decano" ? "Decano(a)" : "Reitor(a)"}</p>}
          {u.isBlocked && <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Bloqueado</span>}
        </div>
        {showCodes && stats && (
          <span className="inline-flex items-center gap-1 text-xs bg-angola-navy/5 text-angola-navy px-2 py-1 rounded-full">
            <Ticket className="w-3.5 h-3.5" /> {stats.unused} códigos por usar
          </span>
        )}
      </div>

      {u.role === "funcionario" && (
        <FuncionarioPerms u={u} onSaved={onSaved} />
      )}

      <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t">
        {onGenCodes && (
          <button type="button" onClick={() => onGenCodes(u)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-angola-gold text-angola-navy font-medium rounded-lg hover:brightness-95">
            <Ticket className="w-3.5 h-3.5" /> Gerar 50 códigos
          </button>
        )}
        <button type="button" onClick={() => onResetPw(u)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          <KeyRound className="w-3.5 h-3.5" /> Repor password
        </button>
        <button type="button" onClick={() => onBlock(u)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
          {u.isBlocked ? <><Unlock className="w-3.5 h-3.5" /> Desbloquear</> : <><Lock className="w-3.5 h-3.5" /> Bloquear</>}
        </button>
        <button type="button" onClick={() => onRemove(u)} className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
          <Trash2 className="w-3.5 h-3.5" /> Eliminar
        </button>
      </div>
    </div>
  );
}

function FuncionarioPerms({ u, onSaved }: { u: ManagedUser; onSaved: (p: Partial<ManagedUser>) => void }) {
  const [editing, setEditing] = useState(false);
  const [perms, setPerms] = useState<string[]>(u.permissions ?? []);
  const [saving, setSaving] = useState(false);
  const toggle = (k: string) => setPerms((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const save = async () => {
    setSaving(true);
    try {
      await api.patch(`/users/${u._id}`, { permissions: perms });
      onSaved({ permissions: perms });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="mt-2">
      {!editing ? (
        <button type="button" onClick={() => setEditing(true)} className="text-xs text-angola-blue hover:underline">
          <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />{perms.length} secção(ões) permitida(s) — editar
        </button>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 mt-1">
          <div className="grid sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto">
            {PERMISSION_SECTIONS.map((s) => (
              <label key={s.key} className="flex items-center gap-2 text-xs text-gray-700">
                <input type="checkbox" checked={perms.includes(s.key)} onChange={() => toggle(s.key)} className="w-3.5 h-3.5 accent-angola-navy" />
                {s.label}
              </label>
            ))}
          </div>
          <button type="button" onClick={save} disabled={saving} className="mt-2 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-angola-navy text-white rounded-lg">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Guardar permissões"}
          </button>
        </div>
      )}
    </div>
  );
}

function CodesModal({ name, codes, onClose }: { name: string; codes: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Códigos de acesso gerados</h3>
            <p className="text-sm text-gray-500">{name}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-3">
          ⚠️ Guarde/entregue estes códigos agora. Cada um é de <strong>uso único</strong> e <strong>não voltarão a ser mostrados</strong>.
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-sm" id="codes-print">
          {codes.map((c, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-center">{c}</div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={() => navigator.clipboard.writeText(codes.join("\n"))} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Copy className="w-4 h-4" /> Copiar
          </button>
          <button type="button" onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 bg-angola-navy text-white rounded-lg">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
