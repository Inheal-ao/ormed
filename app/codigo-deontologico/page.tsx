"use client";

import { useState } from "react";
import { Scale, BookOpen, AlertTriangle, ScrollText } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DocumentsList } from "@/components/documents-list";

const chapters = [
  {
    id: "cap1",
    title: "Capítulo I",
    subtitle: "Disposições Gerais",
    articles: [
      { number: "Art. 1º", title: "Objecto e âmbito de aplicação", content: "O presente Código Deontológico estabelece os princípios e regras deontológicas que devem orientar o exercício da profissão médica em Angola, visando garantir a dignidade, a integridade e a excelência do serviço prestado aos cidadãos." },
      { number: "Art. 2º", title: "Princípios fundamentais", content: "O médico deve pautar a sua conduta pelos princípios da beneficência, não maleficência, autonomia do doente, justiça e equidade, confidencialidade e respeito pela vida humana." },
      { number: "Art. 3º", title: "Independência profissional", content: "O médico exerce a sua profissão com independência técnica e deontológica, não podendo ser obrigado a praticar atos médicos contrários à sua consciência ou aos princípios éticos." },
    ],
  },
  {
    id: "cap2",
    title: "Capítulo II",
    subtitle: "Relação Médico-Doente",
    articles: [
      { number: "Art. 10º", title: "Dever de informação", content: "O médico deve informar o doente sobre o seu estado de saúde, o diagnóstico, o prognóstico, os tratamentos propostos e os seus riscos, de forma clara e compreensível." },
      { number: "Art. 11º", title: "Consentimento informado", content: "Nenhum acto médico pode ser realizado sem o consentimento livre e esclarecido do doente, salvo em situações de emergência ou quando o doente não tem capacidade para consentir." },
      { number: "Art. 12º", title: "Sigilo profissional", content: "O médico é obrigado ao sigilo profissional sobre todos os factos de que tenha conhecimento por virtude do exercício da medicina. O sigilo persiste mesmo após a morte do doente." },
    ],
  },
  {
    id: "cap3",
    title: "Capítulo III",
    subtitle: "Deveres do Médico",
    articles: [
      { number: "Art. 20º", title: "Dever de assistência", content: "O médico não pode recusar a sua assistência a quem dela necessite, salvo por motivo de força maior ou impossibilidade objectiva." },
      { number: "Art. 21º", title: "Formação contínua", content: "O médico deve manter-se actualizado através de formação contínua, participando em programas de educação médica permanente." },
      { number: "Art. 22º", title: "Publicidade", content: "O médico deve abster-se de qualquer forma de publicidade que possa denegrir a dignidade da profissão ou induzir em erro os cidadãos." },
    ],
  },
  {
    id: "cap4",
    title: "Capítulo IV",
    subtitle: "Responsabilidade e Sanções",
    articles: [
      { number: "Art. 30º", title: "Responsabilidade disciplinar", content: "A violação das normas do presente Código Deontológico constitui infracção disciplinar, sujeita às sanções previstas no Código Disciplinar da Ordem dos Médicos." },
      { number: "Art. 31º", title: "Responsabilidade civil e criminal", content: "Sem prejuízo da responsabilidade disciplinar, o médico responde civil e criminalmente pelos danos causados em consequência de actos ilícitos praticados no exercício da profissão." },
    ],
  },
];

export default function CodigoDeontologicoPage() {
  const [activeChapter, setActiveChapter] = useState("cap1");
  const chapter = chapters.find((c) => c.id === activeChapter)!;

  return (
    <div className="pt-36 pb-16">
      {/* Hero */}
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <Scale className="w-4 h-4" />
            Ética & Deontologia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Código Deontológico</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Os princípios e regras que orientam o exercício da profissão médica em Angola.
          </p>
        </div>
      </section>

      {/* Articulado do Código */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-2">
                <h2 className="font-semibold text-gray-900 mb-3">Capítulos</h2>
                {chapters.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChapter(c.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      activeChapter === c.id
                        ? "bg-angola-navy text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <span className="block text-xs font-semibold opacity-80">{c.title}</span>
                    <span className="block text-sm font-medium">{c.subtitle}</span>
                  </button>
                ))}

                <Link
                  href="/textos-fundadores/"
                  className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl bg-angola-cream text-angola-navy text-sm font-medium hover:brightness-95"
                >
                  <ScrollText className="w-4 h-4 text-angola-gold" />
                  Textos Fundadores da Ética
                </Link>
                <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-angola-gold mb-2" />
                  <p className="text-xs text-angola-navy">
                    A violação deste código pode resultar em sanções disciplinares.
                  </p>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-angola-navy/5 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-angola-navy" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {chapter.title} — {chapter.subtitle}
                    </h2>
                    <p className="text-sm text-gray-500">Código Deontológico da ORMED</p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                  {chapter.articles.map((article, index) => (
                    <AccordionItem
                      key={index}
                      value={`article-${index}`}
                      className="border border-gray-100 rounded-xl px-5 data-[state=open]:shadow-sm"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <span className="flex items-center gap-3">
                          <span className="text-sm font-bold text-angola-gold shrink-0">{article.number}</span>
                          <span className="text-sm font-semibold text-gray-900">{article.title}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-5">
                        {article.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/codigo-disciplinar/" className="inline-flex items-center gap-2 border border-gray-200 bg-white font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50">
                  Código Disciplinar
                </Link>
                <Link href="/denuncias/" className="inline-flex items-center gap-2 border border-gray-200 bg-white font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50">
                  <AlertTriangle className="w-4 h-4" />
                  Apresentar Denúncia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentos oficiais */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos oficiais</h2>
        <DocumentsList category="codigo-deontologico" emptyText="O documento oficial será disponibilizado em breve." />
      </section>
    </div>
  );
}
