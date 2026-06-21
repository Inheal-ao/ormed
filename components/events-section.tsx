"use client";

import { motion } from "framer-motion";
import { MapPin, Users, ArrowRight, Tag, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, EventItem } from "@/lib/admin-types";
import { formatCurrency } from "@/lib/utils";
import { optImg } from "@/lib/img";
import { CoverImage } from "@/components/cover-image";

export function EventsSection() {
  const { data, loading } = usePublicData<Paginated<EventItem>>("/events?limit=4");
  const events = data?.items ?? [];

  if (!loading && events.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-teal/10 text-medical-teal text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-medical-teal" />
              Eventos
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Próximos Eventos</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl">
              Congressos, workshops, webinars e jornadas para a comunidade médica
            </p>
          </div>
          <Link href="/eventos/">
            <Button variant="outline" className="group">
              Ver todos os eventos
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-angola-gold" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <Link href={`/eventos/${event.slug}/`} className="flex flex-col sm:flex-row">
                  <div className="sm:w-28 bg-angola-navy text-white p-4 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold">{new Date(event.startDate).getDate()}</span>
                    <span className="text-sm text-gray-300 uppercase">
                      {new Date(event.startDate).toLocaleDateString("pt-AO", { month: "short" })}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(event.startDate).getFullYear()}</span>
                  </div>

                  {event.coverImage?.url && (
                    <div className="sm:w-48 shrink-0">
                      <CoverImage src={event.coverImage.url} alt={event.title} width={500} className="h-40 sm:h-full" />
                    </div>
                  )}

                  <div className="flex-1 p-6">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-angola-gold transition-colors mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      {event.location && (
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
                      )}
                      {event.capacity > 0 && (
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{event.capacity} vagas</span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {event.price > 0 ? formatCurrency(event.price) : "Gratuito"}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
