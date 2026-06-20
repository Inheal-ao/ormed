"use client";

import { useState } from "react";
import { Images, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { GalleryItem } from "@/lib/admin-types";
import { optImg } from "@/lib/img";

export default function GaleriaPage() {
  const { data, loading } = usePublicData<GalleryItem[]>("/gallery");
  const photos = data ?? [];
  const [index, setIndex] = useState<number | null>(null);

  const open = index !== null ? photos[index] : null;
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % photos.length));

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Images className="w-4 h-4" />
            Publicações
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Galeria</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Momentos e atividades da Ordem dos Médicos de Angola.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Brevemente</h2>
            <p className="text-gray-600">As fotos serão publicadas em breve.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <button
                key={photo._id}
                type="button"
                onClick={() => setIndex(i)}
                className="block w-full overflow-hidden rounded-xl group break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={optImg(photo.image.url, 500)}
                  alt={photo.caption || "Foto da galeria"}
                  loading="lazy"
                  className="w-full object-cover group-hover:scale-[1.03] transition-transform"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center" onClick={() => setIndex(null)}>
          <button type="button" onClick={() => setIndex(null)} className="absolute top-4 right-4 text-white/80 hover:text-white p-2" aria-label="Fechar">
            <X className="w-7 h-7" />
          </button>
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
          <figure className="max-w-5xl max-h-[85vh] px-12" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.image.url} alt={open.caption} className="max-h-[80vh] w-auto mx-auto rounded-lg" />
            {open.caption && <figcaption className="text-center text-white/70 mt-3">{open.caption}</figcaption>}
          </figure>
        </div>
      )}
    </div>
  );
}
