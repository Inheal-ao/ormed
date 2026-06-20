"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Loader2, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usePublicData } from "@/lib/use-public-data";
import { NewsItem } from "@/lib/admin-types";

export default function NoticiaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: item, loading } = usePublicData<NewsItem>(`/news/slug/${slug}`, [slug]);

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

  return (
    <article className="pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/noticias/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às notícias
        </Link>

        <Badge variant="angola" className="mb-4">
          {item.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {item.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(item.publishedAt ?? item.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            {item.author}
          </span>
        </div>

        {item.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverImage.url}
            alt={item.title}
            className="w-full rounded-2xl mb-8 object-cover max-h-[420px]"
          />
        )}

        {item.excerpt && (
          <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">
            {item.excerpt}
          </p>
        )}

        {/* Conteúdo: preserva quebras de linha do texto introduzido no admin */}
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {item.content}
        </div>
      </div>
    </article>
  );
}
