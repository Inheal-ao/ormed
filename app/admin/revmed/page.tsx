"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Eye, EyeOff, FlaskConical } from "lucide-react";
import { api } from "@/lib/api";
import { Paginated, ArticleItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function RevMedListPage() {
  const [data, setData] = useState<Paginated<ArticleItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<Paginated<ArticleItem>>("/revmed/admin/all?limit=50", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este artigo?")) return;
    setDeleting(id);
    try {
      await api.delete(`/revmed/${id}`);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="RevMed — Revista Médica"
        description="Artigos e pesquisas científicas publicadas por médicos."
        action={{ label: "Novo artigo", href: "/admin/revmed/novo" }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há artigos.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {data.items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-lg bg-angola-navy/5 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5 text-angola-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500 truncate">{item.authors || "—"}</p>
                <span className={`inline-flex items-center gap-1 text-xs mt-1 ${item.isPublished ? "text-green-600" : "text-gray-400"}`}>
                  {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {item.isPublished ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/revmed/${item._id}`} className="p-2 text-gray-500 hover:text-angola-navy hover:bg-gray-100 rounded-lg" aria-label="Editar">
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
