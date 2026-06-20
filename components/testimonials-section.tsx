"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { TestimonialItem } from "@/lib/admin-types";

export function TestimonialsSection() {
  const { data } = usePublicData<TestimonialItem[]>("/testimonials");
  const testimonials = data ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) return null;
  const safeIndex = Math.min(currentIndex, testimonials.length - 1);
  const t = testimonials[safeIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-angola-gold via-angola-gold to-angola-green" />

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Testemunhos
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que dizem os nossos Membros
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Depoimentos de médicos que fazem parte da Ordem dos Médicos de
            Angola
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-11 h-11 bg-angola-gold rounded-full flex items-center justify-center shadow-md shadow-angola-gold/25">
                <Quote className="w-5 h-5 text-white" />
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 md:p-8 pt-10 text-center border border-gray-100">
                {/* Stars */}
                <div className="flex items-center justify-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-angola-gold fill-angola-gold" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-display italic">
                  &quot;{t.text}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center">
                  <div className="mb-2">
                    {t.avatar?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatar.url}
                        alt={t.name}
                        className="w-12 h-12 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-angola-gold flex items-center justify-center mx-auto">
                        <span className="text-lg font-bold text-white">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={prev}
              aria-label="Testemunho anterior"
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ver testemunho ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    index === safeIndex
                      ? "w-8 bg-angola-gold"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Testemunho seguinte"
              className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
