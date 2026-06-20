"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowLeft,
  Loader2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Link2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usePublicData } from "@/lib/use-public-data";
import { NewsItem } from "@/lib/admin-types";

export default function NoticiaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, loading } = usePublicData<NewsItem>(`/news/slug/${slug}`, [slug]);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="pt-32 pb-20 text-center">
        <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Notícia não encontrada</h1>
        <Link href="/noticias/" className="text-angola-gold hover:underline">
          Voltar às notícias
        </Link>
      </div>
    );
  }

  // Carrossel: capa + fotos adicionais
  const photos = [
    ...(item.coverImage?.url ? [item.coverImage] : []),
    ...(item.images ?? []),
  ];
  const current = photos[Math.min(photoIndex, photos.length - 1)];

  return (
    <article className="pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/noticias/"
          className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às notícias
        </Link>

        {/* Hierarquia: categoria → título → subtítulo → meta */}
        <Badge variant="angola" className="mb-4">
          {item.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
          {item.title}
        </h1>
        {item.subtitle && (
          <p className="text-xl text-gray-600 font-medium mb-4 leading-snug">
            {item.subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-8 pb-6 border-b">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(item.publishedAt ?? item.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {item.author}
          </span>
          {item.source && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Link2 className="w-3.5 h-3.5" />
              Fonte: {item.source}
            </span>
          )}
        </div>

        {/* Carrossel de fotos */}
        {current?.url && (
          <div className="relative mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={item.title}
              className="w-full rounded-2xl object-cover max-h-[460px]"
            />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"
                  aria-label="Foto seguinte"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      aria-label={`Foto ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === photoIndex ? "w-6 bg-white" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {item.excerpt && (
          <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">
            {item.excerpt}
          </p>
        )}

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>

        {item.source && (
          <p className="mt-10 pt-6 border-t text-sm text-gray-400">Fonte: {item.source}</p>
        )}
      </div>
    </article>
  );
}
