"use client";

import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const partners = [
  { name: "Ordem dos Médicos de Portugal", country: "Portugal" },
  { name: "American Medical Association", country: "EUA" },
  { name: "General Medical Council", country: "Reino Unido" },
  { name: "Conselho Federal de Medicina", country: "Brasil" },
  { name: "World Medical Association", country: "Internacional" },
  { name: "Ministério da Saúde de Angola", country: "Angola" },
  { name: "OMS - Angola", country: "Internacional" },
  { name: "Universidade Agostinho Neto", country: "Angola" },
];

export function PartnersSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-sm font-medium mb-4">
            <Handshake className="w-3.5 h-3.5" />
            Parceiros
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Parceiros e Colaboradores
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Instituições com quem cooperamos para o desenvolvimento da medicina
            em Angola
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * index }}
              className="group bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-angola-gold/30 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-angola-gold/10 transition-colors">
                <span className="text-2xl font-bold text-gray-400 group-hover:text-angola-gold transition-colors">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                {partner.name}
              </h4>
              <p className="text-xs text-gray-400">{partner.country}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
