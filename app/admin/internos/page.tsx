"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Pencil, X, GraduationCap } from "lucide-react";
import { api } from "@/lib/api";
import { College, Interno, BankMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { MemberPicker } from "@/components/admin/member-picker";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";
const ANOS = ["1º ano", "2º ano", "3º ano", "4º ano", "5º ano", "6º ano"];

export default function InternosPage() {
  const { user } = useAdminAuth();
  const isColegio = user?.role === "colegio";
  const [colleges, setColleges] = useState<College[]>([]);
  const [college, setCollege] = useState("");
  const [items, setItems] = useState<Interno[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Interno | "new" | null>(null);

  useEffect(() => {
    api.get<College[]>("/colleges", true).then((c) => { setColleges(c); if (isColegio && c[0]) setCollege(c[0]._id); }).catch(() => {});
  }, []); // eslint-disable-line

  const load = async () => {
    setLoading(true);
    try { setItems(await api.get<Interno[]>(`/colleges/internos/list${college ? `?college=${college}` : ""}`, true)); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [college]); // eslint-disable-line

  const remove = async (i: Interno) => {
    if (!confirm(`Eliminar o interno ${i.name}?`)) return;
    await api.delete(`/colleges/internos/${i._id}`);
    setItems((p) => p.filter((x) => x._id !== i._id));
  };
  const collegeName = (id: string) => colleges.find((c) => c._id === id)?.name ?? "—";

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title="Internos de Especialidade" description="Médicos internos em formação nos colégios de especialidade." />
        <button type="button" onClick={() => setEditing("new")} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
          <Plus className="w-4 h-4" /> Novo interno
        </button>
      </div>

      {!isColegio && (
        <select className={`${inputClass} max-w-xs mb-5`} value={college} onChange={(e) => setCollege(e.target.value)} aria-label="Colégio">
          <option value="">Todos os colégios</option>
          {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-12">Sem internos registados.</p>
      ) : (
        <div className="space-y-2">
          {items.map((i) => (
            <div key={i._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><GraduationCap className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{i.name} {i.numeroOrdem && <span className="text-xs text-gray-400 font-mono font-normal">· {i.numeroOrdem}</span>}</p>
                <p className="text-xs text-gray-500">{collegeName(i.college)}{i.anoInternato ? ` · ${i.anoInternato}` : ""}{i.hospital ? ` · ${i.hospital}` : ""}{i.orientador ? ` · Orientador: ${i.orientador}` : ""}</p>
              </div>
              {i.status !== "ativo" && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{i.status}</span>}
              <div className="flex gap-1">
                <button type="button" onClick={() => setEditing(i)} className="p-2 text-gray-400 hover:text-angola-navy hover:bg-gray-50 rounded-lg" title="Editar"><Pencil className="w-4 h-4" /></button>
                <button type="button" onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <InternoForm interno={editing === "new" ? undefined : editing} colleges={colleges} isColegio={isColegio} defaultCollege={college} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function InternoForm({ interno, colleges, isColegio, defaultCollege, onClose, onSaved }: {
  interno?: Interno; colleges: College[]; isColegio: boolean; defaultCollege: string; onClose: () => void; onSaved: () => void;
}) {
  const [college, setCollege] = useState(interno?.college ?? defaultCollege ?? "");
  const [member, setMember] = useState<{ id: string; name: string; meta?: string } | null>(
    interno ? { id: interno.memberId, name: interno.name, meta: interno.numeroOrdem } : null,
  );
  const [orientador, setOrientador] = useState<{ id: string; name: string } | null>(
    interno?.orientadorId ? { id: interno.orientadorId, name: interno.orientador } : null,
  );
  const [anoInternato, setAnoInternato] = useState(interno?.anoInternato ?? "1º ano");
  const [hospital, setHospital] = useState(interno?.hospital ?? "");
  const [status, setStatus] = useState(interno?.status ?? "ativo");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!isColegio && !college) { setError("Selecione o colégio."); return; }
    if (!interno && !member) { setError("Selecione o médico no banco da Ordem."); return; }
    setSaving(true);
    try {
      const body: Record<string, unknown> = { anoInternato, hospital, status, orientadorId: orientador?.id ?? "" };
      if (!isColegio) body.college = college;
      if (!interno) body.memberId = member?.id;
      if (interno) await api.patch(`/colleges/internos/${interno._id}`, body);
      else await api.post("/colleges/internos", body, true);
      onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{interno ? "Editar interno" : "Novo interno"}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {!isColegio && (
            <select className={inputClass} value={college} onChange={(e) => setCollege(e.target.value)} aria-label="Colégio">
              <option value="">Colégio *</option>
              {colleges.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          )}
          {interno ? (
            <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{interno.name}</p>
              <p className="text-[11px] text-gray-500 font-mono">{interno.numeroOrdem}{interno.biPassaporte ? ` · ${interno.biPassaporte}` : ""}</p>
            </div>
          ) : (
            <MemberPicker label="Médico (do banco da Ordem) *" placeholder="Procurar por nome, nº ordem, nº utente..."
              selected={member} onSelect={(m: BankMember | null) => setMember(m ? { id: m._id, name: m.name, meta: m.numeroOrdem } : null)} />
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <select className={inputClass} value={anoInternato} onChange={(e) => setAnoInternato(e.target.value)} aria-label="Ano do internato">
              {ANOS.map((a) => <option key={a}>{a}</option>)}
            </select>
            <input className={inputClass} placeholder="Hospital / Instituição" value={hospital} onChange={(e) => setHospital(e.target.value)} />
          </div>
          <MemberPicker label="Orientador (especialista com categoria de orientador)" categoria="orientador" allowClear
            placeholder="Procurar orientador no banco..."
            selected={orientador ? { id: orientador.id, name: orientador.name } : null}
            onSelect={(m: BankMember | null) => setOrientador(m ? { id: m._id, name: m.name } : null)} />
          {interno && (
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Estado">
              <option value="ativo">Ativo</option><option value="concluido">Concluído</option><option value="suspenso">Suspenso</option>
            </select>
          )}
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
