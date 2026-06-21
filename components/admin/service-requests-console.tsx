"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Download, Paperclip, Upload, Save, CreditCard, FileCheck,
  ChevronDown, ChevronUp, History, Clock,
} from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { ServiceStepper } from "@/components/service-stepper";
import { SERVICE_LABEL, STATUS_META, ALL_STATUSES, NAO_VALIDADO_REASONS, HistoryEntry } from "@/lib/service-requests";

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
  isPaid: boolean;
  status: string;
  statusDetail: string;
  paymentAmount: string;
  paymentInstructions: string;
  paymentProof: Asset | null;
  receipt: Asset | null;
  history: HistoryEntry[];
  createdAt: string;
}

const PAID_TYPES = ["renovacao-inscricao", "carteira-profissional", "pagar-cotas", "declaracao"];

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
        <ServiceStepper isPaid={r.isPaid} status={r.status} />
      </div>

      {/* 2. Dados do processo */}
      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p><span className="text-gray-400">Solicitante:</span> {r.requesterName}</p>
        <p><span className="text-gray-400">Proprietário:</span> {r.ownerName}</p>
        {r.institution && <p><span className="text-gray-400">Instituição:</span> {r.institution}</p>}
        {r.email && <p><span className="text-gray-400">Email:</span> {r.email}</p>}
        <p><span className="text-gray-400">Telefone:</span> {r.phone}</p>
      </div>

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
