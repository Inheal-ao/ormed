"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  Shield,
} from "lucide-react";
import { bastonarios } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function BastonariaSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = bastonarios[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % bastonarios.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + bastonarios.length) % bastonarios.length
    );
  };

  return (
    <section className="py-24 bg-angola-navy text-white relative overflow-hidden">
      {/* Background Pattern */}
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bastonários da ORMED
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Conheça os líderes que guiaram a Ordem dos Médicos de Angola ao
            longo da sua história
          </p>
        </motion.div>

        {/* Current Bastonária */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden relative flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${current.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-angola-navy opacity-60" />
                  <div className="relative z-10 text-center p-8">
                    {/* removed decorative initial circle to show full photo */}
                    <h3 className="text-2xl font-bold text-white">
                      {current.name}
                    </h3>
                    <p className="text-angola-gold mt-1">{current.period}</p>
                  </div>
                </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-angola-gold/30 rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-angola-gold/30 rounded-br-2xl" />
            </div>

            {/* Info */}
            <div>
              {current.isCurrent && (
                <Badge className="mb-4 bg-angola-gold text-angola-navy hover:bg-angola-gold">
                  Bastonária Atual
                </Badge>
              )}
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {current.name}
              </h3>
              <p className="text-angola-gold text-lg font-medium mb-6">
                {current.period}
              </p>

              {current.bio && (
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-medical-teal mt-0.5 shrink-0" />
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {current.bio}
                    </p>
                  </div>
                </div>
              )}

              {current.quote && (
                <div className="relative bg-white/5 rounded-xl p-6 mb-8">
                  <Quote className="w-8 h-8 text-angola-gold/30 absolute top-4 left-4" />
                  <p className="text-gray-300 italic leading-relaxed pl-8">
                    "{current.quote}"
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <button
                  onClick={prev}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {bastonarios.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-8 bg-angola-gold"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Bastonários Grid */}
        <div className="mt-16">
          <h3 className="text-lg font-semibold text-gray-400 mb-6 text-center">
            Bastonários Anteriores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bastonarios.slice(1).map((b, index) => (
              <motion.button
                key={b.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setCurrentIndex(index + 1)}
                className={`p-4 rounded-xl text-left transition-all ${
                  currentIndex === index + 1
                    ? "bg-angola-gold/20 border border-angola-gold/30"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                  <span className="text-lg font-bold text-gray-400">
                    {b.name.charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{b.name}</p>
                <p className="text-xs text-gray-500">{b.period}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
