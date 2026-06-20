"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Search,
  Check,
  X,
} from "lucide-react";
import { events } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const eventTypes = ["Todos", "Webinar", "Congresso", "Workshop", "Jornadas"];

export default function EventosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "Todos" || event.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-28 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-angola-navy to-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
              Agenda
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Eventos
            </h1>
            <p className="text-gray-300 text-lg">
              Congressos, workshops, webinars e jornadas para a comunidade médica
              angolana
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pesquisar eventos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === type
                      ? "bg-angola-navy text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros ou termos de pesquisa
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredEvents.map((event) => {
                const occupancy = Math.round(
                  (event.registered / event.spots) * 100
                );
                const isFull = event.registered >= event.spots;
                const isPast = new Date(event.date) < new Date();

                return (
                  <div
                    key={event.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {/* Date */}
                      <div className="lg:w-48 bg-angola-navy text-white p-6 flex lg:flex-col items-center justify-center gap-2 lg:gap-0 shrink-0">
                        <span className="text-3xl lg:text-4xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-sm text-gray-400 uppercase">
                          {new Date(event.date).toLocaleDateString("pt-AO", {
                            month: "long",
                          })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.date).getFullYear()}
                        </span>
                        {isPast && (
                          <Badge variant="secondary" className="mt-2">
                            Realizado
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 lg:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <Badge
                              variant={
                                event.type === "Congresso"
                                  ? "default"
                                  : event.type === "Webinar"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="mb-2"
                            >
                              {event.type}
                            </Badge>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-angola-gold transition-colors">
                              {event.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          {event.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="flex items-center gap-1.5 text-gray-500">
                              <Users className="w-4 h-4" />
                              {event.registered} / {event.spots} inscritos
                            </span>
                            <span
                              className={`font-medium ${
                                isFull ? "text-angola-gold" : "text-teal-600"
                              }`}
                            >
                              {isFull
                                ? "Lotado"
                                : `${event.spots - event.registered} vagas disponíveis`}
                            </span>
                          </div>
                          <Progress value={occupancy} className="h-2" />
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            className="bg-angola-navy hover:bg-angola-blue"
                            size="sm"
                            disabled={isFull || isPast}
                            onClick={() => setSelectedEvent(event)}
                          >
                            {isPast ? (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Encerrado
                              </>
                            ) : isFull ? (
                              "Esgotado"
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Inscrever-se
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            Ver Detalhes
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Event Detail Dialog */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedEvent.title}
                </DialogTitle>
                <DialogDescription>
                  <Badge className="mt-2">{selectedEvent.type}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Data</p>
                    <p className="font-medium">{formatDate(selectedEvent.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Hora</p>
                    <p className="font-medium">{selectedEvent.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Local</p>
                    <p className="font-medium">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Vagas</p>
                    <p className="font-medium">
                      {selectedEvent.registered} / {selectedEvent.spots}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-angola-navy hover:bg-angola-blue flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Confirmar Inscrição
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
