"use client";

import { motion } from "framer-motion";
import { timeline } from "@/lib/data";

export function TimelineSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/10 text-angola-gold text-sm font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-angola-gold" />
            História
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Linha do Tempo da ORMED
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Os marcos mais importantes na história da Ordem dos Médicos de
            Angola
          </p>
        </motion.div>

        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-angola-gold via-angola-gold to-angola-green hidden md:block" />

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={`${item.year}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div
                      className={`bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800 ${
                        isLeft ? "md:ml-auto" : "md:mr-auto"
                      } max-w-md`}
                    >
                      <span className="inline-block px-3 py-1 rounded-full bg-angola-gold/10 text-angola-gold text-sm font-bold mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-white border-4 border-angola-gold items-center justify-center shadow-lg z-10 shrink-0">
                    <span className="text-xs font-bold text-angola-gold">
                      {item.year.slice(-2)}
                    </span>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
