"use client";

import { motion } from "framer-motion";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePublicData } from "@/lib/use-public-data";
import { FaqItem } from "@/lib/admin-types";

export function FAQSection() {
  const { data } = usePublicData<FaqItem[]>("/faqs");
  const faqs = data ?? [];

  if (faqs.length === 0) return null;

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              Encontre respostas para as questões mais comuns sobre a Ordem dos
              Médicos de Angola, inscrições, serviços e muito mais.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-angola-gold/10 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-angola-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    Ainda tem dúvidas?
                  </h4>
                  <p className="text-sm text-gray-500">
                    A nossa equipa está pronta para ajudar
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Se não encontrou a resposta que procura, entre em contacto
                connosco. Responderemos o mais breve possível.
              </p>
              <Link href="/contactos/">
                <Button variant="angola" className="w-full">
                  Contactar Suporte
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right - Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-6 data-[state=open]:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:no-underline py-5">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-angola-gold shrink-0" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-5 pl-7">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
