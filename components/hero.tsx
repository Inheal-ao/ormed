"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePublicData } from "@/lib/use-public-data";
import { getStatIcon } from "@/lib/stat-icons";
import { StatItem } from "@/lib/admin-types";
import { AnimatedStatValue } from "@/components/animated-stat-value";

const slides = [
  {
    title: "Pela Dignidade Médica",
    subtitle: "Rumo à Excelência",
    description:
      "Há mais de 35 anos que existimos para garantir, ao profissional médico, o exercício da medicina em Angola com a dignidade merecida.",
    image: "/images/bastonaria-campaign.jpg",
    cta: { label: "Inscreva-se Agora", href: "/inscricao/" },
    cta2: { label: "Saber Mais", href: "/sobre/" },
  },
  {
    title: "Ética e Deontologia",
    subtitle: "Pilares da Profissão",
    description:
      "Pautamo-nos pelo rigor e cumprimento escrupuloso da ética e da deontologia profissional, visando prestar um serviço de saúde com qualidade.",
    image: "/images/bastonaria-2.jpg",
    cta: { label: "Código Deontológico", href: "/codigo-deontologico/" },
    cta2: { label: "Denúncias", href: "/denuncias/" },
  },
  {
    title: "Formação Contínua",
    subtitle: "Educação Permanente",
    description:
      "Programas de formação, workshops, webinars e congressos para manter os médicos angolanos na vanguarda do conhecimento médico.",
    image: "/images/bastonaria-1.jpg",
    cta: { label: "Próximos Eventos", href: "/eventos/" },
    cta2: { label: "Área do Membro", href: "/area-membro/" },
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const { data: statsData } = usePublicData<StatItem[]>("/stats");
  const quickStats = (statsData ?? []).slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-angola-navy">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-angola-navy/95 via-angola-navy/80 to-angola-navy/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-angola-navy via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-20 w-full">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-angola-gold/20 border border-angola-gold/30 text-angola-navy text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-angola-gold animate-pulse" />
                Ordem dos Médicos de Angola
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-xl md:text-2xl text-angola-gold font-display mb-6 drop-shadow-sm">
                {slides[currentSlide].subtitle}
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl">
                {slides[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={slides[currentSlide].cta.href}>
                  <Button
                    size="lg"
                    className="bg-angola-gold hover:bg-angola-gold/90 text-white px-8 py-6 text-base font-semibold shadow-lg shadow-angola-gold/25 hover:shadow-angola-gold/40 transition-all"
                  >
                    {slides[currentSlide].cta.label}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href={slides[currentSlide].cta2.href}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
                  >
                    {slides[currentSlide].cta2.label}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Quick Stats (do painel admin) */}
        {quickStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {quickStats.map((stat, index) => {
              const Icon = getStatIcon(stat.icon);
              return (
                <motion.div
                  key={stat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-white dark:bg-gray-900/10 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:bg-white/15 transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-angola-gold/20 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-angola-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      <AnimatedStatValue value={stat.value} />
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-angola-gold"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
