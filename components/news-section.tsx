"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, User, Tag } from "lucide-react";
import Link from "next/link";
import { news } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NewsSection() {
  const featuredNews = news.filter((n) => n.featured);
  const regularNews = news.filter((n) => !n.featured).slice(0, 4);

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
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              Notícias
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured News */}
          <div className="space-y-6">
            {featuredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/noticias/${item.id}/`}>
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-angola-dark to-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <Tag className="w-12 h-12 text-white/30 mx-auto mb-2" />
                        <span className="text-white/50 text-sm">{item.title}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="angola">{item.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {item.author}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-angola-gold transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {item.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-angola-gold text-sm font-medium opacity-100 transition-opacity">
                      Ler mais
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Regular News List */}
          <div className="space-y-4">
            {regularNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <Link
                  href={`/noticias/${item.id}/`}
                  className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-200 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-angola-gold transition-colors line-clamp-2 text-sm leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {item.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
