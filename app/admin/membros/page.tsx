"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Search, KeyRound, Trash2, Pencil, X, Copy, Printer, IdCard, Check, Inbox,
} from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";

interface Member {
  _id: string; numeroUtente: string; numeroOrdem: string; name: string; biPassaporte: string;
  phone: string; email: string; especialidade: string; provincia: string; residencia: string;
  notes?: string; status: string; createdAt: string;
}
interface ChangeReq {
  _id: string; numeroUtente: string; memberName: string; changes: Record<string, string>;
  status: string; adminNotes: string; createdAt: string;
}

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";
const FIELD_LABEL: Record<string, string> = { name: "Nome", phone: "Telefone", email: "Email", especialidade: "Especialidade", provincia: "Província", residencia: "Residência" };

export default function MembrosPage() {
  const [tab, setTab] = useState<"membros" | "pedidos">("membros");
  const [items, setItems] = useState<Member[]>([]);
  const [reqs, setReqs] = useState<ChangeReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creds, setCreds] = useState<{ numeroUtente: string; accessCode: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [m, r] = await Promise.all([
        api.get<Member[]>(`/members${search ? `?search=${encodeURIComponent(search)}` : ""}`, true),
        api.get<ChangeReq[]>("/members/change-requests/all", true),
      ]);
      setItems(m); setReqs(r);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const pendentes = reqs.filter((r) => r.status === "pending").length;

  const regen = async (m: Member) => {
    if (!confirm(`Gerar um novo código de acesso para ${m.name}? O anterior deixa de funcionar.`)) return;
    const res = await api.post<{ accessCode: string }>(`/members/${m._id}/code`, {}, true);
    setCreds({ numeroUtente: m.numeroUtente, accessCode: res.accessCode, name: m.name });
  };
  const remove = async (m: Member) => {
    if (!confirm(`Eliminar o membro ${m.name}?`)) return;
    await api.delete(`/members/${m._id}`);
    setItems((p) => p.filter((x) => x._id !== m._id));
  };
  const resolve = async (r: ChangeReq, status: "approved" | "rejected") => {
    await api.patch(`/members/change-requests/${r._id}`, { status });
    setReqs((p) => p.map((x) => (x._id === r._id ? { ...x, status } : x)));
    if (status === "approved") load();
  };

  return (
    <div className="max-w-4xl">
      <PageHeader title="Membros (Médicos)" description="Fichas de médicos inscritos, números de utente e pedidos de alteração." />

      <div className="flex gap-2 mb-6">
        <button type="button" onClick={() => setTab("membros")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "membros" ? "bg-angola-navy text-white" : "bg-gray-100 text-gray-600"}`}>Membros</button>
        <button type="button" onClick={() => setTab("pedidos")} className={`px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 ${tab === "pedidos" ? "bg-angola-navy text-white" : "bg-gray-100 text-gray-600"}`}>
          Pedidos de Alteração {pendentes > 0 && <span className="bg-angola-gold text-angola-navy text-xs font-bold rounded-full px-2">{pendentes}</span>}
        </button>
      </div>

      {tab === "membros" ? (
        <>
          <div className="flex gap-2 mb-5">
            <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex-1 flex gap-2">
              <input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por nome, nº utente, nº ordem, BI..." />
              <button type="submit" className="px-3 rounded-lg bg-gray-100 text-gray-600"><Search className="w-4 h-4" /></button>
            </form>
            <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
              <Plus className="w-4 h-4" /> Novo membro
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Sem membros registados.</p>
          ) : (
            <div className="space-y-2">
              {items.map((m) => (
                <div key={m._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 flex-wrap">
                  <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><IdCard className="w-5 h-5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{m.numeroUtente} · Ordem {m.numeroOrdem}{m.especialidade ? ` · ${m.especialidade}` : ""}</p>
                  </div>
                  {m.status !== "ativo" && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{m.status}</span>}
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setEditing(m)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button type="button" onClick={() => regen(m)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Novo código"><KeyRound className="w-4 h-4" /></button>
                    <button type="button" onClick={() => remove(m)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <ChangeRequests reqs={reqs} onResolve={resolve} />
      )}

      {creating && <MemberForm onClose={() => setCreating(false)} onCreated={(m, c) => { setItems((p) => [m, ...p]); setCreds(c); setCreating(false); }} />}
      {editing && <MemberForm member={editing} onClose={() => setEditing(null)} onUpdated={(m) => { setItems((p) => p.map((x) => (x._id === m._id ? m : x))); setEditing(null); }} />}
      {creds && <CredsModal creds={creds} onClose={() => setCreds(null)} />}
    </div>
  );
}

function ChangeRequests({ reqs, onResolve }: { reqs: ChangeReq[]; onResolve: (r: ChangeReq, s: "approved" | "rejected") => void }) {
  if (reqs.length === 0) return <p className="text-gray-500 text-center py-12 flex flex-col items-center gap-2"><Inbox className="w-8 h-8 text-gray-300" />Sem pedidos de alteração.</p>;
  return (
    <div className="space-y-3">
      {reqs.map((r) => (
        <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="font-semibold text-gray-900">{r.memberName}</p>
              <p className="text-xs text-gray-500 font-mono">{r.numeroUtente} · {new Date(r.createdAt).toLocaleDateString("pt-PT")}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${r.status === "pending" ? "bg-amber-100 text-amber-700" : r.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {r.status === "pending" ? "Pendente" : r.status === "approved" ? "Aprovado" : "Rejeitado"}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
            {Object.entries(r.changes).map(([k, v]) => (
              <p key={k}><span className="text-gray-400">{FIELD_LABEL[k] ?? k}:</span> <span className="font-medium">{v}</span></p>
            ))}
          </div>
          {r.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={() => onResolve(r, "approved")} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"><Check className="w-3.5 h-3.5" /> Aprovar e aplicar</button>
              <button type="button" onClick={() => onResolve(r, "rejected")} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"><X className="w-3.5 h-3.5" /> Rejeitar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MemberForm({ member, onClose, onCreated, onUpdated }: {
  member?: Member; onClose: () => void;
  onCreated?: (m: Member, c: { numeroUtente: string; accessCode: string; name: string }) => void;
  onUpdated?: (m: Member) => void;
}) {
  const [f, setF] = useState({
    name: member?.name ?? "", numeroOrdem: member?.numeroOrdem ?? "", biPassaporte: member?.biPassaporte ?? "",
    phone: member?.phone ?? "", email: member?.email ?? "", especialidade: member?.especialidade ?? "",
    provincia: member?.provincia ?? "", residencia: member?.residencia ?? "", status: member?.status ?? "ativo",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setError(null);
    if (!f.name || !f.numeroOrdem || !f.biPassaporte || !f.phone) { setError("Preencha nome, nº de ordem, BI/passaporte e telefone."); return; }
    setSaving(true);
    try {
      if (member) {
        const m = await api.patch<Member>(`/members/${member._id}`, f);
        onUpdated?.(m);
      } else {
        const res = await api.post<{ member: Member; numeroUtente: string; accessCode: string }>("/members", f, true);
        onCreated?.(res.member, { numeroUtente: res.numeroUtente, accessCode: res.accessCode, name: res.member.name });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{member ? "Editar membro" : "Novo membro"}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Nome completo *" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <input className={inputClass} placeholder="Nº de Ordem *" value={f.numeroOrdem} onChange={(e) => set("numeroOrdem", e.target.value)} />
          <input className={inputClass} placeholder="BI / Passaporte *" value={f.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} />
          <input className={inputClass} placeholder="Telefone *" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className={inputClass} placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <input className={inputClass} placeholder="Especialidade" value={f.especialidade} onChange={(e) => set("especialidade", e.target.value)} />
          <input className={inputClass} placeholder="Província" value={f.provincia} onChange={(e) => set("provincia", e.target.value)} />
          <input className={inputClass} placeholder="Residência" value={f.residencia} onChange={(e) => set("residencia", e.target.value)} />
          {member && (
            <select className={inputClass} value={f.status} onChange={(e) => set("status", e.target.value)} aria-label="Estado">
              <option value="ativo">Ativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
          <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-angola-navy text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} {member ? "Guardar" : "Criar membro"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CredsModal({ creds, onClose }: { creds: { numeroUtente: string; accessCode: string; name: string }; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const text = `Nº de Utente: ${creds.numeroUtente}\nCódigo de acesso: ${creds.accessCode}`;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
        <h3 className="text-lg font-bold text-gray-900">Credenciais do membro</h3>
        <p className="text-sm text-gray-500 mb-4">{creds.name}</p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-3">⚠️ Entregue estes dados ao médico. O código <strong>não volta a ser mostrado</strong>.</div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm space-y-1 mb-4">
          <p><span className="text-gray-400">Nº Utente:</span> {creds.numeroUtente}</p>
          <p><span className="text-gray-400">Código:</span> {creds.accessCode}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Copy className="w-4 h-4" /> {copied ? "Copiado!" : "Copiar"}</button>
          <button type="button" onClick={() => window.print()} className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 bg-angola-navy text-white rounded-lg"><Printer className="w-4 h-4" /> Imprimir</button>
        </div>
        <button type="button" onClick={onClose} className="mt-3 text-sm text-gray-500 hover:underline">Concluir</button>
      </div>
    </div>
  );
}
