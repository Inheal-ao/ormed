"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, GraduationCap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePublicData } from "@/lib/use-public-data";
import { BastonarioItem } from "@/lib/admin-types";
import { optImg } from "@/lib/img";
import { CoverImage } from "@/components/cover-image";

export function BastonariaSection() {
  const { data, loading } = usePublicData<BastonarioItem[]>("/bastonarios");
  const bastonarios = data ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) {
    return (
      <section className="py-24 bg-angola-navy flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
      </section>
    );
  }
  if (bastonarios.length === 0) return null;

  const current = bastonarios[Math.min(currentIndex, bastonarios.length - 1)];
  const next = () => setCurrentIndex((prev) => (prev + 1) % bastonarios.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + bastonarios.length) % bastonarios.length);

  return (
    <section className="py-24 bg-angola-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-angola-gold" />
            Liderança
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bastonários da ORMED</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça os líderes que guiaram a Ordem dos Médicos de Angola ao longo da sua
            história
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="relative">
              <div className="aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden relative flex items-center justify-center bg-gray-800">
                {current.photo?.url && (
                  <CoverImage src={current.photo.url} alt={current.name} width={600} className="absolute inset-0 w-full h-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-angola-navy via-transparent to-transparent" />
                <div className="relative z-10 text-center p-8 mt-auto self-end">
                  <h3 className="text-2xl font-bold text-white">{current.name}</h3>
                  <p className="text-angola-gold mt-1">{current.mandate}</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-angola-gold/30 rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-angola-gold/30 rounded-br-2xl" />
            </div>

            <div>
              {current.isCurrent && (
                <Badge className="mb-4 bg-angola-gold text-angola-navy hover:bg-angola-gold">
                  Bastonário(a) Atual
                </Badge>
              )}
              <h3 className="text-3xl md:text-4xl font-bold mb-2">{current.name}</h3>
              <p className="text-angola-gold text-lg font-medium mb-6">{current.mandate}</p>

              {current.bio && (
                <div className="flex items-start gap-3 mb-8">
                  <GraduationCap className="w-5 h-5 text-medical-teal mt-0.5 shrink-0" />
                  <p className="text-gray-300 text-sm leading-relaxed">{current.bio}</p>
                </div>
              )}

              {current.quote && (
                <div className="relative bg-white/5 rounded-xl p-6 mb-8">
                  <Quote className="w-8 h-8 text-angola-gold/30 absolute top-4 left-4" />
                  <p className="text-gray-300 italic leading-relaxed pl-8">
                    &quot;{current.quote}&quot;
                  </p>
                </div>
              )}

              {bastonarios.length > 1 && (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={prev}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {bastonarios.map((b, index) => (
                      <button
                        key={b._id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Ver ${b.name}`}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-8 bg-angola-gold"
                            : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                    aria-label="Seguinte"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
