"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Megaphone, Calendar, ArrowLeft, Loader2, Download, X, FileText } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { AnnouncementItem, Asset } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { downloadUrl } from "@/lib/cloudinary-download";

export default function ComunicadoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: c, loading } = usePublicData<AnnouncementItem>(`/announcements/slug/${slug}`, [slug]);
  const [zoom, setZoom] = useState<string | null>(null);

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

  // Reúne todas as imagens (capa + galeria), sem cortar
  const images: Asset[] = [
    ...(c.coverImage?.url ? [c.coverImage] : []),
    ...(c.images ?? []),
  ];

  return (
    <article className="pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
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

        {c.content && (
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{c.content}</div>
        )}

        {/* Documentos como imagens (estilo galeria, sem cortar) */}
        {images.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {images.map((img, i) => (
              <figure key={i} className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                <button type="button" onClick={() => setZoom(img.url)} className="block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={`${c.title} ${i + 1}`} className="w-full h-auto object-contain" />
                </button>
                <figcaption className="p-3 flex justify-end">
                  <a
                    href={downloadUrl(img.url)}
                    download
                    className="inline-flex items-center gap-1.5 text-sm font-medium bg-angola-navy text-white px-3 py-1.5 rounded-lg hover:brightness-110"
                  >
                    <Download className="w-4 h-4" /> Descarregar
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {c.pdf?.url && (
          <a href={c.pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110">
            <FileText className="w-4 h-4" /> Ver documento PDF
          </a>
        )}
      </div>

      {/* Lightbox */}
      {zoom && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
          <button type="button" onClick={() => setZoom(null)} className="absolute top-4 right-4 text-white/80 hover:text-white p-2" aria-label="Fechar">
            <X className="w-7 h-7" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="" className="max-h-[88vh] max-w-full w-auto rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </article>
  );
}
