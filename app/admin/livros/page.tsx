"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Eye, EyeOff, BookMarked } from "lucide-react";
import { api } from "@/lib/api";
import { Paginated, BookItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function LivrosListPage() {
  const [data, setData] = useState<Paginated<BookItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<Paginated<BookItem>>("/books/admin/all?limit=50", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este livro?")) return;
    setDeleting(id);
    try {
      await api.delete(`/books/${id}`);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Livros"
        description="Livros e publicações (PDF ou link externo)."
        action={{ label: "Novo livro", href: "/admin/livros/novo" }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há livros.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-[3/4] bg-gray-100 relative">
                {item.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage.url} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <BookMarked className="w-10 h-10" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${item.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.isPublished ? <Eye className="w-3 h-3 inline" /> : <EyeOff className="w-3 h-3 inline" />}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-sm text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.author || "—"}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Link href={`/admin/livros/${item._id}`} className="flex-1 text-center text-xs py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Pencil className="w-3 h-3 inline mr-1" />Editar
                  </Link>
                  <button type="button" onClick={() => handleDelete(item._id)} disabled={deleting === item._id} className="px-2 py-1.5 text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg" aria-label="Eliminar">
                    {deleting === item._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
