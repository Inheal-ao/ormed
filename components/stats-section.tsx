"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Building2,
  GraduationCap,
  Globe,
  Calendar,
  FileCheck,
} from "lucide-react";

const stats = [
  {
    icon: Users,
    value: 12500,
    suffix: "+",
    label: "Médicos Inscritos",
    description: "Profissionais registados em todo o território nacional",
  },
  {
    icon: Building2,
    value: 18,
    suffix: "",
    label: "Delegações",
    description: "Presentes em todas as províncias de Angola",
  },
  {
    icon: GraduationCap,
    value: 50,
    suffix: "+",
    label: "Especialidades",
    description: "Reconhecidas e reguladas pela ORMED",
  },
  {
    icon: Globe,
    value: 12,
    suffix: "+",
    label: "Parcerias Internacionais",
    description: "Com ordens médicas de todo o mundo",
  },
  {
    icon: Calendar,
    value: 48,
    suffix: "",
    label: "Eventos/Ano",
    description: "Congressos, workshops e formações",
  },
  {
    icon: FileCheck,
    value: 98,
    suffix: "%",
    label: "Taxa de Satisfação",
    description: "Dos médicos inscritos na instituição",
  },
];

function AnimatedCounter({
  value,
  suffix,
  inView,
}: {
  value: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span>
      {count.toLocaleString("pt-AO")}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ORMED em Números
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A dimensão e o impacto da Ordem dos Médicos de Angola no sistema de
            saúde nacional
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-angola-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <stat.icon className="w-7 h-7 text-angola-gold" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
