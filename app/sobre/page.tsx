"use client";

import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Award,
  BookOpen,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const missionVision = [
  {
    icon: Target,
    title: "Missão",
    color: "bg-angola-cream",
    textColor: "text-angola-gold",
    content:
      "Regular o exercício da profissão médica em Angola, garantindo a qualidade dos serviços de saúde, a defesa dos direitos dos médicos e o cumprimento estrito dos princípios éticos e deontológicos.",
  },
  {
    icon: Eye,
    title: "Visão",
    color: "bg-teal-100",
    textColor: "text-teal-600",
    content:
      "Ser reconhecida como a instituição de referência na regulação do exercício médico em África, promovendo a excelência, a inovação e o desenvolvimento contínuo dos profissionais de saúde em Angola.",
  },
  {
    icon: Heart,
    title: "Valores",
    color: "bg-angola-cream",
    textColor: "text-angola-gold",
    content:
      "Excelência, Integridade, Independência, Compromisso, Solidariedade e Inovação são os pilares que sustentam todas as nossas ações e decisões.",
  },
];

const objectives = [
  {
    icon: Shield,
    title: "Regulação Profissional",
    description:
      "Atribuir carteiras profissionais e fiscalizar o exercício da medicina em todo o território nacional.",
  },
  {
    icon: BookOpen,
    title: "Formação Contínua",
    description:
      "Promover programas de educação médica contínua para manter os médicos atualizados.",
  },
  {
    icon: Scale,
    title: "Ética e Deontologia",
    description:
      "Garantir o cumprimento do Código Deontológico e processar condutas inadequadas.",
  },
  {
    icon: Users,
    title: "Representação",
    description:
      "Defender os interesses da classe médica junto das entidades governamentais e sociais.",
  },
  {
    icon: Award,
    title: "Qualidade",
    description:
      "Estabelecer padrões de qualidade para o exercício da medicina em Angola.",
  },
  {
    icon: Heart,
    title: "Saúde Pública",
    description:
      "Contribuir para a melhoria do sistema nacional de saúde e bem-estar da população.",
  },
];

export default function SobrePage() {
  return (
    <div className="pt-28 pb-16">
      {/* Hero */}
      <section className="bg-angola-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
              Institucional
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a Ordem dos Médicos de Angola
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Uma instituição de utilidade pública com mais de 35 anos de
              história, dedicada à regulação e dignificação do exercício da
              medicina em Angola.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {missionVision.map((item) => (
              <Card
                key={item.title}
                className="border-0 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-6`}
                  >
                    <item.icon className={`w-7 h-7 ${item.textColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                A nossa História
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A Ordem dos Médicos de Angola (ORMED) foi fundada em 1991,
                  pouco tempo após a independência do país, com o objetivo de
                  criar uma estrutura organizada para regular o exercício da
                  profissão médica em território angolano.
                </p>
                <p>
                  Desde a sua criação, a ORMED tem desempenhado um papel
                  fundamental na construção de um sistema de saúde robusto e
                  credível, pautando-se sempre pelos mais elevados padrões de
                  ética e deontologia profissional.
                </p>
                <p>
                  Ao longo de mais de três décadas, a instituição tem
                  acompanhado a evolução do país, adaptando-se às novas
                  realidades e desafios do sistema de saúde angolano, sempre com
                  o compromisso de servir os médicos e a população com
                  excelência.
                </p>
                <p>
                  Hoje, com mais de 12.500 médicos inscritos e delegações em
                  todas as 18 províncias do país, a ORMED continua na vanguarda
                  do interesse coletivo dos profissionais médicos em Angola.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-red-700 via-angola-navy to-angola-navy flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/10 border-4 border-yellow-500/30 flex items-center justify-center">
                    <span className="text-5xl font-bold text-angola-gold">
                      35+
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Anos de História
                  </h3>
                  <p className="text-gray-400">
                    Desde 1991 ao serviço da medicina angolana
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-angola-gold text-slate-900 rounded-xl px-6 py-4 font-bold shadow-lg">
                Fundada em 1991
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Objectivos Institucionais
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              As finalidades que orientam o trabalho da Ordem dos Médicos de
              Angola
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj) => (
              <Card
                key={obj.title}
                className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-angola-cream flex items-center justify-center mb-4 group-hover:bg-angola-navy group-hover:scale-110 transition-all">
                    <obj.icon className="w-6 h-6 text-angola-gold group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {obj.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {obj.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Framework */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Enquadramento Legal
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              A Ordem dos Médicos de Angola é uma instituição de utilidade
              pública de âmbito nacional, gozando de personalidade jurídica,
              autonomia financeira e patrimonial. A sua sede nacional situa-se
              em Luanda, na Rua Amílcar Cabral, 151/153, à Maíanga.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-angola-navy hover:bg-angola-blue">Consultar Estatutos</Button>
              <Button variant="outline">Regulamento Geral</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
