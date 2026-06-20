"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Award, Target, Heart, Scale } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Award,
    title: "Excelência",
    description:
      "Compromisso com os mais elevados padrões de qualidade no exercício da medicina.",
    color: "bg-blue-500",
  },
  {
    icon: Target,
    title: "Integridade",
    description:
      "Conduta ética e transparente em todas as nossas ações e decisões.",
    color: "bg-angola-gold",
  },
  {
    icon: Heart,
    title: "Compromisso",
    description:
      "Dedicados ao bem-estar dos médicos e da população angolana.",
    color: "bg-medical-teal",
  },
  {
    icon: Scale,
    title: "Independência",
    description:
      "Autonomia total em relação ao Estado, formações políticas e outras organizações.",
    color: "bg-angola-gold",
  },
];

const highlights = [
  "Regulação do exercício da profissão médica",
  "Atribuição da carteira profissional",
  "Homologação de estudos em ciências médicas",
  "Fiscalização da ética e deontologia médica",
  "Formação contínua dos médicos",
  "Representação dos interesses da classe",
];

export function AboutSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-angola-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-medical-teal/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <img
                  src="/images/ordem-medico.jpg"
                  alt="ORMED Desde 1991"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-angola-gold flex items-center justify-center shadow-lg">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">ORMED</h3>
                    <p className="text-angola-gold font-display text-lg">
                      Desde 1991
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-medical-teal/10 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-medical-teal" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">35+</p>
                    <p className="text-sm text-gray-500">Anos de Serviço</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/10 text-angola-gold text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-angola-gold" />
              Sobre Nós
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Na vanguarda do interesse colectivo dos{" "}
              <span className="text-gradient">profissionais médicos</span> em
              Angola
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              A Ordem dos Médicos de Angola é uma instituição de utilidade
              pública de âmbito nacional, que regula o exercício da profissão
              médica no país. Tem como finalidades a atribuição da carteira
              profissional ao médico, após a homologação dos seus estudos em
              ciências médicas.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              A ORMED goza de personalidade jurídica, autonomia financeira e
              patrimonial e tem a sua sede nacional em Luanda. Exerce a sua
              ação com total independência, em relação ao Estado, formações
              políticas, religiosas ou outras organizações.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-medical-teal/10 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-medical-teal" />
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>

            <Link href="/sobre/">
              <Button
                variant="angola"
                className="group"
              >
                Conheça a nossa História
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Os nossos Valores
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Princípios fundamentais que orientam todas as nossas ações e
              decisões
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 dark:border-gray-800"
              >
                <div
                  className={`w-14 h-14 rounded-xl ${value.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <value.icon
                    className={`w-7 h-7 ${
                      value.color === "bg-angola-gold"
                        ? "text-amber-600"
                        : "text-white"
                    }`}
                    style={{
                      color:
                        value.color === "bg-angola-gold"
                          ? "#d97706"
                          : undefined,
                    }}
                  />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {value.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
