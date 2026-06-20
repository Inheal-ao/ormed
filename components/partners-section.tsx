"use client";

import { motion } from "framer-motion";
import { Handshake, Loader2 } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { PartnerItem } from "@/lib/admin-types";
import { optImg } from "@/lib/img";

export function PartnersSection() {
  const { data, loading } = usePublicData<PartnerItem[]>("/partners");
  const partners = data ?? [];

  if (!loading && partners.length === 0) return null;

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
            Instituições com quem cooperamos para o desenvolvimento da medicina em Angola
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-7 h-7 animate-spin text-angola-gold" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partners.map((partner, index) => {
              const Wrapper = partner.website ? "a" : "div";
              return (
                <motion.div
                  key={partner._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Wrapper
                    {...(partner.website
                      ? { href: partner.website, target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group bg-white rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-angola-gold/30 hover:shadow-md transition-all duration-300 text-center flex flex-col items-center h-full"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      {partner.logo?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={optImg(partner.logo.url, 240)}
                          alt={partner.name}
                          loading="lazy"
                          className="max-w-full max-h-20 object-contain"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-angola-gold/10 transition-colors">
                          <span className="text-2xl font-bold text-gray-400 group-hover:text-angola-gold transition-colors">
                            {partner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {partner.name}
                    </h4>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
