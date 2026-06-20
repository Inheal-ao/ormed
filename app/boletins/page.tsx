"use client";

import { useState } from "react";
import { FileText, Loader2, Download, X, BookOpen } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, BulletinItem } from "@/lib/admin-types";

export default function BoletinsPage() {
  const { data, loading } = usePublicData<Paginated<BulletinItem>>("/bulletins?limit=100");
  const items = data?.items ?? [];
  const [active, setActive] = useState<BulletinItem | null>(null);

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <FileText className="w-4 h-4" />
            Publicações
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Boletins</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Boletins informativos da Ordem dos Médicos de Angola.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Brevemente</h2>
            <p className="text-gray-600">Os boletins serão publicados em breve.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((b) => (
              <div key={b._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
                <div className="aspect-[3/4] bg-angola-navy relative overflow-hidden">
                  {b.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.coverImage.url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{b.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{b.edition}{b.year ? ` · ${b.year}` : ""}</p>
                  {b.pdf?.url && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setActive(b)} className="flex-1 flex items-center justify-center gap-1.5 bg-angola-gold text-angola-navy text-sm font-semibold py-2 rounded-lg hover:brightness-95 transition">
                        <BookOpen className="w-4 h-4" />Ler
                      </button>
                      <a href={b.pdf.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50" aria-label="Descarregar">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {active?.pdf?.url && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <p className="font-semibold truncate">{active.title}</p>
            <div className="flex items-center gap-2 shrink-0">
              <a href={active.pdf.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm">
                <Download className="w-4 h-4" /><span className="hidden sm:inline">Descarregar</span>
              </a>
              <button type="button" onClick={() => setActive(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg" aria-label="Fechar">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <iframe src={active.pdf.url} title={active.title} className="flex-1 w-full bg-white" />
        </div>
      )}
    </div>
  );
}
