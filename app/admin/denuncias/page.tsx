"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Download, Paperclip, Link2, Lock, Mail, Phone } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { Asset } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

interface Complaint {
  _id: string;
  category: string;
  subject: string;
  description: string;
  isAnonymous: boolean;
  name: string;
  email: string;
  phone: string;
  attachments: Asset[];
  externalLink: string;
  status: "new" | "reviewing" | "resolved";
  createdAt: string;
}

const CAT_LABEL: Record<string, string> = {
  medico: "Médico", ordem: "Ordem", atraso: "Atraso/Reclamação", outro: "Outro",
};
const STATUS_LABEL: Record<string, string> = { new: "Nova", reviewing: "Em análise", resolved: "Resolvida" };
const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  reviewing: "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function DenunciasAdminPage() {
  const [items, setItems] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<Complaint[]>("/complaints/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await api.patch(`/complaints/${id}/status`, { status });
    setItems((prev) => prev.map((r) => (r._id === id ? { ...r, status: status as Complaint["status"] } : r)));
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta denúncia?")) return;
    await api.delete(`/complaints/${id}`);
    setItems((prev) => prev.filter((r) => r._id !== id));
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/complaints/admin/export`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "denuncias-reclamacoes.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Denúncias e Reclamações" description="Submissões recebidas pelo site." />
        {items.length > 0 && (
          <button type="button" onClick={exportCsv} disabled={exporting} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 shrink-0">
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Exportar CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há denúncias ou reclamações.</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold bg-angola-navy/5 text-angola-navy px-2 py-0.5 rounded-full">{CAT_LABEL[r.category] ?? r.category}</span>
                    {r.isAnonymous && <span className="text-xs flex items-center gap-1 text-gray-500"><Lock className="w-3 h-3" />Anónima</span>}
                  </div>
                  <p className="font-semibold text-gray-900 mt-1">{r.subject}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </div>

              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{r.description}</p>

              {!r.isAnonymous && (r.name || r.email || r.phone) && (
                <div className="flex flex-wrap gap-x-4 text-xs text-gray-500 mb-2">
                  {r.name && <span>{r.name}</span>}
                  {r.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>}
                  {r.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span>}
                </div>
              )}

              {(r.attachments.length > 0 || r.externalLink) && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {r.attachments.map((a, i) => (
                    <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Paperclip className="w-3.5 h-3.5" />Prova {i + 1}
                    </a>
                  ))}
                  {r.externalLink && (
                    <a href={r.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <Link2 className="w-3.5 h-3.5" />Link
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-3 border-t items-center">
                <select value={r.status} onChange={(e) => setStatus(r._id, e.target.value)} aria-label="Estado" className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg text-gray-700">
                  <option value="new">Nova</option>
                  <option value="reviewing">Em análise</option>
                  <option value="resolved">Resolvida</option>
                </select>
                <button type="button" onClick={() => remove(r._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" />Eliminar
                </button>
                <span className="ml-auto text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("pt-PT")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
