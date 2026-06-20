"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Loader2, Eye, EyeOff, GraduationCap } from "lucide-react";
import { api } from "@/lib/api";
import { Paginated, CourseItem } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";

export default function CursosListPage() {
  const [data, setData] = useState<Paginated<CourseItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setData(await api.get<Paginated<CourseItem>>("/courses/admin/all?limit=50", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este curso?")) return;
    setDeleting(id);
    try {
      await api.delete(`/courses/${id}`);
      await load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Formação Contínua / Cursos"
        description="Cursos e formações com cartaz e inscrições."
        action={{ label: "Novo curso", href: "/admin/cursos/novo" }}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há cursos.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {data.items.map((item) => (
            <div key={item._id} className="flex items-center gap-4 p-4">
              {item.coverImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImage.url} alt="" className="w-14 h-16 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-16 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">{item.area || item.modality}</p>
                <span className={`inline-flex items-center gap-1 text-xs mt-1 ${item.isPublished ? "text-green-600" : "text-gray-400"}`}>
                  {item.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {item.isPublished ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/cursos/${item._id}`} className="p-2 text-gray-500 hover:text-angola-navy hover:bg-gray-100 rounded-lg" aria-label="Editar">
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
