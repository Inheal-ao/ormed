"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Check, X, FileText, Download, Paperclip } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { EventRegistration, EventItem } from "@/lib/admin-types";
import { BackLink } from "@/components/admin/admin-ui";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  validated: "Validada",
  rejected: "Rejeitada",
};
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  validated: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function InscricoesPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [items, setItems] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [ev, regs] = await Promise.all([
        api.get<EventItem>(`/events/admin/${id}`, true),
        api.get<EventRegistration[]>(`/event-registrations/admin?eventId=${id}`, true),
      ]);
      setEvent(ev);
      setItems(regs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const setStatus = async (regId: string, status: string) => {
    await api.patch(`/event-registrations/${regId}/status`, { status });
    setItems((prev) =>
      prev.map((r) => (r._id === regId ? { ...r, status: status as EventRegistration["status"] } : r)),
    );
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/event-registrations/admin/export?eventId=${id}`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inscricoes-${event?.slug ?? id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <BackLink href={`/admin/eventos/${id}`} label="Voltar ao evento" />
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inscrições</h1>
          <p className="text-gray-500 text-sm">{event?.title}</p>
          <p className="text-sm text-gray-400 mt-1">
            Total: {items.length}
            {event?.capacity ? ` / ${event.capacity} vagas` : ""}
          </p>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={exportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 shrink-0"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há inscrições.</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.email} {r.phone ? `· ${r.phone}` : ""}</p>
                  {r.notes && <p className="text-sm text-gray-600 mt-1">{r.notes}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${STATUS_STYLE[r.status]}`}>
                  {STATUS_LABEL[r.status]}
                </span>
              </div>

              {/* Anexos */}
              {(r.paymentProof || r.attachments.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {r.paymentProof && (
                    <a href={r.paymentProof.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <FileText className="w-3.5 h-3.5" />Comprovativo
                    </a>
                  )}
                  {r.attachments.map((a, i) => (
                    <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Paperclip className="w-3.5 h-3.5" />Documento {i + 1}
                    </a>
                  ))}
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <button type="button" onClick={() => setStatus(r._id, "validated")} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                  <Check className="w-3.5 h-3.5" />Validar
                </button>
                <button type="button" onClick={() => setStatus(r._id, "rejected")} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <X className="w-3.5 h-3.5" />Rejeitar
                </button>
                <span className="ml-auto text-xs text-gray-400 self-center">
                  {new Date(r.createdAt).toLocaleDateString("pt-PT")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
