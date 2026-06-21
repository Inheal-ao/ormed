"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, User, Newspaper, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, NewsItem } from "@/lib/admin-types";
import { optImg } from "@/lib/img";
import { CoverImage } from "@/components/cover-image";

export function NewsSection() {
  const { data, loading } = usePublicData<Paginated<NewsItem>>("/news?limit=5");
  const items = data?.items ?? [];
  const featured = items[0];
  const rest = items.slice(1, 5);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-4">
              <Newspaper className="w-3.5 h-3.5" />
              Notícias
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-display">
              A Ordem Informa
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
              As últimas notícias e atualidades da Ordem dos Médicos de Angola
            </p>
          </div>
          <Link href="/noticias/">
            <Button variant="outline" className="group">
              Ver todas as notícias
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Destaque editorial — imagem grande com overlay */}
            {featured && (
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-7"
              >
                <Link
                  href={`/noticias/${featured.slug}/`}
                  className="group block relative rounded-3xl overflow-hidden h-[420px] lg:h-[520px]"
                >
                  <div className="absolute inset-0 bg-angola-navy">
                    {featured.coverImage?.url && (
                      <CoverImage
                        src={featured.coverImage.url}
                        alt={featured.title}
                        width={900}
                        lazy={false}
                        className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <Badge variant="angola" className="mb-3">
                      {featured.category}
                    </Badge>
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3 group-hover:text-angola-gold transition-colors">
                      {featured.title}
                    </h3>
                    {featured.subtitle && (
                      <p className="text-gray-200 text-base mb-3 line-clamp-2">
                        {featured.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(featured.publishedAt ?? featured.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {featured.author}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Lista lateral — recentes */}
            <div className="lg:col-span-5 flex flex-col divide-y divide-gray-100">
              {rest.map((item, index) => (
                <motion.article
                  key={item._id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 * index }}
                  className="flex-1"
                >
                  <Link
                    href={`/noticias/${item.slug}/`}
                    className="group flex gap-4 py-4 first:pt-0"
                  >
                    <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                      {item.coverImage?.url ? (
                        <CoverImage src={item.coverImage.url} alt={item.title} width={300} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold mb-1">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-angola-navy transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.publishedAt ?? item.createdAt)}
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
