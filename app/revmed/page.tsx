"use client";

import { useState } from "react";
import Link from "next/link";
import { FlaskConical, Loader2, Search, ArrowRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, ArticleItem } from "@/lib/admin-types";
import { formatDate } from "@/lib/utils";

export default function RevMedPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading } = usePublicData<Paginated<ArticleItem>>("/revmed?limit=100");
  const articles = data?.items ?? [];

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.abstract.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" />
            RevMed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Revista Médica</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Pesquisas e artigos científicos da comunidade médica angolana.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Pesquisar por título, autor ou tema..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {articles.length === 0 ? "Ainda não há artigos publicados." : "Nenhum artigo encontrado."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((a) => (
              <Link key={a._id} href={`/revmed/${a.slug}/`} className="group block py-8 first:pt-0">
                {a.category && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold">
                    {a.category}
                  </span>
                )}
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-angola-navy transition-colors mt-1 font-display">
                  {a.title}
                </h2>
                {a.subtitle && <p className="text-lg text-gray-600 mt-1">{a.subtitle}</p>}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-3">
                  {a.authors && (
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {a.authors}
                    </span>
                  )}
                  <span>{formatDate(a.publishedAt ?? a.createdAt)}</span>
                </div>
                {a.abstract && (
                  <p className="text-gray-600 mt-3 line-clamp-3 leading-relaxed">{a.abstract}</p>
                )}
                <span className="inline-flex items-center gap-1 text-angola-navy font-medium text-sm mt-3">
                  Ler artigo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
