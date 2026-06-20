"use client";

import { Mic, Loader2, Play } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, PodcastItem } from "@/lib/admin-types";
import { youtubeThumb } from "@/lib/youtube";

function thumb(ep: PodcastItem): string | null {
  return ep.coverImage?.url ?? youtubeThumb(ep.youtubeUrl);
}

export default function PodcastPage() {
  const { data, loading } = usePublicData<Paginated<PodcastItem>>("/podcast?limit=100");
  const items = data?.items ?? [];
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Mic className="w-4 h-4" />
            Podcast
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Ouvido Clínico</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            O podcast da Ordem dos Médicos de Angola. Conversas e episódios em vídeo.
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
            <Mic className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Brevemente</h2>
            <p className="text-gray-600">Os episódios serão publicados em breve.</p>
          </div>
        ) : (
          <>
            {/* Episódio em destaque */}
            {featured && (
              <a
                href={featured.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200 mb-12 bg-white hover:shadow-xl transition-all"
              >
                <div className="relative aspect-video bg-angola-navy">
                  {thumb(featured) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(featured)!} alt={featured.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-angola-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 text-angola-navy fill-angola-navy ml-1" />
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  {featured.episode && (
                    <p className="text-angola-gold font-medium mb-2">{featured.episode}</p>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{featured.title}</h2>
                  <p className="text-gray-600 line-clamp-4">{featured.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-angola-navy font-semibold">
                    <Play className="w-4 h-4" /> Ver episódio
                  </span>
                </div>
              </a>
            )}

            {/* Grelha dos restantes */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((ep) => (
                  <a
                    key={ep._id}
                    href={ep.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <div className="relative aspect-video bg-angola-navy">
                      {thumb(ep) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumb(ep)!} alt={ep.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-angola-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-angola-navy fill-angola-navy ml-0.5" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      {ep.episode && <p className="text-xs text-angola-gold font-medium mb-1">{ep.episode}</p>}
                      <h3 className="font-bold text-gray-900 line-clamp-2">{ep.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
