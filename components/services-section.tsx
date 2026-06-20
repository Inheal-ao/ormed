"use client";

import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Search,
  UserPlus,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
};

export function ServicesSection() {
  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medical-teal/10 text-medical-teal text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-medical-teal" />
            Serviços
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Serviços à Disposição dos Médicos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A ORMED oferece uma gama completa de serviços digitais para
            facilitar o dia a dia dos profissionais de saúde
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Search;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link href={service.href}>
                  <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 h-full">
                    <div
                      className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-angola-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-angola-gold opacity-100 transition-opacity">
                      Aceder ao serviço
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Access Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 bg-gradient-to-r from-angola-dark to-angola-navy rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Precisa de ajuda?
            </h3>
            <p className="text-gray-400">
              O nosso atendimento está disponível de segunda a sexta, das 08:00
              às 17:00
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/consulta-medicos/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-angola-gold text-white rounded-lg font-medium hover:bg-angola-gold/90 transition-colors"
            >
              <Search className="w-4 h-4" />
              Consultar Médico
            </Link>
            <Link
              href="/contactos/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              <ExternalLink className="w-4 h-4" />
              Contactar-nos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
