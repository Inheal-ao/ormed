"use client";

import { useState } from "react";
import { Loader2, Check, Upload, Send, Search, FileText, Copy, Download, CreditCard, KeyRound } from "lucide-react";
import { API_URL } from "@/lib/api";
import { ServiceType, ServiceTrack, SERVICE_LABEL, STATUS_META } from "@/lib/service-requests";
import { ServiceStepper } from "@/components/service-stepper";

const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-angola-gold outline-none text-gray-900";

export function ServicePortal({
  serviceType,
  title,
  description,
  paid = false,
  intro,
}: {
  serviceType: ServiceType;
  title: string;
  description: string;
  paid?: boolean;
  intro?: string;
}) {
  const [tab, setTab] = useState<"solicitar" | "consultar">("solicitar");

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Serviços
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">{description}</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {intro && <p className="text-gray-600 bg-angola-cream/60 border border-angola-gold/20 rounded-xl p-4 text-sm mb-6">{intro}</p>}

        <div className="flex gap-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button type="button" onClick={() => setTab("solicitar")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === "solicitar" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>
            Nova Solicitação
          </button>
          <button type="button" onClick={() => setTab("consultar")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === "consultar" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>
            Consultar Estado
          </button>
        </div>

        {tab === "solicitar" ? (
          <RequestForm serviceType={serviceType} />
        ) : (
          <ConsultPanel paid={paid} />
        )}
      </div>
    </div>
  );
}

function RequestForm({ serviceType }: { serviceType: ServiceType }) {
  const [requesterName, setRequesterName] = useState("");
  const [institution, setInstitution] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Anexe pelo menos um documento.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("serviceType", serviceType);
      form.append("requesterName", requesterName);
      if (ownerName) form.append("ownerName", ownerName);
      if (institution) form.append("institution", institution);
      if (email) form.append("email", email);
      form.append("phone", phone);
      files.forEach((f) => form.append("attachments", f));
      const res = await fetch(`${API_URL}/service-requests`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao enviar.");
      }
      const data = await res.json();
      setCode(data.serviceCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  if (code) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Solicitação registada!</h2>
        <p className="text-gray-600 mb-4">Guarde o seu <strong>código de serviço</strong>. Vai precisar dele para consultar o estado.</p>
        <div className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-angola-gold rounded-xl px-4 py-3 mb-2">
          <span className="text-2xl font-mono font-bold text-angola-navy tracking-wider">{code}</span>
          <button type="button" onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="p-2 text-gray-400 hover:text-angola-navy" aria-label="Copiar código">
            <Copy className="w-5 h-5" />
          </button>
        </div>
        {copied && <p className="text-xs text-green-600">Código copiado!</p>}
        <p className="text-xs text-gray-400 mt-3">Se perder o código, pode recuperá-lo no separador "Consultar Estado" com o nome do proprietário e o contacto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo do solicitante *</label>
        <input className={inputClass} required value={requesterName} onChange={(e) => setRequesterName(e.target.value)} placeholder="O seu nome" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Instituição (opcional)</label>
        <input className={inputClass} value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Nome da instituição, se aplicável" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do proprietário do documento</label>
        <input className={inputClass} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Deixe vazio se for o próprio solicitante" />
        <p className="text-xs text-gray-400 mt-1">Se for uma instituição, indique o nome da pessoa a quem pertence o documento.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (opcional)</label>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contacto telefónico *</label>
          <input className={inputClass} required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9XX XXX XXX" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documento(s) *</label>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
          <Upload className="w-4 h-4" />
          {files.length > 0 ? `${files.length} ficheiro(s) selecionado(s)` : "Anexar PDF ou imagens (pode anexar vários)"}
          <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
        </label>
      </div>
      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Enviar Solicitação
      </button>
    </form>
  );
}

export function ConsultPanel({ paid }: { paid: boolean }) {
  const [code, setCode] = useState("");
  const [data, setData] = useState<ServiceTrack | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecover, setShowRecover] = useState(false);

  const track = async (theCode?: string) => {
    const c = (theCode ?? code).trim();
    if (!c) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API_URL}/service-requests/track?code=${encodeURIComponent(c)}`);
      if (!res.ok) throw new Error("Código não encontrado. Verifique e tente novamente.");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => { e.preventDefault(); track(); }} className="bg-white border border-gray-200 rounded-2xl p-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Código de serviço</label>
        <div className="flex gap-2">
          <input className={`${inputClass} font-mono uppercase`} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="ORM-VD-2026-XXXXXX" />
          <button type="submit" disabled={loading} className="px-4 rounded-lg bg-angola-navy text-white flex items-center gap-2 shrink-0 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <button type="button" onClick={() => setShowRecover((v) => !v)} className="text-xs text-angola-blue hover:underline mt-3 inline-flex items-center gap-1">
          <KeyRound className="w-3 h-3" /> Perdeu o código? Recuperar
        </button>
      </form>

      {showRecover && <RecoverBox onFound={(c) => { setCode(c); track(c); setShowRecover(false); }} />}

      {data && <TrackResult data={data} paid={paid} onRefresh={() => track(data.serviceCode)} />}
    </div>
  );
}

function RecoverBox({ onFound }: { onFound: (code: string) => void }) {
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ serviceCode: string; serviceType: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recover = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/service-requests/recover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerName, phone }),
      });
      if (!res.ok) throw new Error("Nenhuma solicitação encontrada com esses dados.");
      setResults(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={recover} className="bg-angola-cream/60 border border-angola-gold/30 rounded-2xl p-5 space-y-3">
      <p className="text-sm font-medium text-gray-700">Recuperar código de serviço</p>
      <input className={inputClass} required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Nome do proprietário do documento" />
      <input className={inputClass} required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Contacto telefónico usado" />
      <button type="submit" disabled={loading} className="w-full bg-angola-navy text-white py-2.5 rounded-lg font-medium disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Recuperar"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {results && results.map((r) => (
        <button type="button" key={r.serviceCode} onClick={() => onFound(r.serviceCode)} className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-angola-gold">
          <span className="font-mono font-bold text-angola-navy">{r.serviceCode}</span>
          <span className="text-xs text-gray-500 ml-2">{SERVICE_LABEL[r.serviceType]}</span>
        </button>
      ))}
    </form>
  );
}

function TrackResult({ data, paid, onRefresh }: { data: ServiceTrack; paid: boolean; onRefresh: () => void }) {
  const meta = STATUS_META[data.status] ?? { label: data.status, className: "bg-gray-100 text-gray-600" };
  const [proof, setProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const sendProof = async () => {
    if (!proof) return;
    setUploading(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append("proof", proof);
      const res = await fetch(`${API_URL}/service-requests/payment-proof?code=${encodeURIComponent(data.serviceCode)}`, { method: "POST", body: form });
      if (!res.ok) throw new Error("Falha ao enviar o comprovativo.");
      setMsg("Comprovativo enviado com sucesso!");
      setProof(null);
      onRefresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Erro.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono font-bold text-angola-navy">{data.serviceCode}</p>
          <p className="text-sm text-gray-500">{SERVICE_LABEL[data.serviceType]}</p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium shrink-0 ${meta.className}`}>{meta.label}</span>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <ServiceStepper isPaid={data.isPaid} status={data.status} />
      </div>

      <div className="text-sm text-gray-600">
        <p><span className="text-gray-400">Proprietário:</span> {data.ownerName}</p>
        <p><span className="text-gray-400">Submetido em:</span> {new Date(data.createdAt).toLocaleDateString("pt-PT")}</p>
      </div>

      {data.statusDetail && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
          <span className="font-medium">Observação: </span>{data.statusDetail}
        </div>
      )}

      {/* Pagamento (serviços pagos) */}
      {data.payment && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <p className="font-semibold text-orange-800 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Pagamento</p>
          {data.payment.amount && <p className="text-sm text-gray-800"><span className="text-gray-500">Valor:</span> <strong>{data.payment.amount}</strong></p>}
          <p className="text-sm text-gray-700 whitespace-pre-line">{data.payment.instructions}</p>
          {data.hasPaymentProof && <p className="text-xs text-green-700">✓ Comprovativo já enviado.</p>}

          {data.canSubmitProof && (
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-orange-300 rounded-lg text-sm text-gray-600 hover:border-orange-400 cursor-pointer bg-white">
                <Upload className="w-4 h-4" />
                {proof ? proof.name : "Anexar comprovativo (PDF ou imagem)"}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setProof(e.target.files?.[0] ?? null)} />
              </label>
              <button type="button" onClick={sendProof} disabled={!proof || uploading} className="w-full bg-angola-navy text-white py-2.5 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Enviar comprovativo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recibo */}
      {data.receiptUrl && (
        <a href={data.receiptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:brightness-110">
          <Download className="w-4 h-4" /> Descarregar recibo
        </a>
      )}

      {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}
    </div>
  );
}
