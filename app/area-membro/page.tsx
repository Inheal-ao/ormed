"use client";

import { useEffect, useState } from "react";
import { Loader2, KeyRound, ShieldCheck, User, Check, Save, LogOut, IdCard, GraduationCap, FileText, BookOpen, QrCode, Wallet, Receipt, Ticket, Activity, LayoutDashboard, Pill, Menu, X, CreditCard, FileSignature, RefreshCw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { MedicoQr } from "@/components/medico-qr";
import { ReceitasSection } from "@/components/receita-medico";
import { printRecibo, mesLabel, kz } from "@/lib/recibo";
import { provinces } from "@/lib/data";

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
  pais?: string;
  photo?: { url: string } | null;
}

interface Comp { competencia: string; totalMinimo: number; observador: number; ajudante: number; executor: number; totalRealizado: number }
interface Dossier {
  isInterno: boolean;
  college?: { name: string; especialidade: string } | null;
  interno?: { anoInternato: string; hospital: string; orientador: string; status: string } | null;
  rotations?: { _id: string; rotationName: string; periodoInicio: string; periodoFim: string; evaluator: string; competencias: Comp[]; signedDocument: { url: string } | null }[];
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

  if (ficha) return <MemberPortal ficha={ficha} code={creds.code} onLogout={logout} />;

  // ===== Login (ecrã inteiro, sem chrome do site) =====
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/logo.svg" alt="ORMED" className="w-14 h-14 mx-auto mb-3 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">Portal do Médico</h1>
          <p className="text-sm text-gray-500">Ordem dos Médicos de Angola</p>
        </div>
        <form onSubmit={access} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-angola-gold" />
            <h2 className="font-bold text-gray-900">Aceder ao portal</h2>
          </div>
          <p className="text-sm text-gray-500">Introduza os dados que recebeu da Ordem após a aprovação da sua inscrição.</p>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />} Entrar no portal
          </button>
        </form>
        <p className="text-xs text-gray-400 text-center mt-4">
          Ainda não é membro? <a href="/inscricao/" className="text-angola-blue hover:underline">Inscreva-se</a> · <a href="/" className="text-angola-blue hover:underline">Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}

function MemberPortal({ ficha, code, onLogout }: { ficha: FichaData; code: string; onLogout: () => void }) {
  const [section, setSection] = useState("resumo");
  const [mobileNav, setMobileNav] = useState(false);
  const isInterno = (ficha.categorias ?? []).includes("interno");

  const nav = [
    { id: "resumo", label: "Início", icon: LayoutDashboard },
    { id: "cotas", label: "Cotas & Dívidas", icon: Wallet },
    { id: "servicos", label: "Serviços & Dados", icon: FileText },
    ...(isInterno ? [{ id: "internato", label: "Internato & Notas", icon: GraduationCap }] : []),
    { id: "atividade", label: "Atividade & Certificados", icon: Activity },
    { id: "prescricao", label: "Prescrição", icon: Pill },
  ];
  const current = nav.find((n) => n.id === section) ?? nav[0];

  const sidebar = (
    <div className="flex flex-col h-full bg-angola-navy text-white">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10 shrink-0">
        <img src="/images/logo.svg" alt="ORMED" className="w-8 h-8 object-contain" />
        <div className="leading-tight">
          <p className="font-semibold text-sm">ORMED</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.14em]">Portal do Médico</p>
        </div>
        <button type="button" onClick={() => setMobileNav(false)} className="ml-auto md:hidden text-slate-300 hover:text-white" aria-label="Fechar"><X className="w-5 h-5" /></button>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {nav.map((n) => (
          <button key={n.id} type="button" onClick={() => { setSection(n.id); setMobileNav(false); }}
            className={`group relative w-full flex items-center gap-3 pl-3.5 pr-2 py-2 rounded-lg text-[13.5px] transition-colors ${
              section === n.id
                ? "bg-white/[0.07] text-white font-medium before:absolute before:left-0 before:inset-y-1.5 before:w-[3px] before:rounded-r-full before:bg-angola-gold"
                : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"}`}>
            <n.icon className={`w-[18px] h-[18px] shrink-0 ${section === n.id ? "text-angola-gold" : "text-slate-500 group-hover:text-slate-300"}`} />
            <span className="flex-1 text-left truncate">{n.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3 shrink-0">
        {ficha.photo?.url
          ? <img src={ficha.photo.url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
          : <span className="w-9 h-9 rounded-full bg-angola-gold/20 text-angola-gold flex items-center justify-center text-xs font-bold shrink-0">{ficha.name.charAt(0).toUpperCase()}</span>}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-white truncate">{ficha.name}</p>
          <p className="text-[11px] text-slate-400 truncate font-mono">{ficha.numeroOrdem}</p>
        </div>
        <button type="button" onClick={onLogout} className="text-slate-400 hover:text-white shrink-0" aria-label="Terminar sessão"><LogOut className="w-[18px] h-[18px]" /></button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <aside className="hidden md:block w-64 fixed inset-y-0 left-0 z-30">{sidebar}</aside>
      {mobileNav && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[82%] shadow-2xl">{sidebar}</div>
        </div>
      )}
      <div className="md:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/85 backdrop-blur border-b border-gray-200 flex items-center gap-3 px-4 md:px-7">
          <button type="button" onClick={() => setMobileNav(true)} className="md:hidden p-2 -ml-2 text-gray-600" aria-label="Abrir menu"><Menu className="w-5 h-5" /></button>
          <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate">{current.label}</h1>
          <a href="/" className="ml-auto text-xs text-gray-400 hover:text-gray-700">Voltar ao site</a>
        </header>
        <main className="flex-1 p-4 md:p-7 max-w-4xl w-full mx-auto space-y-6">
          {section === "resumo" && <ResumoSection ficha={ficha} />}
          {section === "cotas" && <CotasSection numeroUtente={ficha.numeroUtente} numeroOrdem={ficha.numeroOrdem} name={ficha.name} code={code} />}
          {section === "servicos" && <ServicosSection ficha={ficha} code={code} />}
          {section === "internato" && isInterno && <InternatoSection numeroUtente={ficha.numeroUtente} code={code} />}
          {section === "atividade" && <AtividadeSection numeroUtente={ficha.numeroUtente} code={code} />}
          {section === "prescricao" && <ReceitasSection numeroUtente={ficha.numeroUtente} code={code} medico={{ name: ficha.name, numeroOrdem: ficha.numeroOrdem, especialidade: ficha.especialidade }} />}
        </main>
      </div>
    </div>
  );
}

const SIT_LABEL: Record<string, { label: string; cls: string }> = {
  vigor: { label: "Em Vigor", cls: "bg-green-100 text-green-700" },
  suspensa: { label: "Suspensa", cls: "bg-amber-100 text-amber-700" },
  cancelada: { label: "Cancelada", cls: "bg-red-100 text-red-700" },
};

function ResumoSection({ ficha }: { ficha: FichaData }) {
  const sit = SIT_LABEL[ficha.situacao ?? "vigor"] ?? SIT_LABEL.vigor;
  return (
    <>
      <div className="bg-angola-navy text-white rounded-2xl p-6">
        <div className="flex items-center gap-4">
          {ficha.photo?.url
            ? <img src={ficha.photo.url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-angola-gold/40" />
            : <span className="w-16 h-16 rounded-full bg-angola-gold/20 text-angola-gold flex items-center justify-center text-xl font-bold">{ficha.name.charAt(0).toUpperCase()}</span>}
          <div>
            <p className="text-angola-gold text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5"><IdCard className="w-4 h-4" /> Cartão de Membro</p>
            <h2 className="text-2xl font-bold mt-1">{ficha.name}</h2>
            {ficha.especialidade && <p className="text-gray-300">{ficha.especialidade}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-sm">
          <div><p className="text-gray-400 text-xs">Nº de Utente</p><p className="font-mono font-bold">{ficha.numeroUtente}</p></div>
          <div><p className="text-gray-400 text-xs">Nº de Ordem</p><p className="font-mono font-bold">{ficha.numeroOrdem}</p></div>
          <div><p className="text-gray-400 text-xs">BI / Passaporte</p><p>{ficha.biPassaporte}</p></div>
          <div><p className="text-gray-400 text-xs">Situação</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sit.cls}`}>{sit.label}</span></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><QrCode className="w-5 h-5 text-angola-navy" /> O meu QR de verificação</h3>
        <p className="text-sm text-gray-500 mb-4">Para receitas eletrónicas — ao ser lido, mostra o seu nome, especialidade e situação na Ordem.</p>
        <MedicoQr numeroOrdem={ficha.numeroOrdem} name={ficha.name} especialidade={ficha.especialidade} size={180} />
      </div>
    </>
  );
}

const PORTAL_SERVICES = [
  { href: "/declaracao/", label: "Declaração da Ordem", desc: "Solicitar uma declaração oficial.", icon: FileSignature },
  { href: "/carteira/", label: "Carteira profissional / 2ª via", desc: "Pedir ou tratar a 2ª via da carteira.", icon: CreditCard },
  { href: "/renovacao/", label: "Renovação de inscrição", desc: "Renovar a sua inscrição na Ordem.", icon: RefreshCw },
  { href: "/validacao/", label: "Validação de documentos", desc: "Validar documentos junto da Ordem.", icon: FileText },
];

function ServicosSection({ ficha, code }: { ficha: FichaData; code: string }) {
  const [edit, setEdit] = useState({
    name: ficha.name, phone: ficha.phone, email: ficha.email,
    especialidade: ficha.especialidade, provincia: ficha.provincia, residencia: ficha.residencia,
  });
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof typeof edit, v: string) => setEdit((p) => ({ ...p, [k]: v }));

  useEffect(() => { fetch(`${API_URL}/specialties`).then((r) => r.ok ? r.json() : []).then(setSpecialties).catch(() => {}); }, []);

  const submit = async () => {
    setSaving(true); setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/members/change-request`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente: ficha.numeroUtente, code, changes: edit }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Falha ao enviar o pedido."); }
      setFeedback({ ok: true, text: "Pedido de alteração enviado. Será analisado e aprovado pela equipa da Ordem." });
    } catch (err) { setFeedback({ ok: false, text: err instanceof Error ? err.message : "Erro." }); } finally { setSaving(false); }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">Serviços da Ordem</h3>
        <p className="text-sm text-gray-500 mb-4">Solicite documentos e serviços. Cada pedido recebe um código para consultar o estado.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {PORTAL_SERVICES.map((s) => (
            <Link key={s.href} href={s.href} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3.5 hover:border-angola-gold/50 hover:bg-angola-gold/[0.04] transition-colors">
              <span className="w-10 h-10 rounded-lg bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><s.icon className="w-5 h-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-900">{s.label}</span>
                <span className="block text-xs text-gray-500">{s.desc}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1">Atualizar os meus dados</h3>
        <p className="text-sm text-gray-500 mb-4">As alterações só ficam ativas após aprovação da equipa da Ordem.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome</label><input className={inputClass} value={edit.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input className={inputClass} value={edit.phone} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className={inputClass} value={edit.email} onChange={(e) => set("email", e.target.value)} /></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
            <select className={inputClass} value={edit.especialidade} onChange={(e) => set("especialidade", e.target.value)} aria-label="Especialidade">
              <option value="">— Especialidade —</option>
              {edit.especialidade && !specialties.some((s) => s.name === edit.especialidade) && <option value={edit.especialidade}>{edit.especialidade}</option>}
              {specialties.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
            <select className={inputClass} value={edit.provincia} onChange={(e) => set("provincia", e.target.value)} aria-label="Província">
              <option value="">— Província —</option>
              {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Residência</label><input className={inputClass} value={edit.residencia} onChange={(e) => set("residencia", e.target.value)} /></div>
        </div>
        {feedback && <p className={`text-sm mt-3 flex items-center gap-1.5 ${feedback.ok ? "text-green-600" : "text-red-600"}`}>{feedback.ok && <Check className="w-4 h-4" />}{feedback.text}</p>}
        <button type="button" onClick={submit} disabled={saving} className="mt-4 inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Solicitar alteração
        </button>
      </div>
    </>
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
  const pct = (comps: Comp[]) => {
    const min = (comps ?? []).reduce((a, c) => a + (c.totalMinimo || 0), 0);
    const done = (comps ?? []).reduce((a, c) => a + (c.totalRealizado || 0), 0);
    return min ? Math.round((done / min) * 100) : null;
  };

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

          {/* Mapas de avaliação das rotações (finais/assinados) */}
          <div className="mt-5">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Avaliações das rotações</h4>
            {rotations.length === 0 ? (
              <p className="text-sm text-gray-400">Ainda não há avaliações finais publicadas.</p>
            ) : (
              <div className="border border-gray-200 rounded-xl divide-y">
                {rotations.map((r) => {
                  const p = pct(r.competencias);
                  return (
                    <div key={r._id} className="flex items-center gap-3 px-4 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{r.rotationName}</p>
                        <p className="text-xs text-gray-500">{r.periodoInicio && `${r.periodoInicio} a ${r.periodoFim}`}{r.evaluator ? ` · ${r.evaluator}` : ""} · {(r.competencias ?? []).length} competência(s)</p>
                      </div>
                      {p !== null && <span className="text-xs font-semibold text-angola-navy">{p}% realizado</span>}
                      {r.signedDocument && <a href={r.signedDocument.url} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs"><FileText className="w-3.5 h-3.5" /> Mapa</a>}
                    </div>
                  );
                })}
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

interface CotaStatus { cotaMensal: number; multaMensal: number; mesesEmFalta: string[]; divida: number; emDia: boolean }

function CotasSection({ numeroUtente, numeroOrdem, name, code }: { numeroUtente: string; numeroOrdem: string; name: string; code: string }) {
  const [status, setStatus] = useState<CotaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/quotas/portal/status`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente, code }),
      });
      if (res.ok) setStatus(await res.json());
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [numeroUtente, code]); // eslint-disable-line

  const pay = async () => {
    if (!confirm(`Confirmar o pagamento de ${status?.mesesEmFalta.length} mês(es) — ${kz(status?.divida ?? 0)}?`)) return;
    setPaying(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/quotas/portal/pay`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroUtente, code }),
      });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao pagar."); }
      const data = await res.json() as { recibo: string; payment: { meses: string[]; total: number }; status: CotaStatus };
      printRecibo({ recibo: data.recibo, memberName: name, numeroOrdem, meses: data.payment.meses, cotaMensal: data.status.cotaMensal, multaMensal: data.status.multaMensal, total: data.payment.total });
      setStatus(data.status);
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setPaying(false); }
  };

  if (loading) return <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-angola-gold" /></div>;
  if (!status) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Wallet className="w-5 h-5 text-angola-navy" /> As minhas cotas</h3>
      <p className="text-sm text-gray-500 mb-4">Cota mensal: {kz(status.cotaMensal)}{status.multaMensal ? ` · Multa/mês em atraso: ${kz(status.multaMensal)}` : ""}</p>
      {status.emDia ? (
        <div className="rounded-xl bg-green-50 text-green-700 px-4 py-3 flex items-center gap-2 font-semibold"><Check className="w-5 h-5" /> As suas cotas estão em dia.</div>
      ) : (
        <>
          <div className="rounded-xl bg-amber-50 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <span className="text-sm text-gray-600">Dívida atual ({status.mesesEmFalta.length} mês/es)</span>
            <span className="text-xl font-bold text-amber-700">{kz(status.divida)}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {status.mesesEmFalta.map((m) => <span key={m} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{mesLabel(m)}</span>)}
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <button type="button" onClick={pay} disabled={paying} className="mt-4 inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 disabled:opacity-60">
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />} Pagar e imprimir recibo
          </button>
        </>
      )}
    </div>
  );
}

const SERVICE_LABEL: Record<string, string> = {
  "validacao-documentos": "Validação de documentos",
  "inscricao": "Inscrição",
  "renovacao-inscricao": "Renovação de inscrição",
  "carteira-profissional": "Carteira profissional",
  "pagar-cotas": "Pagamento de cotas",
  "declaracao": "Declaração",
};
const SR_STATUS: Record<string, { label: string; cls: string }> = {
  "recebido": { label: "Recebido", cls: "bg-gray-100 text-gray-600" },
  "em-analise": { label: "Em análise", cls: "bg-blue-100 text-blue-700" },
  "aguarda-pagamento": { label: "Aguarda pagamento", cls: "bg-amber-100 text-amber-700" },
  "recibo-emitido": { label: "Recibo emitido", cls: "bg-green-100 text-green-700" },
  "concluido": { label: "Concluído", cls: "bg-green-100 text-green-700" },
  "validado": { label: "Validado", cls: "bg-green-100 text-green-700" },
  "nao-validado": { label: "Não validado", cls: "bg-red-100 text-red-700" },
  "rejeitado": { label: "Rejeitado", cls: "bg-red-100 text-red-700" },
};
const REG_STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pendente", cls: "bg-amber-100 text-amber-700" },
  validated: { label: "Confirmada", cls: "bg-green-100 text-green-700" },
  rejeitada: { label: "Rejeitada", cls: "bg-red-100 text-red-700" },
  rejected: { label: "Rejeitada", cls: "bg-red-100 text-red-700" },
};

interface Atividade {
  eventos: { evento: string; status: string; comprovativo: string | null; data: string }[];
  servicos: { serviceCode: string; serviceType: string; status: string; recibo: string | null; documento: string | null; data: string }[];
}

function AtividadeSection({ numeroUtente, code }: { numeroUtente: string; code: string }) {
  const [data, setData] = useState<Atividade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/members/atividade`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numeroUtente, code }),
        });
        if (res.ok) setData(await res.json());
      } finally { setLoading(false); }
    })();
  }, [numeroUtente, code]);

  if (loading) return <div className="bg-white border border-gray-200 rounded-2xl p-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-angola-gold" /></div>;
  if (!data) return null;
  const eventos = data.eventos ?? [];
  const servicos = data.servicos ?? [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><Activity className="w-5 h-5 text-angola-navy" /> A minha atividade</h3>
      <p className="text-sm text-gray-500 mb-4">Os seus eventos, inscrições, serviços e documentos emitidos pela Ordem.</p>

      {/* Eventos / inscrições */}
      <div className="mb-5">
        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><Ticket className="w-4 h-4 text-gray-400" /> Eventos e inscrições</h4>
        {eventos.length === 0 ? (
          <p className="text-sm text-gray-400">Sem inscrições em eventos.</p>
        ) : (
          <div className="border border-gray-200 rounded-xl divide-y">
            {eventos.map((e, i) => {
              const st = REG_STATUS[e.status] ?? { label: e.status, cls: "bg-gray-100 text-gray-600" };
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.evento}</p>
                    <p className="text-xs text-gray-500">{e.data ? new Date(e.data).toLocaleDateString("pt-PT") : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                  {e.comprovativo && <a href={e.comprovativo} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs"><FileText className="w-3.5 h-3.5" /> Bilhete</a>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Serviços / documentos */}
      <div>
        <h4 className="font-semibold text-gray-800 text-sm mb-2 flex items-center gap-1.5"><FileText className="w-4 h-4 text-gray-400" /> Serviços e documentos emitidos</h4>
        {servicos.length === 0 ? (
          <p className="text-sm text-gray-400">Sem serviços pedidos.</p>
        ) : (
          <div className="border border-gray-200 rounded-xl divide-y">
            {servicos.map((s, i) => {
              const st = SR_STATUS[s.status] ?? { label: s.status, cls: "bg-gray-100 text-gray-600" };
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{SERVICE_LABEL[s.serviceType] ?? s.serviceType}</p>
                    <p className="text-xs text-gray-500 font-mono">{s.serviceCode}{s.data ? ` · ${new Date(s.data).toLocaleDateString("pt-PT")}` : ""}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                  {s.recibo && <a href={s.recibo} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs"><Receipt className="w-3.5 h-3.5" /> Recibo</a>}
                  {s.documento && <a href={s.documento} target="_blank" rel="noopener noreferrer" className="text-angola-blue hover:underline inline-flex items-center gap-1 text-xs"><FileText className="w-3.5 h-3.5" /> Documento</a>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
