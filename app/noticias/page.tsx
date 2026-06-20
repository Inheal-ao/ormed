"use client";

import { useState } from "react";
import { Calendar, User, Tag, Search, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, NewsItem } from "@/lib/admin-types";

export default function NoticiasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  const { data, loading } = usePublicData<Paginated<NewsItem>>("/news?limit=100");
  const news = data?.items ?? [];

  // Categorias derivadas das notícias existentes
  const categories = [
    "Todas",
    ...Array.from(new Set(news.map((n) => n.category).filter(Boolean))),
  ];

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "Todas" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-16">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              Comunicação
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Notícias</h1>
            <p className="text-gray-300 text-lg">
              As últimas notícias e atualidades da Ordem dos Médicos de Angola
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pesquisar notícias..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-angola-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma notícia encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {news.length === 0
                  ? "Ainda não há notícias publicadas."
                  : "Tente ajustar os filtros ou termos de pesquisa"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <article
                  key={item._id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
                  <Link href={`/noticias/${item.slug}/`}>
                    <div className="aspect-video relative overflow-hidden bg-angola-navy flex items-center justify-center">
                      {item.coverImage?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImage.url}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <Tag className="w-10 h-10 text-white/30" />
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(item.publishedAt ?? item.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.author}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-angola-gold transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {item.excerpt}
                      </p>
                      <div className="mt-4 flex items-center text-sm font-medium text-angola-gold">
                        Ler artigo completo
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
