"use client";

import { useEffect, useState } from "react";
import { Loader2, KeyRound, ShieldCheck, User, Check, Save, LogOut, IdCard, GraduationCap, FileText, BookOpen } from "lucide-react";
import { API_URL } from "@/lib/api";

interface FichaData {
  _id: string;
  numeroUtente: string;
  numeroOrdem: string;
  name: string;
  biPassaporte: string;
  phone: string;
  email: string;
  especialidade: string;
  provincia: string;
  residencia: string;
  status: string;
  situacao?: string;
  categorias?: string[];
}

interface Dossier {
  isInterno: boolean;
  college?: { name: string; especialidade: string } | null;
  interno?: { anoInternato: string; hospital: string; orientador: string; status: string } | null;
  rotations?: { _id: string; rotationName: string; period: string; grade: number; maxGrade: number; evaluator: string; signedDocument: { url: string } | null }[];
  programas?: { _id: string; tipo: string; title: string; ano: string; document: { url: string } | null }[];
}

const TIPO_LABEL: Record<string, string> = { programa: "Programa de Ensino", mapa_rotacoes: "Mapa de Rotações", comunicado: "Comunicado", outro: "Documento" };

const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900";

export default function AreaMembroPage() {
  const [creds, setCreds] = useState({ numeroUtente: "", biPassaporte: "", phone: "", numeroOrdem: "", code: "" });
  const [ficha, setFicha] = useState<FichaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof creds, v: string) => setCreds((p) => ({ ...p, [k]: v }));

  const access = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/members/access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Dados de acesso inválidos.");
      }
      setFicha(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aceder.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => { setFicha(null); setCreds({ numeroUtente: "", biPassaporte: "", phone: "", numeroOrdem: "", code: "" }); };

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <User className="w-4 h-4" /> Médicos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Área do Médico</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Aceda à sua ficha de membro com o seu número de utente e código de acesso. Pode consultar os seus dados e solicitar alterações.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {!ficha ? (
          <form onSubmit={access} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-angola-gold" />
              <h2 className="font-bold text-gray-900">Acesso à sua ficha</h2>
            </div>
            <p className="text-sm text-gray-500">Introduza todos os dados que recebeu da Ordem após a aprovação da sua inscrição.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Utente</label>
              <input className={`${inputClass} font-mono`} required value={creds.numeroUtente} onChange={(e) => set("numeroUtente", e.target.value.toUpperCase())} placeholder="UT-2026-00000" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">BI / Passaporte</label>
                <input className={inputClass} required value={creds.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto telefónico</label>
                <input className={inputClass} required value={creds.phone} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Ordem</label>
                <input className={inputClass} required value={creds.numeroOrdem} onChange={(e) => set("numeroOrdem", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-angola-gold" /> Código (6 dígitos)</label>
                <input className={`${inputClass} font-mono text-center`} maxLength={6} required value={creds.code} onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))} placeholder="000000" />
              </div>
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />} Aceder à minha ficha
            </button>
            <p className="text-xs text-gray-400 text-center">Ainda não é membro? <a href="/inscricao" className="text-angola-blue hover:underline">Inscreva-se aqui</a>.</p>
          </form>
        ) : (
          <Ficha ficha={ficha} code={creds.code} onLogout={logout} />
        )}
      </div>
    </div>
  );
}

function Ficha({ ficha, code, onLogout }: { ficha: FichaData; code: string; onLogout: () => void }) {
  const [edit, setEdit] = useState({
    name: ficha.name, phone: ficha.phone, email: ficha.email,
    especialidade: ficha.especialidade, provincia: ficha.provincia, residencia: ficha.residencia,
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof edit, v: string) => setEdit((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/members/change-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente: ficha.numeroUtente, code, changes: edit }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Falha ao enviar o pedido.");
      }
      setFeedback({ ok: true, text: "Pedido de alteração enviado. Será analisado e aprovado pela equipa da Ordem." });
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : "Erro." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-angola-navy text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-angola-gold text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"><IdCard className="w-4 h-4" /> Ficha de Membro</p>
            <h2 className="text-2xl font-bold mt-1">{ficha.name}</h2>
            {ficha.especialidade && <p className="text-gray-300">{ficha.especialidade}</p>}
          </div>
          <button type="button" onClick={onLogout} className="text-gray-300 hover:text-white text-sm inline-flex items-center gap-1"><LogOut className="w-4 h-4" /> Sair</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5 text-sm">
          <div><p className="text-gray-400 text-xs">Nº de Utente</p><p className="font-mono font-bold">{ficha.numeroUtente}</p></div>
          <div><p className="text-gray-400 text-xs">Nº de Ordem</p><p className="font-mono font-bold">{ficha.numeroOrdem}</p></div>
          <div><p className="text-gray-400 text-xs">BI / Passaporte</p><p>{ficha.biPassaporte}</p></div>
          <div><p className="text-gray-400 text-xs">Estado</p><p className="capitalize">{ficha.status}</p></div>
        </div>
      </div>

      {(ficha.categorias ?? []).includes("interno") && <InternatoSection numeroUtente={ficha.numeroUtente} code={code} />}

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">Atualizar os meus dados</h3>
        <p className="text-sm text-gray-500 mb-4">As alterações só ficam ativas após aprovação da equipa da Ordem.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome</label><input className={inputClass} value={edit.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input className={inputClass} value={edit.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className={inputClass} value={edit.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label><input className={inputClass} value={edit.especialidade} onChange={(e) => set("especialidade", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Província</label><input className={inputClass} value={edit.provincia} onChange={(e) => set("provincia", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Residência</label><input className={inputClass} value={edit.residencia} onChange={(e) => set("residencia", e.target.value)} /></div>
        </div>
        {feedback && <p className={`text-sm mt-3 flex items-center gap-1.5 ${feedback.ok ? "text-green-600" : "text-red-600"}`}>{feedback.ok && <Check className="w-4 h-4" />}{feedback.text}</p>}
        <button type="button" onClick={submit} disabled={saving} className="mt-4 inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Solicitar alteração
        </button>
      </div>
    </div>
  );
}

function InternatoSection({ numeroUtente, code }: { numeroUtente: string; code: string }) {
  const [data, setData] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/colleges/interno-dossier`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numeroUtente, code }),
        });
        if (res.ok) setData(await res.json());
      } finally { setLoading(false); }
    })();
  }, [numeroUtente, code]);

  if (loading) return <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-angola-gold" /></div>;
  if (!data || !data.isInterno) return null;

  const rotations = data.rotations ?? [];
  const programas = data.programas ?? [];
  const media = rotations.length ? (rotations.reduce((a, r) => a + (r.maxGrade ? (r.grade / r.maxGrade) * 20 : 0), 0) / rotations.length) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-angola-navy" /> O meu Internato</h3>
      {!data.interno ? (
        <p className="text-sm text-gray-500">Ainda não está associado a um colégio de especialidade. Aguarde a associação pela coordenação.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm bg-gray-50 rounded-xl p-4">
            <div><p className="text-gray-400 text-xs">Colégio</p><p className="font-medium text-gray-900">{data.college?.name ?? "—"}</p></div>
            <div><p className="text-gray-400 text-xs">Ano do internato</p><p className="font-medium text-gray-900">{data.interno.anoInternato || "—"}</p></div>
            <div><p className="text-gray-400 text-xs">Hospital / Instituição</p><p className="font-medium text-gray-900">{data.interno.hospital || "—"}</p></div>
            <div><p className="text-gray-400 text-xs">Orientador</p><p className="font-medium text-gray-900">{data.interno.orientador || "—"}</p></div>
          </div>

          {/* Notas finais */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-800 text-sm">Notas das rotações</h4>
              {media !== null && <span className="text-xs text-gray-500">Média global: <strong className="text-angola-navy">{media.toFixed(1)}/20</strong></span>}
            </div>
            {rotations.length === 0 ? (
              <p className="text-sm text-gray-400">Ainda não há notas finais publicadas.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl divide-y">
                {rotations.map((r) => (
                  <div key={r._id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{r.rotationName}</p>
                      <p className="text-xs text-gray-500">{r.period}{r.evaluator ? ` · ${r.evaluator}` : ""}</p>
                    </div>
                    {r.signedDocument && <a href={r.signedDocument.url} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs"><FileText className="w-3.5 h-3.5" /> PDF</a>}
                    <span className={`text-base font-bold ${r.grade >= r.maxGrade * 0.5 ? "text-green-600" : "text-red-600"}`}>{r.grade}<span className="text-xs text-gray-400">/{r.maxGrade}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Programas e documentos */}
          {programas.length > 0 && (
            <div className="mt-5">
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Programas e documentos do colégio</h4>
              <div className="space-y-1.5">
                {programas.map((p) => (
                  <div key={p._id} className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2">
                    <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-gray-800">{p.title} <span className="text-xs text-gray-400">· {TIPO_LABEL[p.tipo] ?? p.tipo}</span></span>
                    {p.document && <a href={p.document.url} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs shrink-0"><FileText className="w-3.5 h-3.5" /> Abrir</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
