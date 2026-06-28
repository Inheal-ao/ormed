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
  const [mode, setMode] = useState<"email" | "legacy" | "recover">("email");
  const [creds, setCreds] = useState({ numeroUtente: "", biPassaporte: "", phone: "", numeroOrdem: "", code: "" });
  const [loginF, setLoginF] = useState({ email: "", password: "", code: "" });
  const [recoverF, setRecoverF] = useState({ email: "", code: "", password: "", password2: "" });
  const [ficha, setFicha] = useState<FichaData | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const set = (k: keyof typeof creds, v: string) => setCreds((p) => ({ ...p, [k]: v }));

  // Login legado (5 credenciais)
  const access = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/members/access`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creds) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Dados de acesso inválidos."); }
      setFicha(await res.json()); setCode(creds.code);
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao aceder."); } finally { setLoading(false); }
  };

  // Login novo (email + senha + código)
  const emailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/members/portal/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(loginF) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Credenciais inválidas."); }
      setFicha(await res.json()); setCode(loginF.code);
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao aceder."); } finally { setLoading(false); }
  };

  // Recuperar senha (email + código → nova senha)
  const doRecover = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setOkMsg(null);
    if (recoverF.password !== recoverF.password2) { setError("As senhas não coincidem."); return; }
    if (recoverF.password.length < 8) { setError("A senha deve ter no mínimo 8 caracteres."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/members/portal/recover`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: recoverF.email, code: recoverF.code, password: recoverF.password }) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "Não foi possível recuperar."); }
      setOkMsg("Senha redefinida. Já pode entrar com a nova senha."); setMode("email");
      setLoginF({ email: recoverF.email, password: "", code: "" });
    } catch (err) { setError(err instanceof Error ? err.message : "Erro."); } finally { setLoading(false); }
  };

  const logout = () => { setFicha(null); setCode(""); setCreds({ numeroUtente: "", biPassaporte: "", phone: "", numeroOrdem: "", code: "" }); setLoginF({ email: "", password: "", code: "" }); };

  if (ficha) return <MemberPortal ficha={ficha} code={code} onLogout={logout} />;

  // ===== Login (ecrã inteiro, sem chrome do site) =====
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/images/logo.svg" alt="ORMED" className="w-14 h-14 mx-auto mb-3 object-contain" />
          <h1 className="text-xl font-bold text-gray-900">Portal do Médico</h1>
          <p className="text-sm text-gray-500">Ordem dos Médicos de Angola</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7 shadow-sm">
          {okMsg && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-1.5"><Check className="w-4 h-4" /> {okMsg}</div>}

          {mode === "recover" ? (
            <form onSubmit={doRecover} className="space-y-4">
              <h2 className="font-bold text-gray-900">Recuperar senha</h2>
              <p className="text-sm text-gray-500">Introduza o seu email e um dos seus códigos de recuperação de 6 dígitos.</p>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className={inputClass} required value={recoverF.email} onChange={(e) => setRecoverF((p) => ({ ...p, email: e.target.value }))} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Código de recuperação</label><input className={`${inputClass} font-mono text-center`} maxLength={6} required value={recoverF.code} onChange={(e) => setRecoverF((p) => ({ ...p, code: e.target.value.replace(/\D/g, "") }))} placeholder="000000" /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label><input type="password" className={inputClass} required value={recoverF.password} onChange={(e) => setRecoverF((p) => ({ ...p, password: e.target.value }))} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label><input type="password" className={inputClass} required value={recoverF.password2} onChange={(e) => setRecoverF((p) => ({ ...p, password2: e.target.value }))} /></div>
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Redefinir senha
              </button>
              <button type="button" onClick={() => { setMode("email"); setError(null); }} className="w-full text-sm text-gray-500 hover:underline">Voltar ao login</button>
            </form>
          ) : (
            <>
              <div className="flex gap-1 mb-5 bg-gray-100 rounded-lg p-1">
                <button type="button" onClick={() => { setMode("email"); setError(null); }} className={`flex-1 text-sm font-medium py-2 rounded-md ${mode === "email" ? "bg-white shadow-sm text-angola-navy" : "text-gray-500"}`}>Email + Senha</button>
                <button type="button" onClick={() => { setMode("legacy"); setError(null); }} className={`flex-1 text-sm font-medium py-2 rounded-md ${mode === "legacy" ? "bg-white shadow-sm text-angola-navy" : "text-gray-500"}`}>Primeiro acesso</button>
              </div>

              {mode === "email" ? (
                <form onSubmit={emailLogin} className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" className={inputClass} required value={loginF.email} onChange={(e) => setLoginF((p) => ({ ...p, email: e.target.value }))} placeholder="medico@exemplo.ao" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Senha</label><input type="password" className={inputClass} required value={loginF.password} onChange={(e) => setLoginF((p) => ({ ...p, password: e.target.value }))} /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-angola-gold" /> Código de 6 dígitos</label><input className={`${inputClass} font-mono text-center`} maxLength={6} required value={loginF.code} onChange={(e) => setLoginF((p) => ({ ...p, code: e.target.value.replace(/\D/g, "") }))} placeholder="000000" /></div>
                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />} Entrar
                  </button>
                  <button type="button" onClick={() => { setMode("recover"); setError(null); }} className="w-full text-sm text-angola-blue hover:underline">Esqueci a senha</button>
                </form>
              ) : (
                <form onSubmit={access} className="space-y-4">
                  <p className="text-sm text-gray-500">Primeiro acesso ou sem senha definida: use os dados que recebeu da Ordem. Depois, defina senha e gere os seus códigos em <strong>Segurança</strong>.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Utente</label>
                    <input className={`${inputClass} font-mono`} required value={creds.numeroUtente} onChange={(e) => set("numeroUtente", e.target.value.toUpperCase())} placeholder="UT-2026-00000" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">BI / Passaporte</label><input className={inputClass} required value={creds.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label><input className={inputClass} required value={creds.phone} onChange={(e) => set("phone", e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Número de Ordem</label><input className={inputClass} required value={creds.numeroOrdem} onChange={(e) => set("numeroOrdem", e.target.value)} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5"><KeyRound className="w-4 h-4 text-angola-gold" /> Código</label><input className={`${inputClass} font-mono text-center`} maxLength={6} required value={creds.code} onChange={(e) => set("code", e.target.value.replace(/\D/g, ""))} placeholder="000000" /></div>
                  </div>
                  {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />} Entrar
                  </button>
                </form>
              )}
            </>
          )}
        </div>

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
    { id: "seguranca", label: "Segurança", icon: ShieldCheck },
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
          {section === "seguranca" && <SegurancaSection ficha={ficha} code={code} />}
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
  { serviceType: "declaracao", label: "Declaração da Ordem", desc: "Solicitar uma declaração oficial.", icon: FileSignature },
  { serviceType: "carteira-profissional", label: "Carteira profissional (2ª via)", desc: "Pedir a 2ª via da carteira.", icon: CreditCard },
  { serviceType: "renovacao-inscricao", label: "Renovação de inscrição", desc: "Renovar a sua inscrição na Ordem.", icon: RefreshCw },
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

  // Submissão de pedidos de documentos (declaração, 2ª via carteira, renovação)
  const [submittingReq, setSubmittingReq] = useState<string | null>(null);
  const [reqError, setReqError] = useState<string | null>(null);
  const [reqResult, setReqResult] = useState<{ serviceType: string; serviceCode: string } | null>(null);

  const requestService = async (serviceType: string) => {
    setSubmittingReq(serviceType); setReqError(null);
    try {
      if (!ficha.phone) throw new Error("Atualize o seu telefone antes de submeter o pedido.");
      const form = new FormData();
      form.append("serviceType", serviceType);
      form.append("requesterName", ficha.name);
      form.append("ownerName", ficha.name);
      if (ficha.email) form.append("email", ficha.email);
      form.append("phone", ficha.phone);
      form.append("details", `Pedido submetido na Área do Membro · Nº Utente ${ficha.numeroUtente} · Nº Ordem ${ficha.numeroOrdem}`);
      const res = await fetch(`${API_URL}/service-requests`, { method: "POST", body: form });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao submeter o pedido."); }
      const data = await res.json() as { serviceCode: string };
      setReqResult({ serviceType, serviceCode: data.serviceCode });
    } catch (err) { setReqError(err instanceof Error ? err.message : "Erro."); } finally { setSubmittingReq(null); }
  };

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
        <h3 className="font-bold text-gray-900 mb-1">Solicitar documentos</h3>
        <p className="text-sm text-gray-500 mb-4">Submeta o pedido aqui. Recebe um código para acompanhar o estado e, quando aprovado, as informações de pagamento.</p>

        {reqResult ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-emerald-900 flex items-center gap-1.5"><Check className="w-4 h-4" /> Pedido submetido</p>
            <p className="text-sm text-gray-700 mt-1">Guarde o seu código de acompanhamento:</p>
            <p className="font-mono font-bold text-angola-navy text-lg my-2">{reqResult.serviceCode}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigator.clipboard.writeText(reqResult.serviceCode)} className="text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Copiar código</button>
              <Link href={`/consultar/?code=${reqResult.serviceCode}`} className="text-sm px-3 py-2 bg-angola-navy text-white rounded-lg">Consultar estado</Link>
              <button type="button" onClick={() => setReqResult(null)} className="text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Fazer outro pedido</button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-3">
              {PORTAL_SERVICES.map((s) => (
                <div key={s.serviceType} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3.5">
                  <span className="w-10 h-10 rounded-lg bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><s.icon className="w-5 h-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-gray-900">{s.label}</span>
                    <span className="block text-xs text-gray-500">{s.desc}</span>
                  </span>
                  <button type="button" onClick={() => requestService(s.serviceType)} disabled={!!submittingReq} className="text-sm px-3 py-1.5 bg-angola-gold text-angola-navy font-semibold rounded-lg hover:brightness-95 disabled:opacity-60 shrink-0 inline-flex items-center gap-1.5">
                    {submittingReq === s.serviceType ? <Loader2 className="w-4 h-4 animate-spin" /> : "Solicitar"}
                  </button>
                </div>
              ))}
            </div>
            {reqError && <p className="text-sm text-red-600 mt-3">{reqError}</p>}
          </>
        )}
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

function SegurancaSection({ ficha, code }: { ficha: FichaData; code: string }) {
  const [pw, setPw] = useState({ password: "", password2: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genErr, setGenErr] = useState<string | null>(null);

  const savePassword = async () => {
    setPwMsg(null);
    if (pw.password !== pw.password2) { setPwMsg({ ok: false, text: "As senhas não coincidem." }); return; }
    if (pw.password.length < 8) { setPwMsg({ ok: false, text: "A senha deve ter no mínimo 8 caracteres." }); return; }
    setSavingPw(true);
    try {
      const res = await fetch(`${API_URL}/members/portal/set-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ numeroUtente: ficha.numeroUtente, code, password: pw.password }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao definir a senha."); }
      setPwMsg({ ok: true, text: "Senha definida. Passe a entrar com Email + Senha + Código." }); setPw({ password: "", password2: "" });
    } catch (err) { setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Erro." }); } finally { setSavingPw(false); }
  };

  const generate = async () => {
    if (!confirm("Gerar um novo conjunto de códigos? Os códigos anteriores deixam de funcionar e poderá ter de entrar novamente.")) return;
    setGenLoading(true); setGenErr(null);
    try {
      const res = await fetch(`${API_URL}/members/portal/recovery-codes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ numeroUtente: ficha.numeroUtente, code }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Falha ao gerar."); }
      const data = await res.json() as { codes: string[] };
      setCodes(data.codes);
    } catch (err) { setGenErr(err instanceof Error ? err.message : "Erro."); } finally { setGenLoading(false); }
  };

  const download = () => {
    if (!codes) return;
    const txt = `ORDEM DOS MÉDICOS DE ANGOLA — Códigos de acesso\n\nMédico: ${ficha.name}\nNº de Utente: ${ficha.numeroUtente}\nNº de Ordem: ${ficha.numeroOrdem}\n\n${codes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\nGuarde estes códigos em local seguro. Cada código serve para ENTRAR (com email + senha) e para RECUPERAR a senha.\nSe os perder, terá de solicitar à Ordem.`;
    const url = URL.createObjectURL(new Blob([txt], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `ormed-codigos-${ficha.numeroUtente}.txt`; a.click(); URL.revokeObjectURL(url);
  };
  const printCodes = () => {
    if (!codes) return;
    const w = window.open("", "_blank", "width=520,height=640"); if (!w) return;
    const logo = `${window.location.origin}/images/logo.svg`;
    w.document.write(`<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Códigos ORMED</title>
    <style>body{font-family:Arial,sans-serif;color:#111;margin:28px}.head{display:flex;gap:10px;align-items:center;border-bottom:2px solid #FFD700;padding-bottom:8px}.head img{height:46px}.org{font-size:12px;color:#002147;font-weight:bold}
    h1{font-size:16px;margin:14px 0 2px}.meta{font-size:12px;color:#555}ol{font-family:monospace;font-size:16px;line-height:1.9;margin-top:14px}.warn{font-size:11px;color:#888;margin-top:18px}</style></head><body>
    <div class="head"><img src="${logo}" onerror="this.style.display='none'"/><span class="org">ORDEM DOS MÉDICOS DE ANGOLA</span></div>
    <h1>Códigos de acesso ao Portal do Médico</h1>
    <p class="meta">${ficha.name} · Nº de Utente: ${ficha.numeroUtente}</p>
    <ol>${codes.map((c) => `<li>${c}</li>`).join("")}</ol>
    <p class="warn">Guarde em local seguro. Cada código serve para entrar (com email + senha) e para recuperar a senha. Se os perder, solicite à Ordem.</p>
    <script>window.onload=function(){setTimeout(function(){window.print()},400)}</script></body></html>`);
    w.document.close();
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><KeyRound className="w-5 h-5 text-angola-navy" /> Senha de acesso</h3>
        <p className="text-sm text-gray-500 mb-4">Defina ou altere a sua senha. O login passa a ser <strong>Email + Senha + um código de 6 dígitos</strong>.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label><input type="password" className={inputClass} value={pw.password} onChange={(e) => setPw((p) => ({ ...p, password: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label><input type="password" className={inputClass} value={pw.password2} onChange={(e) => setPw((p) => ({ ...p, password2: e.target.value }))} /></div>
        </div>
        <p className="text-[11px] text-gray-400 mt-1.5">Mín. 8 caracteres. O seu email ({ficha.email || "—"}) é o utilizador do login.</p>
        {pwMsg && <p className={`text-sm mt-3 flex items-center gap-1.5 ${pwMsg.ok ? "text-green-600" : "text-red-600"}`}>{pwMsg.ok && <Check className="w-4 h-4" />}{pwMsg.text}</p>}
        <button type="button" onClick={savePassword} disabled={savingPw} className="mt-4 inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
          {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar senha
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-angola-navy" /> Códigos de acesso</h3>
        <p className="text-sm text-gray-500 mb-4">Gere o seu conjunto de códigos de 6 dígitos. <strong>Baixe ou imprima</strong> — vai precisar de um para entrar e para recuperar a senha. Se os perder, só a Ordem os pode regenerar.</p>
        {codes ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-800 mb-2">⚠️ Guarde estes códigos agora — <strong>não voltam a ser mostrados</strong>.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
              {codes.map((c) => <span key={c} className="bg-white border border-gray-200 rounded-lg py-2 text-sm tracking-wider">{c}</span>)}
            </div>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={download} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><FileText className="w-4 h-4" /> Baixar</button>
              <button type="button" onClick={printCodes} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 bg-angola-navy text-white rounded-lg"><Receipt className="w-4 h-4" /> Imprimir</button>
            </div>
          </div>
        ) : (
          <>
            {genErr && <p className="text-sm text-red-600 mb-3">{genErr}</p>}
            <button type="button" onClick={generate} disabled={genLoading} className="inline-flex items-center gap-2 bg-angola-gold text-angola-navy font-semibold px-5 py-2.5 rounded-lg hover:brightness-95 disabled:opacity-60">
              {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Gerar novos códigos
            </button>
          </>
        )}
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
