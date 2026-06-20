"use client";

import { useState } from "react";
import Image from "next/image";
import { Scale, BookOpen, ScrollText, Feather, Landmark, AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DocumentsList } from "@/components/documents-list";

const JURAMENTO = `Juro por Apolo médico, por Esculápio, por Higieia e por Panaceia, e por todos os deuses e deusas, tomando-os por testemunhas, que cumprirei, segundo as minhas forças e o meu juízo, o juramento e o compromisso seguintes:

Cumprirei o dever para com os meus mestres, considerarei a sua descendência como irmãos e compartilharei com eles os meus bens; instruirei os seus filhos sem salário ou acordo, transmitindo aos discípulos o ensinamento desta arte, aos que tiverem feito o compromisso segundo a lei médica, mas a ninguém mais.

Aplicarei regimes dietéticos segundo as minhas forças e o meu juízo; preservarei a pureza e a santidade da minha vida e da minha arte.

Não permitirei que nenhuma droga mortal ou nociva seja dada a ninguém, nem sugerirei tal coisa; de igual modo, não entregarei a nenhuma mulher pessário abortivo.

Guardarei absoluta reserva sobre tudo o que, no exercício ou fora dele, vir ou ouvir, e que deva permanecer em segredo.

Que as minhas mãos preservem a saúde, que eu não me deixe corromper por injustiça ou corrupção, e que eu não falhe na minha honra e na honra da profissão médica.`;

const GENEBRA = `Adotada pela 2.ª Assembleia Geral da Associação Médica Mundial (Genebra, 1948) e revista por diversas vezes, com a última revisão na 68.ª Assembleia (Chicago, EUA, outubro de 2017).

COMPROMISSO DO MÉDICO — COMO MEMBRO DA PROFISSÃO MÉDICA:

PROMETO SOLENEMENTE consagrar a minha vida ao serviço da humanidade;

A SAÚDE E O BEM-ESTAR DO MEU DOENTE serão as minhas primeiras preocupações;

RESPEITAREI a autonomia e a dignidade do meu doente;

GUARDAREI o máximo respeito pela vida humana;

NÃO PERMITIREI que considerações sobre idade, doença ou deficiência, crença religiosa, origem étnica, sexo, nacionalidade, filiação política, raça, orientação sexual, estatuto social ou qualquer outro fator se interponham entre o meu dever e o meu doente;

RESPEITAREI os segredos que me forem confiados, mesmo após a morte do doente;

EXERCEREI a minha profissão com consciência e dignidade e de acordo com as boas práticas médicas;

FOMENTAREI a honra e as nobres tradições da profissão médica;

GUARDAREI respeito e gratidão aos meus mestres, colegas e alunos pelo que lhes é devido;

PARTILHAREI os meus conhecimentos médicos em benefício dos doentes e da melhoria dos cuidados de saúde;

CUIDAREI da minha saúde, bem-estar e capacidades para prestar cuidados da maior qualidade;

NÃO USAREI os meus conhecimentos médicos para violar direitos humanos e liberdades civis, mesmo sob ameaça;

FAÇO ESTAS PROMESSAS solenemente, livremente e sob palavra de honra.`;

const ASCLEPIO = `Queres ser médico meu filho? É aspiração própria de uma alma generosa, de um espírito ávido de ciência.

Pensaste bem no que vai ser a tua vida? Terás que renunciar à vida privada: enquanto a maioria das pessoas pode, terminado o seu trabalho, isolar-se dos aborrecimentos, a tua porta estará sempre aberta a todos; a qualquer hora do dia ou da noite virão perturbar o teu descanso, os teus prazeres, as tuas meditações.

Trabalharás de dia e de noite. Em tempo de frio e de calor, partirás para onde estiver a dor e o sofrimento.

Não busques festas, não busques honras, não busques riquezas. Aprende a contentar-te com a gratidão dos teus doentes, com a paz da tua consciência e com o valor de uma vida útil.

Não permitas que a cobiça te corrompa, nem que o teu coração se endureça. Guarda a tua dignidade, a tua coragem e a tua compaixão. Trata sempre os teus doentes com respeito, fidelidade e humanidade.

Se verdadeiramente queres seguir esta profissão, prepara-te para uma vida de serviço, de entrega e de responsabilidade. Faz-te médico, meu filho.`;

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

const foundational = [
  { id: "juramento", label: "Juramento de Hipócrates", icon: ScrollText, text: JURAMENTO, image: true },
  { id: "genebra", label: "Declaração de Genebra (AMM)", icon: Landmark, text: GENEBRA },
  { id: "asclepio", label: "Carta de Asclépio", icon: Feather, text: ASCLEPIO },
];

export default function CodigoDeontologicoPage() {
  const [activeChapter, setActiveChapter] = useState("cap1");
  const [activeText, setActiveText] = useState("juramento");
  const chapter = chapters.find((c) => c.id === activeChapter)!;
  const text = foundational.find((f) => f.id === activeText)!;

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

      {/* === Secção 1: Textos fundadores (separados dos capítulos) === */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
            Textos Fundadores da Ética Médica
          </h2>
          <p className="text-gray-500 mt-2">Os compromissos históricos que inspiram a profissão.</p>
        </div>

        {/* Separadores */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {foundational.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveText(f.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeText === f.id
                  ? "bg-angola-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-angola-cream px-6 md:px-10 py-6 border-b border-amber-100">
            <h3 className="text-xl md:text-2xl font-bold text-angola-navy uppercase tracking-wide flex items-center gap-3">
              <text.icon className="w-6 h-6 text-angola-gold" />
              {text.label}
            </h3>
          </div>
          <div className="px-6 md:px-10 py-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text.text}</p>

            {/* Foto no fundo, apenas no Juramento, bem posicionada */}
            {text.image && (
              <figure className="mt-10 pt-8 border-t flex flex-col items-center">
                <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 max-w-xs">
                  <Image
                    src="/images/hipocrates-juramento-medicina.jpg"
                    alt="Hipócrates, pai da medicina"
                    width={320}
                    height={400}
                    className="object-cover w-full h-auto"
                  />
                </div>
                <figcaption className="text-sm text-gray-400 mt-3">
                  Hipócrates de Cós — pai da medicina
                </figcaption>
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* === Secção 2: Articulado do Código (capítulos) === */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
              Articulado do Código
            </h2>
            <p className="text-gray-500 mt-2">Consulte os capítulos e artigos do Código Deontológico.</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Navegação de capítulos */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-2">
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
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <AlertTriangle className="w-5 h-5 text-angola-gold mb-2" />
                  <p className="text-xs text-angola-navy">
                    A violação deste código pode resultar em sanções disciplinares.
                  </p>
                </div>
              </div>
            </aside>

            {/* Artigos do capítulo ativo */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-angola-navy/5 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-angola-navy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {chapter.title} — {chapter.subtitle}
                    </h3>
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

      {/* === Secção 3: Documentos oficiais em PDF === */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos oficiais</h2>
        <DocumentsList category="codigo-deontologico" emptyText="O documento oficial será disponibilizado em breve." />
      </section>
    </div>
  );
}
