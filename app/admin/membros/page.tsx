"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Search, KeyRound, Trash2, Pencil, X, Copy, Printer, IdCard, Check, Inbox, Upload,
} from "lucide-react";
import { api, API_URL, tokenStore } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";
import { CountrySelect } from "@/components/country-select";
import { provinces } from "@/lib/data";

interface Member {
  _id: string; numeroUtente: string; numeroOrdem: string; name: string; biPassaporte: string;
  phone: string; email: string; especialidade: string; provincia: string; pais?: string; residencia: string;
  notes?: string; status: string; situacao?: string; situacaoMotivo?: string;
  categorias?: string[]; collegeId?: string; simulado?: boolean;
  photo?: { url: string; publicId?: string } | null; createdAt: string;
}
interface ChangeReq {
  _id: string; numeroUtente: string; memberName: string; changes: Record<string, string>;
  status: string; adminNotes: string; createdAt: string;
}

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";
const FIELD_LABEL: Record<string, string> = { name: "Nome", phone: "Telefone", email: "Email", especialidade: "Especialidade", provincia: "Província", residencia: "Residência" };

const SITUACAO_LABEL: Record<string, string> = { vigor: "Em Vigor", suspensa: "Suspensa", cancelada: "Cancelada" };
const SITUACAO_STYLE: Record<string, string> = {
  vigor: "bg-green-100 text-green-700", suspensa: "bg-amber-100 text-amber-700", cancelada: "bg-red-100 text-red-700",
};
const CATEGORIA_LABEL: Record<string, string> = { clinico_geral: "Clínico Geral", interno: "Interno", especialista: "Especialista", orientador: "Orientador" };
const CATEGORIA_STYLE: Record<string, string> = {
  clinico_geral: "bg-gray-100 text-gray-600", interno: "bg-blue-100 text-blue-700",
  especialista: "bg-indigo-100 text-indigo-700", orientador: "bg-angola-gold/20 text-angola-navy",
};
const ALL_CATEGORIAS = ["clinico_geral", "interno", "especialista", "orientador"];

export default function MembrosPage() {
  const [tab, setTab] = useState<"membros" | "pedidos">("membros");
  const [items, setItems] = useState<Member[]>([]);
  const [reqs, setReqs] = useState<ChangeReq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fSituacao, setFSituacao] = useState("");
  const [fCategoria, setFCategoria] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creds, setCreds] = useState<{ numeroUtente: string; accessCode: string; name: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.set("search", search);
      if (fSituacao) q.set("situacao", fSituacao);
      if (fCategoria) q.set("categoria", fCategoria);
      const qs = q.toString();
      const [m, r] = await Promise.all([
        api.get<Member[]>(`/members${qs ? `?${qs}` : ""}`, true),
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
          <div className="flex gap-2 mb-3 flex-wrap">
            <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex-1 flex gap-2 min-w-[260px]">
              <input className={inputClass} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por nome, nº utente, nº ordem, BI..." />
              <button type="submit" className="px-3 rounded-lg bg-gray-100 text-gray-600"><Search className="w-4 h-4" /></button>
            </form>
            <button type="button" onClick={() => setCreating(true)} className="inline-flex items-center gap-1.5 bg-angola-gold text-angola-navy font-semibold px-4 py-2 rounded-lg hover:brightness-95 shrink-0">
              <Plus className="w-4 h-4" /> Novo membro
            </button>
          </div>
          <div className="flex gap-2 mb-5 flex-wrap">
            <select className={`${inputClass} max-w-[170px]`} value={fSituacao} onChange={(e) => { setFSituacao(e.target.value); setTimeout(load, 0); }} aria-label="Filtrar por situação">
              <option value="">Todas as situações</option>
              <option value="vigor">Em Vigor</option><option value="suspensa">Suspensa</option><option value="cancelada">Cancelada</option>
            </select>
            <select className={`${inputClass} max-w-[170px]`} value={fCategoria} onChange={(e) => { setFCategoria(e.target.value); setTimeout(load, 0); }} aria-label="Filtrar por categoria">
              <option value="">Todas as categorias</option>
              {ALL_CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center py-12">Sem membros registados.</p>
          ) : (
            <div className="space-y-2">
              {items.map((m) => (
                <div key={m._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 flex-wrap">
                  {m.photo?.url
                    ? <img src={m.photo.url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    : <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><IdCard className="w-5 h-5" /></div>}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                      {m.name}
                      {(m.categorias ?? []).map((c) => (
                        <span key={c} className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORIA_STYLE[c] ?? "bg-gray-100 text-gray-600"}`}>{CATEGORIA_LABEL[c] ?? c}</span>
                      ))}
                      {m.simulado && <span className="text-[10px] text-gray-400 italic">simulado</span>}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">{m.numeroUtente} · Ordem {m.numeroOrdem}{m.especialidade ? ` · ${m.especialidade}` : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${SITUACAO_STYLE[m.situacao ?? "vigor"]}`}>{SITUACAO_LABEL[m.situacao ?? "vigor"]}</span>
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
    provincia: member?.provincia ?? "", pais: member?.pais ?? "Angola", residencia: member?.residencia ?? "", status: member?.status ?? "ativo",
    situacao: member?.situacao ?? "vigor", situacaoMotivo: member?.situacaoMotivo ?? "",
  });
  const [categorias, setCategorias] = useState<string[]>(member?.categorias ?? ["clinico_geral"]);
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(member?.photo?.url ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const toggleCat = (c: string) =>
    setCategorias((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev.filter((x) => x !== "clinico_geral" || c === "clinico_geral"), c]));

  useEffect(() => {
    api.get<{ _id: string; name: string }[]>("/specialties").then(setSpecialties).catch(() => setSpecialties([]));
  }, []);

  const onPickPhoto = (file: File | null) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : (member?.photo?.url ?? null));
  };
  const uploadPhoto = async (id: string): Promise<Member["photo"] | undefined> => {
    if (!photoFile) return undefined;
    const fd = new FormData();
    fd.append("photo", photoFile);
    const res = await fetch(`${API_URL}/members/${id}/photo`, { method: "PATCH", headers: { Authorization: `Bearer ${tokenStore.getAccess()}` }, body: fd });
    if (!res.ok) throw new Error("Falha ao carregar a foto.");
    return ((await res.json()) as Member).photo;
  };

  const submit = async () => {
    setError(null);
    if (!f.name || !f.numeroOrdem || !f.biPassaporte || !f.phone) { setError("Preencha nome, nº de ordem, BI/passaporte e telefone."); return; }
    setSaving(true);
    try {
      if (member) {
        const m = await api.patch<Member>(`/members/${member._id}`, { ...f, categorias: categorias.length ? categorias : ["clinico_geral"] });
        const photo = await uploadPhoto(member._id);
        onUpdated?.({ ...m, photo: photo ?? m.photo });
      } else {
        const res = await api.post<{ member: Member; numeroUtente: string; accessCode: string }>("/members", f, true);
        const photo = await uploadPhoto(res.member._id);
        onCreated?.({ ...res.member, photo: photo ?? res.member.photo }, { numeroUtente: res.numeroUtente, accessCode: res.accessCode, name: res.member.name });
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
        <div className="flex items-center gap-4 mb-4">
          {photoPreview
            ? <img src={photoPreview} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
            : <div className="w-16 h-16 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center"><IdCard className="w-7 h-7" /></div>}
          <label className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="w-4 h-4" /> {photoFile ? "Alterar foto" : "Foto do médico"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className={inputClass} placeholder="Nome completo *" value={f.name} onChange={(e) => set("name", e.target.value)} />
          <input className={inputClass} placeholder="Nº de Ordem *" value={f.numeroOrdem} onChange={(e) => set("numeroOrdem", e.target.value)} />
          <input className={inputClass} placeholder="BI / Passaporte *" value={f.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} />
          <input className={inputClass} placeholder="Telefone *" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
          <input className={inputClass} placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          <select className={inputClass} value={f.especialidade} onChange={(e) => set("especialidade", e.target.value)} aria-label="Especialidade">
            <option value="">— Especialidade —</option>
            {f.especialidade && !specialties.some((s) => s.name === f.especialidade) && <option value={f.especialidade}>{f.especialidade}</option>}
            {specialties.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
          </select>
          <CountrySelect value={f.pais} onChange={(v) => set("pais", v)} className={inputClass} />
          <select className={inputClass} value={f.provincia} onChange={(e) => set("provincia", e.target.value)} aria-label="Província">
            <option value="">— Província —</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input className={inputClass} placeholder="Residência" value={f.residencia} onChange={(e) => set("residencia", e.target.value)} />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Situação da inscrição</label>
            <select className={inputClass} value={f.situacao} onChange={(e) => set("situacao", e.target.value)} aria-label="Situação da inscrição">
              <option value="vigor">Em Vigor</option>
              <option value="suspensa">Suspensa</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          {f.situacao !== "vigor" && (
            <input className={inputClass} placeholder="Motivo (quotas, disciplinar, a pedido...)" value={f.situacaoMotivo} onChange={(e) => set("situacaoMotivo", e.target.value)} />
          )}
        </div>
        {member && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Categorias</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIAS.map((c) => {
                const active = categorias.includes(c);
                return (
                  <button key={c} type="button" onClick={() => toggleCat(c)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border ${active ? "bg-angola-navy text-white border-angola-navy" : "bg-white text-gray-600 border-gray-300"}`}>
                    {CATEGORIA_LABEL[c]}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">Orientador só se aplica a especialistas. As atribuições feitas pelo Coordenador do Colégio carecem de aprovação da Bastonária.</p>
          </div>
        )}
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
