"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Building2,
  Building,
  GraduationCap,
  Globe,
  Calendar,
  FileCheck,
  Heart,
  MapPin,
  Award,
  Activity,
  Stethoscope,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { StatItem } from "@/lib/admin-types";
import { AnimatedStatValue } from "@/components/animated-stat-value";

// Mapa de nomes de ícone (definidos no painel) para componentes
const ICONS: Record<string, LucideIcon> = {
  Users,
  Building,
  Building2,
  GraduationCap,
  Globe,
  Calendar,
  FileCheck,
  Heart,
  MapPin,
  Award,
  Activity,
  Stethoscope,
  ShieldCheck,
};

export function StatsSection() {
  const ref = useRef(null);
  useInView(ref, { once: true, margin: "-100px" });
  const { data } = usePublicData<StatItem[]>("/stats");
  const stats = data ?? [];

  if (stats.length === 0) return null;

  return (
    <section ref={ref} className="py-24 bg-angola-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px",
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
            Números
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">ORMED em Números</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A dimensão e o impacto da Ordem dos Médicos de Angola no sistema de saúde
            nacional
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = ICONS[stat.icon] ?? Activity;
            return (
              <motion.div
                key={stat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-angola-gold/20 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-angola-gold" />
                </div>
                <p className="text-4xl font-bold text-white mb-2">
                  <AnimatedStatValue value={stat.value} />
                </p>
                <h3 className="text-lg font-semibold text-gray-200">{stat.label}</h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
