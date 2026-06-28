"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Download, Paperclip, Upload, Save, CreditCard, FileCheck,
  ChevronDown, ChevronUp, History, Clock, Printer, UserPlus, X, Check, Copy,
  Send, ShieldCheck, Undo2, IdCard, Stamp,
} from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { useAdminAuth } from "@/components/admin/auth-context";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { ServiceStepper } from "@/components/service-stepper";
import { SERVICE_LABEL, STATUS_META, ALL_STATUSES, NAO_VALIDADO_REASONS, HistoryEntry } from "@/lib/service-requests";
import { printTable } from "@/lib/print";
import { provinces } from "@/lib/data";
import { CountrySelect } from "@/components/country-select";

interface ServiceRequest {
  _id: string;
  serviceType: string;
  serviceCode: string;
  requesterName: string;
  ownerName: string;
  institution: string;
  email: string;
  phone: string;
  attachments: Asset[];
  details: string;
  isPaid: boolean;
  status: string;
  statusDetail: string;
  paymentAmount: string;
  paymentInstructions: string;
  paymentProof: Asset | null;
  receipt: Asset | null;
  memberNumeroOrdem?: string;
  credentialsIssued?: boolean;
  history: HistoryEntry[];
  createdAt: string;
}

const PAID_TYPES = ["inscricao", "renovacao-inscricao", "carteira-profissional", "pagar-cotas", "declaracao"];

export function ServiceRequestsConsole({
  scope,
  title,
  description,
}: {
  scope: "validacao" | "ordem";
  title: string;
  description: string;
}) {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const all = await api.get<ServiceRequest[]>("/service-requests/admin/all", true);
      const inScope = all.filter((r) =>
        scope === "validacao" ? r.serviceType === "validacao-documentos" : r.isPaid,
      );
      setItems(inScope);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  const patchItem = (id: string, patch: Partial<ServiceRequest>) =>
    setItems((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const exportCsv = async () => {
    const t = scope === "validacao" ? "?type=validacao-documentos" : "";
    const res = await fetch(`${API_URL}/service-requests/admin/export${t}`, {
      headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = scope === "validacao" ? "validacoes.csv" : "solicitacoes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shown = scope === "ordem" && typeFilter ? items.filter((r) => r.serviceType === typeFilter) : items;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title={title} description={description} />
        <div className="flex gap-2">
          {scope === "ordem" && (
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filtrar tipo" className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">Todos os tipos</option>
              {PAID_TYPES.map((t) => <option key={t} value={t}>{SERVICE_LABEL[t]}</option>)}
            </select>
          )}
          {shown.length > 0 && (
            <button type="button" onClick={() => printTable(
              title, `Total: ${shown.length}`,
              ["Código", "Tipo", "Solicitante", "Proprietário", "Estado", "Data"],
              shown.map((r) => [r.serviceCode, SERVICE_LABEL[r.serviceType] ?? r.serviceType, r.requesterName, r.ownerName, STATUS_META[r.status]?.label ?? r.status, new Date(r.createdAt).toLocaleDateString("pt-PT")]),
            )} className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4" /> Imprimir
            </button>
          )}
          {items.length > 0 && (
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110">
              <Download className="w-4 h-4" /> CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : shown.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Sem processos.</p>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => <RequestCard key={r._id} r={r} onPatch={patchItem} />)}
        </div>
      )}
    </div>
  );
}

function RequestCard({ r, onPatch }: { r: ServiceRequest; onPatch: (id: string, p: Partial<ServiceRequest>) => void }) {
  const [open, setOpen] = useState(false);
  const meta = STATUS_META[r.status] ?? { label: r.status, className: "bg-gray-100 text-gray-600" };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Cabeçalho (sempre visível) */}
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50">
        <div className="min-w-0">
          <p className="font-mono font-bold text-angola-navy">{r.serviceCode}</p>
          <p className="text-xs text-gray-500 truncate">{SERVICE_LABEL[r.serviceType]} · {r.ownerName} · {new Date(r.createdAt).toLocaleDateString("pt-PT")}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs px-2 py-1 rounded-full ${meta.className}`}>{meta.label}</span>
          <span className="inline-flex items-center gap-1 text-xs text-angola-blue font-medium">
            {open ? <>Fechar <ChevronUp className="w-4 h-4" /></> : <>Ver processo <ChevronDown className="w-4 h-4" /></>}
          </span>
        </div>
      </button>

      {open && <RequestDetail r={r} onPatch={onPatch} />}
    </div>
  );
}

function RequestDetail({ r, onPatch }: { r: ServiceRequest; onPatch: (id: string, p: Partial<ServiceRequest>) => void }) {
  const [status, setStatus] = useState(r.status);
  const [statusDetail, setStatusDetail] = useState(r.statusDetail);
  const [amount, setAmount] = useState(r.paymentAmount);
  const [instructions, setInstructions] = useState(r.paymentInstructions);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPay, setSavingPay] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [registar, setRegistar] = useState(false);
  const [sending, setSending] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const { user } = useAdminAuth();
  const canApprovePrint = user?.role === "bastonaria" || user?.role === "super_admin";
  const isInscricao = r.serviceType === "inscricao";

  const sendToBastonaria = async () => {
    setSending(true);
    try {
      const u = await api.patch<ServiceRequest>(`/service-requests/${r._id}/send-to-bastonaria`, {});
      onPatch(r._id, { status: "enviado-bastonaria", history: u.history });
      setStatus("enviado-bastonaria");
    } finally {
      setSending(false);
    }
  };

  const decide = async (decision: "aprovar" | "devolver", note?: string) => {
    setDeciding(true);
    try {
      const u = await api.patch<ServiceRequest>(`/service-requests/${r._id}/bastonaria`, { decision, note });
      onPatch(r._id, { status: u.status, statusDetail: u.statusDetail, history: u.history });
      setStatus(u.status);
    } finally {
      setDeciding(false);
    }
  };

  const saveStatus = async () => {
    setSavingStatus(true);
    try {
      const updated = await api.patch<ServiceRequest>(`/service-requests/${r._id}/status`, { status, statusDetail });
      onPatch(r._id, { status, statusDetail, history: updated.history });
    } finally {
      setSavingStatus(false);
    }
  };

  const savePayment = async () => {
    setSavingPay(true);
    try {
      const updated = await api.patch<ServiceRequest>(`/service-requests/${r._id}/payment`, { paymentAmount: amount, paymentInstructions: instructions });
      onPatch(r._id, { paymentAmount: amount, paymentInstructions: instructions, status: "aguarda-pagamento", history: updated.history });
      setStatus("aguarda-pagamento");
    } finally {
      setSavingPay(false);
    }
  };

  const uploadReceipt = async () => {
    if (!receipt) return;
    setUploadingReceipt(true);
    try {
      const form = new FormData();
      form.append("receipt", receipt);
      const res = await fetch(`${API_URL}/service-requests/${r._id}/receipt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
        body: form,
      });
      const data = await res.json();
      onPatch(r._id, { receipt: data.receipt, status: "recibo-emitido", history: data.history });
      setStatus("recibo-emitido");
      setReceipt(null);
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 space-y-5">
      {/* 1. Gráfico de progresso */}
      <div className="bg-gray-50 rounded-lg p-4">
        <ServiceStepper isPaid={r.isPaid} status={r.status} isInscricao={isInscricao} />
      </div>

      {/* 2. Dados do processo */}
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p><span className="text-gray-400">Solicitante:</span> {r.requesterName}</p>
        <p><span className="text-gray-400">Proprietário:</span> {r.ownerName}</p>
        {r.institution && <p><span className="text-gray-400">Instituição:</span> {r.institution}</p>}
        {r.email && <p><span className="text-gray-400">Email:</span> {r.email}</p>}
        <p><span className="text-gray-400">Telefone:</span> {r.phone}</p>
      </div>

      {/* Dados do formulário (ex.: inscrição) */}
      {r.details && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Dados do formulário</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{r.details}</p>
        </div>
      )}

      {/* Fluxo da inscrição → 1ª carteira (etapas dependentes do estado e do papel) */}
      {isInscricao && (
        <div className="space-y-3">
          {/* Etapa: enviar à Bastonária (após pagamento confirmado) */}
          {["pago", "recibo-emitido"].includes(r.status) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-purple-900 mb-1 flex items-center gap-1.5"><Send className="w-4 h-4" /> Enviar à Bastonária</p>
              <p className="text-xs text-gray-600 mb-2">Pagamento confirmado. Envie o processo à Bastonária para aprovação da impressão da carteira.</p>
              <button type="button" onClick={sendToBastonaria} disabled={sending} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-60">
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar à Bastonária
              </button>
            </div>
          )}

          {/* Etapa: decisão da Bastonária */}
          {r.status === "enviado-bastonaria" && (
            canApprovePrint ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-indigo-900 mb-1 flex items-center gap-1.5"><Stamp className="w-4 h-4" /> Decisão da Bastonária</p>
                <p className="text-xs text-gray-600 mb-2">Aprove para a equipa atribuir o nº de ordem e emitir a carteira, ou devolva o processo.</p>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => decide("aprovar")} disabled={deciding} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                    {deciding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Aprovar para impressão
                  </button>
                  <button type="button" onClick={() => { const note = window.prompt("Motivo da devolução (opcional):") ?? undefined; decide("devolver", note); }} disabled={deciding} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-60">
                    <Undo2 className="w-4 h-4" /> Devolver
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800 flex items-center gap-2">
                <Clock className="w-4 h-4" /> A aguardar a aprovação da Bastonária para a impressão da carteira.
              </div>
            )
          )}

          {/* Etapa: emitir carteira (após aprovação da Bastonária) */}
          {r.status === "aprovado-impressao" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5"><IdCard className="w-4 h-4" /> Atribuir nº de ordem e emitir carteira</p>
              <p className="text-xs text-gray-500 mb-2">Aprovado pela Bastonária. Registe o médico (gera nº de utente e código de acesso) e atribua o nº de ordem para emitir a carteira.</p>
              <button type="button" onClick={() => setRegistar(true)} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <UserPlus className="w-4 h-4" /> Registar médico e emitir carteira
              </button>
            </div>
          )}

          {/* Concluído */}
          {r.status === "concluido" && r.credentialsIssued && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-center gap-2">
              <Check className="w-4 h-4" /> Carteira emitida{r.memberNumeroOrdem ? ` — nº de ordem ${r.memberNumeroOrdem}` : ""}. Credenciais emitidas para entrega ao candidato.
            </div>
          )}
        </div>
      )}
      {registar && (
        <RegistarMedicoModal
          req={r}
          onClose={() => setRegistar(false)}
          onEmitted={(numeroOrdem, history) => {
            onPatch(r._id, { status: "concluido", credentialsIssued: true, memberNumeroOrdem: numeroOrdem, history });
            setStatus("concluido");
          }}
        />
      )}

      {/* 3. Documentos */}
      {r.attachments.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">Documentos submetidos</p>
          <div className="flex flex-wrap gap-2">
            {r.attachments.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Paperclip className="w-3.5 h-3.5" /> Documento {i + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 4. Atualizar estado (botão guardar EM BAIXO, depois dos campos) */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-700">Atualizar estado</p>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Estado" className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white">
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        {status === "nao-validado" && (
          <div className="flex flex-wrap gap-1">
            {NAO_VALIDADO_REASONS.map((reason) => (
              <button key={reason} type="button" onClick={() => setStatusDetail(reason)} className="text-[11px] px-2 py-1 bg-white border border-gray-200 rounded hover:border-angola-gold">
                {reason}
              </button>
            ))}
          </div>
        )}
        <textarea value={statusDetail} onChange={(e) => setStatusDetail(e.target.value)} placeholder="Observação / motivo (visível ao utilizador)" className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg min-h-[60px]" />
        <div className="flex justify-end">
          <button type="button" onClick={saveStatus} disabled={savingStatus} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-angola-navy text-white rounded-lg disabled:opacity-60">
            {savingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar estado
          </button>
        </div>
      </div>

      {/* 5. Pagamento (serviços pagos) */}
      {r.isPaid && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold text-orange-800 flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Pagamento</p>
          <div className="grid sm:grid-cols-[1fr_2fr] gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (ex: 15.000 Kz)" className="text-sm px-3 py-2 border border-gray-200 rounded-lg" />
            <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Coordenadas de pagamento (IBAN, entidade...)" className="text-sm px-3 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={savePayment} disabled={savingPay} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-60">
              {savingPay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Definir pagamento
            </button>
            {r.paymentProof && (
              <a href={r.paymentProof.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-orange-300 rounded-lg hover:bg-orange-100">
                <FileCheck className="w-4 h-4" /> Ver comprovativo
              </a>
            )}
          </div>

          {/* Emitir recibo (no fim do fluxo de pagamento) */}
          <div className="pt-2 border-t border-orange-200">
            <p className="text-xs text-gray-500 mb-1.5">Após confirmar o pagamento, emita o recibo:</p>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-100">
                <Upload className="w-4 h-4" /> {receipt ? receipt.name : "Anexar recibo"}
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
              </label>
              <button type="button" onClick={uploadReceipt} disabled={!receipt || uploadingReceipt} className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">
                {uploadingReceipt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Emitir recibo
              </button>
              {r.receipt && <a href={r.receipt.url} target="_blank" rel="noopener noreferrer" className="text-sm text-green-700 underline">recibo emitido</a>}
            </div>
          </div>
        </div>
      )}

      {/* 6. Histórico */}
      <div>
        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-2"><History className="w-4 h-4" /> Histórico do processo</p>
        <ol className="relative border-l-2 border-gray-200 ml-2 space-y-3">
          {(r.history ?? []).slice().reverse().map((h, i) => (
            <li key={i} className="ml-4">
              <div className="absolute -left-[7px] w-3 h-3 rounded-full bg-angola-gold border-2 border-white" />
              <p className="text-sm text-gray-800">
                <span className="font-medium">{STATUS_META[h.status]?.label ?? h.status}</span>
                {h.action && h.action !== "Estado atualizado" && <span className="text-gray-500"> — {h.action}</span>}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(h.at).toLocaleString("pt-PT")} · por <span className="font-medium text-gray-500">{h.by}</span>
              </p>
            </li>
          ))}
          {(!r.history || r.history.length === 0) && <li className="ml-4 text-sm text-gray-400">Sem registos.</li>}
        </ol>
      </div>
    </div>
  );
}

const mInput = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

function RegistarMedicoModal({ req, onClose, onEmitted }: { req: ServiceRequest; onClose: () => void; onEmitted?: (numeroOrdem: string, history: HistoryEntry[]) => void }) {
  const [f, setF] = useState({
    name: req.requesterName ?? "", numeroOrdem: "", biPassaporte: "", phone: req.phone ?? "",
    email: req.email ?? "", especialidade: "", provincia: "", pais: "Angola",
  });
  const [specialties, setSpecialties] = useState<{ _id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creds, setCreds] = useState<{ numeroUtente: string; accessCode: string } | null>(null);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => { api.get<{ _id: string; name: string }[]>("/specialties").then(setSpecialties).catch(() => {}); }, []);

  const submit = async () => {
    setError(null);
    if (!f.name || !f.numeroOrdem || !f.biPassaporte || !f.phone) { setError("Preencha nome, nº de ordem, BI/passaporte e telefone."); return; }
    setSaving(true);
    try {
      const res = await api.post<{ numeroUtente: string; accessCode: string }>("/members", f, true);
      // Marca a inscrição como concluída (carteira emitida + credenciais emitidas).
      let history: HistoryEntry[] | undefined;
      try {
        const u = await api.patch<ServiceRequest>(`/service-requests/${req._id}/emitida`, { numeroOrdem: f.numeroOrdem });
        history = u.history;
      } catch { /* o médico foi criado; a marcação pode ser repetida pelo estado */ }
      onEmitted?.(f.numeroOrdem, history ?? req.history);
      setCreds({ numeroUtente: res.numeroUtente, accessCode: res.accessCode });
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao registar."); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold text-gray-900">Registar médico (inscrição {req.serviceCode})</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        {creds ? (
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6" /></div>
            <p className="text-sm text-gray-600 mb-3">Carteira emitida. Envie estas credenciais para o email do candidato{req.email ? ` (${req.email})` : ""} — o código não volta a aparecer:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-sm space-y-1 mb-3">
              <p><span className="text-gray-400">Nº Utente:</span> {creds.numeroUtente}</p>
              <p><span className="text-gray-400">Código:</span> {creds.accessCode}</p>
            </div>
            <button type="button" onClick={() => { navigator.clipboard.writeText(`Nº de Utente: ${creds.numeroUtente}\nCódigo: ${creds.accessCode}`); }} className="inline-flex items-center gap-1.5 text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Copy className="w-4 h-4" /> Copiar</button>
            <button type="button" onClick={onClose} className="ml-2 text-sm px-4 py-2 bg-angola-navy text-white rounded-lg">Concluir</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Confirme os dados e atribua o número de ordem.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input className={mInput} placeholder="Nome completo *" value={f.name} onChange={(e) => set("name", e.target.value)} />
              <input className={mInput} placeholder="Nº de Ordem (atribuído) *" value={f.numeroOrdem} onChange={(e) => set("numeroOrdem", e.target.value)} />
              <input className={mInput} placeholder="BI / Passaporte *" value={f.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} />
              <input className={mInput} placeholder="Telefone *" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              <input className={mInput} placeholder="Email" value={f.email} onChange={(e) => set("email", e.target.value)} />
              <select className={mInput} value={f.especialidade} onChange={(e) => set("especialidade", e.target.value)} aria-label="Especialidade">
                <option value="">— Especialidade —</option>
                {specialties.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
              </select>
              <select className={mInput} value={f.provincia} onChange={(e) => set("provincia", e.target.value)} aria-label="Província">
                <option value="">— Província —</option>
                {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <CountrySelect value={f.pais} onChange={(v) => set("pais", v)} className={mInput} />
            </div>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Cancelar</button>
              <button type="button" onClick={submit} disabled={saving} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Registar médico
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
