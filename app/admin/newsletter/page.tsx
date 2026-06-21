"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Download, Mail } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";

interface Subscriber {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<Subscriber[]>("/newsletter/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Remover este subscritor?")) return;
    await api.delete(`/newsletter/${id}`);
    setItems((prev) => prev.filter((s) => s._id !== id));
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${API_URL}/newsletter/admin/export`, {
        headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newsletter.csv";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Newsletter" description="Subscritores da newsletter." />
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
        <p className="text-gray-500 text-center py-16">Ainda não há subscritores.</p>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-3">{items.length} subscritor(es)</p>
          <div className="bg-white rounded-xl border border-gray-200 divide-y">
            {items.map((s) => (
              <div key={s._id} className="flex items-center gap-3 px-4 py-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 truncate">{s.email}</p>
                  {s.name && <p className="text-xs text-gray-400">{s.name}</p>}
                </div>
                <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString("pt-PT")}</span>
                <button type="button" onClick={() => remove(s._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
