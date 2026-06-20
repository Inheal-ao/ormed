"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, Trash2, Download, Mail, Phone } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";

interface SupportRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  supportType: string;
  message: string;
  status: "new" | "handled";
  createdAt: string;
}

export default function ApoioPesquisaPage() {
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<SupportRequest[]>("/research-support/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await api.patch(`/research-support/${id}/status`, { status });
    setItems((prev) => prev.map((r) => (r._id === id ? { ...r, status: status as SupportRequest["status"] } : r)));
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este pedido?")) return;
    await api.delete(`/research-support/${id}`);
    setItems((prev) => prev.filter((r) => r._id !== id));
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/research-support/admin/export`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "apoio-pesquisa.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Apoio à Pesquisa Científica" description="Pedidos de apoio submetidos pelo site." />
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
        <p className="text-gray-500 text-center py-16">Ainda não há pedidos.</p>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r._id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{r.email}</span>
                    {r.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{r.phone}</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${r.status === "handled" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {r.status === "handled" ? "Tratado" : "Novo"}
                </span>
              </div>
              <p className="text-sm font-medium text-angola-navy mt-2">Apoio: {r.supportType}</p>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{r.message}</p>
              <div className="flex gap-2 mt-3 pt-3 border-t">
                {r.status !== "handled" && (
                  <button type="button" onClick={() => setStatus(r._id, "handled")} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                    <Check className="w-3.5 h-3.5" />Marcar como tratado
                  </button>
                )}
                <button type="button" onClick={() => remove(r._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" />Eliminar
                </button>
                <span className="ml-auto text-xs text-gray-400 self-center">{new Date(r.createdAt).toLocaleDateString("pt-PT")}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
