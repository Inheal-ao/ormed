"use client";

import { useState } from "react";
import Link from "next/link";
import { Megaphone, Loader2, Calendar, X, Download, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, AnnouncementItem, Asset } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { downloadUrl } from "@/lib/cloudinary-download";
import { optImg } from "@/lib/img";
import { CoverImage } from "@/components/cover-image";

/** Reúne as imagens de um comunicado (capa primeiro). */
function imagesOf(c: AnnouncementItem): Asset[] {
  return [
    ...(c.coverImage?.url ? [c.coverImage] : []),
    ...(c.images ?? []),
  ];
}

export default function ComunicadosPage() {
  const { data, loading } = usePublicData<Paginated<AnnouncementItem>>("/announcements?limit=100");
  const items = (data?.items ?? []).filter((c) => imagesOf(c).length > 0);

  const [active, setActive] = useState<AnnouncementItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = active ? imagesOf(active) : [];
  const openComunicado = (c: AnnouncementItem) => {
    setActive(c);
    setPhotoIndex(0);
  };
  const prev = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setPhotoIndex((i) => (i + 1) % photos.length);

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
            Comunicados oficiais da Ordem dos Médicos de Angola. Clique num comunicado para ver
            todas as páginas e descarregar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ainda não há comunicados publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((c) => {
              const imgs = imagesOf(c);
              const extra = imgs.length - 1;
              return (
                <div
                  key={c._id}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button type="button" onClick={() => openComunicado(c)} className="block w-full relative">
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                      <CoverImage src={imgs[0].url} alt={c.title} width={500} className="w-full h-full group-hover:scale-[1.03] transition-transform" />
                    </div>
                    {extra > 0 && (
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-black/65 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        <Images className="w-3.5 h-3.5" />
                        +{extra} {extra === 1 ? "foto" : "fotos"}
                      </span>
                    )}
                  </button>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="angola">{c.category}</Badge>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(c.publishedAt ?? c.createdAt)}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm line-clamp-2">{c.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox — navega pelas páginas/fotos do comunicado selecionado */}
      {active && photos.length > 0 && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col" onClick={() => setActive(null)}>
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              <p className="font-semibold truncate">{active.title}</p>
              <p className="text-xs text-white/60">
                Página {photoIndex + 1} de {photos.length} · {formatDate(active.publishedAt ?? active.createdAt)}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={downloadUrl(photos[photoIndex].url)} download className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm">
                <Download className="w-4 h-4" /><span className="hidden sm:inline">Descarregar</span>
              </a>
              <Link href={`/comunicados/${active.slug}/`} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm hidden sm:block">
                Abrir comunicado
              </Link>
              <button type="button" onClick={() => setActive(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 relative" onClick={() => setActive(null)}>
            {photos.length > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/80 hover:text-white p-2" aria-label="Página anterior">
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/80 hover:text-white p-2" aria-label="Página seguinte">
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[photoIndex].url} alt={`${active.title} ${photoIndex + 1}`} className="max-h-[78vh] max-w-full w-auto rounded-lg" onClick={(e) => e.stopPropagation()} />
          </div>

          {/* Miniaturas das páginas */}
          {photos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-4 justify-center" onClick={(e) => e.stopPropagation()}>
              {photos.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  className={`w-12 h-16 rounded-md overflow-hidden border-2 shrink-0 ${i === photoIndex ? "border-angola-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                  aria-label={`Página ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
