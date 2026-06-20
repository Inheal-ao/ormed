"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Users, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-angola-gold via-angola-navy to-angola-navy" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-angola-gold/10 blur-2xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white/5 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-angola-gold" />
              Junte-se a nós
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Seja um Médico inscrito na{" "}
              <span className="text-angola-gold">Ordem dos Médicos</span>
            </h2>

            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              "Pela Dignidade Médica Rumo à Excelência". Faça parte de uma
              comunidade de mais de 12.500 médicos comprometidos com a
              excelência em Angola.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/inscricao/">
                <Button
                  size="lg"
                  className="bg-angola-gold text-angola-navy hover:bg-angola-gold/90 px-8 py-6 text-base font-bold shadow-lg shadow-angola-gold/25"
                >
                  Quero Inscrever-me
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/consulta-medicos/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base"
                >
                  <Users className="mr-2 w-5 h-5" />
                  Consultar Médicos
                </Button>
              </Link>
            </div>

            {/* Stats mini */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              {[
                { icon: Users, value: "12.500+", label: "Membros" },
                { icon: Award, value: "35+", label: "Anos" },
                { icon: Heart, value: "18", label: "Delegações" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-6 h-6 text-angola-gold mx-auto mb-2" />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
