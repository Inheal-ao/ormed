"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Megaphone, Calendar, ArrowLeft, Loader2, Download } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { AnnouncementItem } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ComunicadoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: c, loading } = usePublicData<AnnouncementItem>(`/announcements/slug/${slug}`, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>;
  }
  if (!c) {
    return (
      <div className="pt-32 pb-20 text-center">
        <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Comunicado não encontrado</h1>
        <Link href="/comunicados/" className="text-angola-gold hover:underline">Voltar aos comunicados</Link>
      </div>
    );
  }

  return (
    <article className="pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/comunicados/" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos comunicados
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <Badge variant="angola">{c.category}</Badge>
          <span className="text-sm text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(c.publishedAt ?? c.createdAt)}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{c.title}</h1>

        {c.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.coverImage.url} alt={c.title} className="w-full rounded-2xl object-cover max-h-[420px] mb-8" />
        )}

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{c.content}</div>

        {c.pdf?.url && (
          <a href={c.pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110">
            <Download className="w-4 h-4" /> Descarregar documento oficial
          </a>
        )}
      </div>
    </article>
  );
}
