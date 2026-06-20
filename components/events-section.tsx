"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";
import Link from "next/link";
import { events } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const eventTypes = ["Todos", "Webinar", "Congresso", "Workshop", "Jornadas"];

export function EventsSection() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filteredEvents =
    activeFilter === "Todos"
      ? events
      : events.filter((e) => e.type === activeFilter);

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Próximos Eventos
            </h2>
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

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === type
                  ? "bg-angola-gold text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredEvents.map((event, index) => {
              const occupancy = Math.round(
                (event.registered / event.spots) * 100
              );
              const isFull = event.registered >= event.spots;

              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.05 * index }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Date Badge */}
                    <div className="sm:w-28 bg-angola-navy text-white p-4 flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 shrink-0">
                      <span className="text-2xl sm:text-3xl font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-sm text-gray-400 uppercase">
                        {new Date(event.date).toLocaleDateString("pt-AO", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).getFullYear()}
                      </span>
                    </div>

                    {/* Content */}
                    {/* Thumbnail (uses event.image) */}
                    <div className="w-full rounded-t-lg overflow-hidden mb-4 sm:mb-0 sm:mr-4 sm:w-56 sm:flex-shrink-0">
                      <div
                        className="relative h-48 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url(${event.image})` }}
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <Badge
                            variant={
                              event.type === "Congresso"
                                ? "angola"
                                : event.type === "Webinar"
                                ? "medical"
                                : "secondary"
                            }
                            className="mb-2"
                          >
                            {event.type}
                          </Badge>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-angola-gold transition-colors">
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {event.location}
                        </span>
                      </div>

                      {/* Registration Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <Users className="w-3.5 h-3.5" />
                            {event.registered} / {event.spots} inscritos
                          </span>
                          <span
                            className={`font-medium ${
                              isFull ? "text-angola-gold" : "text-medical-teal"
                            }`}
                          >
                            {isFull
                              ? "Lotado"
                              : `${event.spots - event.registered} vagas`}
                          </span>
                        </div>
                        <Progress
                          value={occupancy}
                          className="h-1.5"
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          href={`/eventos/${event.id}/`}
                          className="text-sm font-medium text-angola-gold flex items-center gap-1 opacity-100 transition-opacity"
                        >
                          Ver detalhes
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Button
                          size="sm"
                          variant={isFull ? "outline" : "angola"}
                          disabled={isFull}
                          className="text-xs"
                        >
                          {isFull ? (
                            "Esgotado"
                          ) : (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Inscrever
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
