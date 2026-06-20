"use client";

import { useState } from "react";
import { FileText, Loader2, Download, X, ChevronLeft, ChevronRight, Images, Play, BookOpen } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, BulletinItem, Asset } from "@/lib/admin-types";
import { downloadUrl } from "@/lib/cloudinary-download";
import { youtubeId } from "@/lib/youtube";
import { optImg } from "@/lib/img";

function imagesOf(b: BulletinItem): Asset[] {
  return [...(b.coverImage?.url ? [b.coverImage] : []), ...(b.images ?? [])];
}

export default function BoletinsPage() {
  const { data, loading } = usePublicData<Paginated<BulletinItem>>("/bulletins?limit=100");
  const items = data?.items ?? [];
  const [active, setActive] = useState<BulletinItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = active ? imagesOf(active) : [];
  const videoId = active?.videoUrl ? youtubeId(active.videoUrl) : null;

  const openItem = (b: BulletinItem) => {
    // Se só tem PDF (sem imagens nem vídeo), abre o PDF diretamente
    if (imagesOf(b).length === 0 && !b.videoUrl && b.pdf?.url) {
      window.open(b.pdf.url, "_blank");
      return;
    }
    setActive(b);
    setPhotoIndex(0);
  };
  const prev = () => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setPhotoIndex((i) => (i + 1) % photos.length);

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Publicações
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Boletins</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Boletins informativos da Ordem — em imagem, PDF ou vídeo. Clique para abrir.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>
        ) : items.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Brevemente</h2>
            <p className="text-gray-600">Os boletins serão publicados em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((b) => {
              const imgs = imagesOf(b);
              const cover = imgs[0]?.url;
              const vId = b.videoUrl ? youtubeId(b.videoUrl) : null;
              const extra = imgs.length - 1;
              return (
                <button
                  key={b._id}
                  type="button"
                  onClick={() => openItem(b)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all text-left"
                >
                  <div className="aspect-[3/4] bg-angola-navy relative overflow-hidden">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={optImg(cover, 400)} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : vId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`https://img.youtube.com/vi/${vId}/hqdefault.jpg`} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-white/30" /></div>
                    )}
                    {b.videoUrl && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-angola-gold/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-angola-navy fill-angola-navy ml-0.5" />
                        </span>
                      </span>
                    )}
                    {extra > 0 && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-black/65 text-white text-xs px-2 py-0.5 rounded-full">
                        <Images className="w-3 h-3" />+{extra}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 text-sm line-clamp-1">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.edition}{b.year ? ` · ${b.year}` : ""}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Visualizador */}
      {active && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col" onClick={() => setActive(null)}>
          <div className="flex items-center justify-between p-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              <p className="font-semibold truncate">{active.title}</p>
              {photos.length > 0 && <p className="text-xs text-white/60">Página {photoIndex + 1} de {photos.length}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {photos.length > 0 && (
                <a href={downloadUrl(photos[photoIndex].url)} download className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm">
                  <Download className="w-4 h-4" /><span className="hidden sm:inline">Descarregar</span>
                </a>
              )}
              {active.pdf?.url && (
                <a href={active.pdf.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm">
                  <BookOpen className="w-4 h-4" /><span className="hidden sm:inline">PDF</span>
                </a>
              )}
              <button type="button" onClick={() => setActive(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 relative" onClick={() => setActive(null)}>
            {videoId && photos.length === 0 ? (
              <div className="w-full max-w-4xl aspect-video" onClick={(e) => e.stopPropagation()}>
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : photos.length > 0 ? (
              <>
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
                <img src={photos[photoIndex].url} alt={active.title} className="max-h-[78vh] max-w-full w-auto rounded-lg" onClick={(e) => e.stopPropagation()} />
              </>
            ) : (
              <p className="text-white/70" onClick={(e) => e.stopPropagation()}>Sem pré-visualização. Use os botões acima.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
