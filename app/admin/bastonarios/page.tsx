"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Star } from "lucide-react";
import { api } from "@/lib/api";
import { BastonarioItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function BastonariosListPage() {
  const [items, setItems] = useState<BastonarioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<BastonarioItem[]>("/bastonarios/admin/all", true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este bastonário?")) return;
    setDeleting(id);
    try {
      await api.delete(`/bastonarios/${id}`);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Bastonários"
        description="Bastonário atual e antigos presidentes da Ordem."
        action={{ label: "Novo bastonário", href: "/admin/bastonarios/novo" }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há bastonários.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4">
              {item.photo?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.photo.url} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate flex items-center gap-2">
                  {item.name}
                  {item.isCurrent && <Star className="w-3.5 h-3.5 text-angola-gold fill-angola-gold" />}
                </p>
                <p className="text-sm text-gray-500">{item.mandate}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/bastonarios/${item._id}`} className="p-2 text-gray-500 hover:text-angola-navy hover:bg-gray-100 rounded-lg" aria-label="Editar">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button type="button" onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Eliminar">
                  {deleting === item._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
