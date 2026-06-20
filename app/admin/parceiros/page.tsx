"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { PartnerItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function ParceirosListPage() {
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<PartnerItem[]>("/partners/admin/all", true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este parceiro?")) return;
    setDeleting(id);
    try {
      await api.delete(`/partners/${id}`);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Parceiros"
        description="Logótipos de parceiros institucionais."
        action={{ label: "Novo parceiro", href: "/admin/parceiros/novo" }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há parceiros.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center text-center">
              <div className="h-20 flex items-center justify-center mb-2">
                {item.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logo.url} alt={item.name} className="max-h-20 max-w-full object-contain" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg" />
                )}
              </div>
              <p className="font-medium text-sm text-gray-900 truncate w-full">{item.name}</p>
              {item.website && (
                <a href={item.website} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate max-w-full">
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.website.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
              <div className="flex items-center gap-1 mt-3 w-full">
                <Link href={`/admin/parceiros/${item._id}`} className="flex-1 text-center text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Pencil className="w-3 h-3 inline mr-1" />Editar
                </Link>
                <button type="button" onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="px-2 py-1.5 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg" aria-label="Eliminar">
                  {deleting === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
