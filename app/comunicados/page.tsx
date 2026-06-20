"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, Loader2, Calendar, X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, AnnouncementItem, Asset } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { downloadUrl } from "@/lib/cloudinary-download";

interface Photo {
  url: string;
  title: string;
  category: string;
  date: string;
  slug: string;
}

export default function ComunicadosPage() {
  const { data, loading } = usePublicData<Paginated<AnnouncementItem>>("/announcements?limit=100");
  const items = data?.items ?? [];
  const [index, setIndex] = useState<number | null>(null);

  // Achata todas as imagens de todos os comunicados numa grelha (estilo galeria)
  const photos: Photo[] = items.flatMap((c) => {
    const imgs: Asset[] = [
      ...(c.coverImage?.url ? [c.coverImage] : []),
      ...(c.images ?? []),
    ];
    return imgs.map((img) => ({
      url: img.url,
      title: c.title,
      category: c.category,
      date: c.publishedAt ?? c.createdAt,
      slug: c.slug,
    }));
  });

  const open = index !== null ? photos[index] : null;
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % photos.length));

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Megaphone className="w-4 h-4" />
            Comunicação
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Comunicados</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Comunicados oficiais da Ordem dos Médicos de Angola. Clique numa imagem para ampliar
            ou descarregar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ainda não há comunicados publicados.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {photos.map((photo, i) => (
              <figure
                key={i}
                className="break-inside-avoid bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <button type="button" onClick={() => setIndex(i)} className="block w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt={photo.title} className="w-full h-auto object-contain" />
                </button>
                <figcaption className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="angola">{photo.category}</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(photo.date)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{photo.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col" onClick={() => setIndex(null)}>
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              <p className="font-semibold truncate">{open.title}</p>
              <p className="text-xs text-white/60">{formatDate(open.date)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={downloadUrl(open.url)} download className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm">
                <Download className="w-4 h-4" /><span className="hidden sm:inline">Descarregar</span>
              </a>
              <Link href={`/comunicados/${open.slug}/`} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm hidden sm:block">
                Ver comunicado
              </Link>
              <button type="button" onClick={() => setIndex(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative" onClick={() => setIndex(null)}>
            {photos.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/80 hover:text-white p-2" aria-label="Anterior">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/80 hover:text-white p-2" aria-label="Seguinte">
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.url} alt={open.title} className="max-h-[82vh] max-w-full w-auto rounded-lg" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
  );
}
