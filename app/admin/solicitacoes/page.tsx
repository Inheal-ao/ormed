"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Download, Paperclip, Upload, Save, CreditCard, FileCheck } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { SERVICE_LABEL, STATUS_META, ALL_STATUSES, NAO_VALIDADO_REASONS } from "@/lib/service-requests";

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
  createdAt: string;
}

const TYPES = ["", "validacao-documentos", "renovacao-inscricao", "carteira-profissional", "pagar-cotas", "declaracao"];

export default function SolicitacoesAdminPage() {
  const [items, setItems] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const q = typeFilter ? `?type=${typeFilter}` : "";
      setItems(await api.get<ServiceRequest[]>(`/service-requests/admin/all${q}`, true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, [typeFilter]);

  const patchItem = (id: string, patch: Partial<ServiceRequest>) =>
    setItems((prev) => prev.map((r) => (r._id === id ? { ...r, ...patch } : r)));

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta solicitação?")) return;
    await api.delete(`/service-requests/${id}`);
    setItems((prev) => prev.filter((r) => r._id !== id));
  };

  const exportCsv = async () => {
    const q = typeFilter ? `?type=${typeFilter}` : "";
    const res = await fetch(`${API_URL}/service-requests/admin/export${q}`, {
      headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "solicitacoes.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeader title="Solicitações de Serviço" description="Validações, renovações, carteiras, cotas e declarações." />
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Filtrar tipo" className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="">Todos os tipos</option>
            {TYPES.filter(Boolean).map((t) => <option key={t} value={t}>{SERVICE_LABEL[t]}</option>)}
          </select>
          {items.length > 0 && (
            <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110">
              <Download className="w-4 h-4" /> CSV
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Sem solicitações.</p>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <RequestCard key={r._id} r={r} onPatch={patchItem} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({ r, onPatch, onRemove }: { r: ServiceRequest; onPatch: (id: string, p: Partial<ServiceRequest>) => void; onRemove: (id: string) => void }) {
  const [status, setStatus] = useState(r.status);
  const [statusDetail, setStatusDetail] = useState(r.statusDetail);
  const [amount, setAmount] = useState(r.paymentAmount);
  const [instructions, setInstructions] = useState(r.paymentInstructions);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPay, setSavingPay] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const meta = STATUS_META[r.status] ?? { label: r.status, className: "bg-gray-100 text-gray-600" };

  const saveStatus = async () => {
    setSavingStatus(true);
    try {
      await api.patch(`/service-requests/${r._id}/status`, { status, statusDetail });
      onPatch(r._id, { status, statusDetail });
    } finally {
      setSavingStatus(false);
    }
  };

  const savePayment = async () => {
    setSavingPay(true);
    try {
      await api.patch(`/service-requests/${r._id}/payment`, { paymentAmount: amount, paymentInstructions: instructions });
      onPatch(r._id, { paymentAmount: amount, paymentInstructions: instructions, status: "aguarda-pagamento" });
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
      onPatch(r._id, { receipt: data.receipt, status: "recibo-emitido" });
      setStatus("recibo-emitido");
      setReceipt(null);
    } finally {
      setUploadingReceipt(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="font-mono font-bold text-angola-navy">{r.serviceCode}</p>
          <p className="text-xs text-gray-500">{SERVICE_LABEL[r.serviceType]} · {new Date(r.createdAt).toLocaleDateString("pt-PT")}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${meta.className}`}>{meta.label}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p><span className="text-gray-400">Solicitante:</span> {r.requesterName}</p>
        <p><span className="text-gray-400">Proprietário:</span> {r.ownerName}</p>
        {r.institution && <p><span className="text-gray-400">Instituição:</span> {r.institution}</p>}
        {r.email && <p><span className="text-gray-400">Email:</span> {r.email}</p>}
        <p><span className="text-gray-400">Telefone:</span> {r.phone}</p>
      </div>

      {/* Documentos */}
      {r.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {r.attachments.map((a, i) => (
            <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Paperclip className="w-3.5 h-3.5" /> Documento {i + 1}
            </a>
          ))}
        </div>
      )}

      {/* Estado */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Estado" className="text-sm px-2 py-1.5 border border-gray-200 rounded-lg bg-white">
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
          </select>
          <button type="button" onClick={saveStatus} disabled={savingStatus} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-angola-navy text-white rounded-lg disabled:opacity-60">
            {savingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Guardar estado
          </button>
        </div>
        {status === "nao-validado" && (
          <div className="flex flex-wrap gap-1">
            {NAO_VALIDADO_REASONS.map((reason) => (
              <button key={reason} type="button" onClick={() => setStatusDetail(reason)} className="text-[11px] px-2 py-1 bg-white border border-gray-200 rounded hover:border-angola-gold">
                {reason}
              </button>
            ))}
          </div>
        )}
        <input value={statusDetail} onChange={(e) => setStatusDetail(e.target.value)} placeholder="Observação / motivo (visível ao utilizador)" className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-lg" />
      </div>

      {/* Pagamento (serviços pagos) */}
      {r.isPaid && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
          <p className="text-sm font-semibold text-orange-800 flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Pagamento</p>
          <div className="grid sm:grid-cols-[1fr_2fr] gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (ex: 15.000 Kz)" className="text-sm px-2 py-1.5 border border-gray-200 rounded-lg" />
            <input value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Coordenadas de pagamento (IBAN, entidade...)" className="text-sm px-2 py-1.5 border border-gray-200 rounded-lg" />
          </div>
          <button type="button" onClick={savePayment} disabled={savingPay} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-orange-600 text-white rounded-lg disabled:opacity-60">
            {savingPay ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Definir pagamento
          </button>

          {r.paymentProof && (
            <a href={r.paymentProof.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-orange-300 rounded-lg hover:bg-orange-100 ml-0 sm:ml-2">
              <FileCheck className="w-3.5 h-3.5" /> Ver comprovativo
            </a>
          )}

          <div className="flex flex-wrap gap-2 items-center pt-1">
            <label className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-dashed border-orange-300 rounded-lg cursor-pointer hover:bg-orange-100">
              <Upload className="w-3.5 h-3.5" /> {receipt ? receipt.name : "Anexar recibo"}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
            </label>
            <button type="button" onClick={uploadReceipt} disabled={!receipt || uploadingReceipt} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg disabled:opacity-50">
              {uploadingReceipt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Emitir recibo
            </button>
            {r.receipt && <a href={r.receipt.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 underline">recibo emitido</a>}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-1 border-t">
        <button type="button" onClick={() => onRemove(r._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
          <Trash2 className="w-3.5 h-3.5" /> Eliminar
        </button>
      </div>
    </div>
  );
}
