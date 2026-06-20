"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Search, Loader2, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, EventItem } from "@/lib/admin-types";
import { formatCurrency } from "@/lib/utils";

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading } = usePublicData<Paginated<EventItem>>("/events?limit=100");
  const events = data?.items ?? [];

  const filtered = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pt-28 pb-16">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            Agenda
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Congressos, workshops, webinars e jornadas para a comunidade médica angolana.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Pesquisar eventos..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {events.length === 0 ? "Ainda não há eventos" : "Nenhum evento encontrado"}
              </h3>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((event) => {
                const isPast = new Date(event.startDate) < new Date();
                return (
                  <Link
                    key={event._id}
                    href={`/eventos/${event.slug}/`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
                  >
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-48 bg-angola-navy text-white p-6 flex lg:flex-col items-center justify-center gap-2 lg:gap-0 shrink-0">
                        <span className="text-3xl lg:text-4xl font-bold">{new Date(event.startDate).getDate()}</span>
                        <span className="text-sm text-gray-300 uppercase">
                          {new Date(event.startDate).toLocaleDateString("pt-AO", { month: "long" })}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(event.startDate).getFullYear()}</span>
                        {isPast && <Badge variant="secondary" className="mt-2">Realizado</Badge>}
                      </div>
                      <div className="flex-1 p-6 lg:p-8">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-angola-gold transition-colors mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                          {event.location && (
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.location}</span>
                          )}
                          {event.capacity > 0 && (
                            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{event.capacity} vagas</span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4" />
                            {event.price > 0 ? formatCurrency(event.price) : "Gratuito"}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-angola-gold font-medium">
                          Ver detalhes e inscrição
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
