"use client";

import Link from "next/link";
import { Megaphone, Loader2, Calendar, ArrowRight, FileText } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, AnnouncementItem } from "@/lib/admin-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function ComunicadosPage() {
  const { data, loading } = usePublicData<Paginated<AnnouncementItem>>("/announcements?limit=100");
  const items = data?.items ?? [];

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Megaphone className="w-4 h-4" />
            Comunicação
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Comunicados</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Comunicados oficiais da Ordem dos Médicos de Angola.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ainda não há comunicados publicados.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((c) => (
              <Link
                key={c._id}
                href={`/comunicados/${c.slug}/`}
                className="group block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-angola-gold/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="angola">{c.category}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(c.publishedAt ?? c.createdAt)}
                  </span>
                  {c.pdf?.url && <FileText className="w-4 h-4 text-gray-400" />}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-angola-navy transition-colors mb-1">
                  {c.title}
                </h3>
                {c.content && <p className="text-sm text-gray-600 line-clamp-2">{c.content}</p>}
                <span className="inline-flex items-center gap-1 text-angola-gold font-medium text-sm mt-3">
                  Ler comunicado
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
