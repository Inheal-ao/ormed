"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Scale,
  BookOpen,
  ChevronRight,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentsList } from "@/components/documents-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const chapters = [
  {
    id: "cap1",
    title: "Capítulo I - Disposições Gerais",
    articles: [
      {
        number: "Art. 1º",
        title: "Objecto e âmbito de aplicação",
        content:
          "O presente Código Deontológico estabelece os princípios e regras deontológicas que devem orientar o exercício da profissão médica em Angola, visando garantir a dignidade, a integridade e a excelência do serviço prestado aos cidadãos.",
      },
      {
        number: "Art. 2º",
        title: "Princípios fundamentais",
        content:
          "O médico deve pautar a sua conduta pelos princípios da beneficência, não maleficência, autonomia do doente, justiça e equidade, confidencialidade e respeito pela vida humana.",
      },
      {
        number: "Art. 3º",
        title: "Independência profissional",
        content:
          "O médico exerce a sua profissão com independência técnica e deontológica, não podendo ser obrigado a praticar atos médicos contrários à sua consciência ou aos princípios éticos.",
      },
    ],
  },
  {
    id: "cap2",
    title: "Capítulo II - Relação Médico-Doente",
    articles: [
      {
        number: "Art. 10º",
        title: "Dever de informação",
        content:
          "O médico deve informar o doente sobre o seu estado de saúde, o diagnóstico, o prognóstico, os tratamentos propostos e os seus riscos, de forma clara e compreensível.",
      },
      {
        number: "Art. 11º",
        title: "Consentimento informado",
        content:
          "Nenhum acto médico pode ser realizado sem o consentimento livre e esclarecido do doente, salvo em situações de emergência ou quando o doente não tem capacidade para consentir.",
      },
      {
        number: "Art. 12º",
        title: "Sigilo profissional",
        content:
          "O médico é obrigado ao sigilo profissional sobre todos os factos de que tenha conhecimento por virtude do exercício da medicina. O sigilo persiste mesmo após a morte do doente.",
      },
    ],
  },
  {
    id: "cap3",
    title: "Capítulo III - Deveres do Médico",
    articles: [
      {
        number: "Art. 20º",
        title: "Dever de assistência",
        content:
          "O médico não pode recusar a sua assistência a quem dela necessite, salvo por motivo de força maior ou impossibilidade objectiva.",
      },
      {
        number: "Art. 21º",
        title: "Formação contínua",
        content:
          "O médico deve manter-se actualizado através de formação contínua, participando em programas de educação médica permanente.",
      },
      {
        number: "Art. 22º",
        title: "Publicidade",
        content:
          "O médico deve abster-se de qualquer forma de publicidade que possa denegrir a dignidade da profissão ou induzir em erro os cidadãos.",
      },
    ],
  },
  {
    id: "cap4",
    title: "Capítulo IV - Responsabilidade e Sanções",
    articles: [
      {
        number: "Art. 30º",
        title: "Responsabilidade disciplinar",
        content:
          "A violação das normas do presente Código Deontológico constitui infracção disciplinar, sujeita às sanções previstas no Código Disciplinar da Ordem dos Médicos.",
      },
      {
        number: "Art. 31º",
        title: "Responsabilidade civil e criminal",
        content:
          "Sem prejuízo da responsabilidade disciplinar, o médico responde civil e criminalmente pelos danos causados em consequência de actos ilícitos praticados no exercício da profissão.",
      },
    ],
  },
];

export default function CodigoDeontologicoPage() {
  const [activeChapter, setActiveChapter] = useState("cap1");

  return (
    <div className="pt-28 pb-16">
      {/* Hero */}
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
              <Scale className="w-4 h-4" />
              Ética & Deontologia
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Código Deontológico
            </h1>
            <p className="text-gray-300 text-lg">
              O conjunto de princípios e regras que orientam o exercício da
              profissão médica em Angola
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-4">Capítulos</h3>
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(chapter.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeChapter === chapter.id
                      ? "bg-angola-cream text-angola-gold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <AlertTriangle className="w-5 h-5 text-angola-gold mb-2" />
                <p className="text-xs text-angola-navy">
                  A violação deste código pode resultar em sanções disciplinares.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-angola-cream flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-angola-gold" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {
                        chapters.find((c) => c.id === activeChapter)?.title
                      }
                    </h2>
                    <p className="text-sm text-gray-500">
                      Código Deontológico da ORMED
                    </p>
                  </div>
                </div>

                <Card className="border border-gray-100 shadow-lg mb-8">
                  <CardContent className="p-6">
                    <div className="grid gap-6 lg:grid-cols-[180px_auto] items-start">
                      <div className="overflow-hidden rounded-3xl border border-gray-200">
                        <Image
                          src="/images/hipocrates-juramento-medicina.jpg"
                          alt="Hipócrates"
                          width={180}
                          height={240}
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">
                          JURAMENTO DE HIPÓCRATES
                        </h2>
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {`Juro por Apolo médico, por Esculápio, por Higieia e por Panaceia, e por todos os deuses e deusas, tomando-os por testemunhas, que cumprirei, segundo as minhas forças e o meu juízo, o juramento e o compromisso seguintes:

Cumprirei o dever para com os meus mestres, considerarei a sua descendência como irmãos e compartilharei com eles os meus bens; instruirei os seus filhos sem salário ou acordo, transmitindo aos discípulos o ensinamento desta arte, aos que tiverem feito o compromisso segundo a lei médica, mas a ninguém mais.

Aplicarei regimes dietéticos segundo as minhas forças e o meu juízo; preservarei a pureza e a santidade da minha vida e da minha arte.

Não permitirei que nenhuma droga mortal ou nociva seja dada a ninguém, nem sugerirei tal coisa; de igual modo, não entregarei a nenhuma mulher pessário abortivo.

Guardarei absoluta reserva sobre tudo o que, no exercício ou fora dele, vir ou ouvir, e que deva permanecer em segredo.

Que as minhas mãos preservem a saúde, que eu não me deixe corromper por injustiça ou corrupção, e que eu não falhe na minha honra e na honra da profissão médica.`}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Accordion type="single" collapsible className="space-y-3">
                  {chapters
                    .find((c) => c.id === activeChapter)
                    ?.articles.map((article, index) => (
                      <AccordionItem
                        key={index}
                        value={`article-${index}`}
                        className="border border-gray-100 dark:border-gray-800 rounded-xl px-6 data-[state=open]:shadow-sm"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-angola-gold shrink-0">
                              {article.number}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              {article.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-5 pl-16">
                          {article.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Button className="bg-angola-navy hover:bg-angola-blue">
                <BookOpen className="w-4 h-4 mr-2" />
                Descarregar PDF
              </Button>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Código Disciplinar
              </Button>
              <Button variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Apresentar Denúncia
              </Button>
            </div>
            
            {/* Ethics & Deontology Extra Content */}
            <div className="mt-12 space-y-8">
              <Card className="shadow-lg">
                <CardContent>
                  <h3 className="text-lg font-bold mb-2">Declaração de Genebra da AMM</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Versão de outubro de 2017. Documento oficial da Associação Médica Mundial. Fonte: <a className="text-angola-navy underline" href="https://www.wma.net/policies-post/wma-declaration-of-geneva/" target="_blank" rel="noreferrer">WMA - Declaration of Geneva</a>
                  </p>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {`Adotada pela 2.ª Assembleia Geral da Associação Médica Mundial, Genebra, Suíça, setembro 1948, revista pela 22.ª Assembleia, Sydney, Austrália, agosto 1968, pela 35.ª Assembleia, Veneza, Itália, outubro 1983 e pela 46.ª Assembleia, Estocolmo, Suécia, setembro 1994, revisão editorial no 170.ª Sessão do Conselho, Divonne-les-Bains, França, maio 2005, na 173.ª Sessão do Conselho, Divonne-les-Bains, França, maio 2006, e revista na 68.ª Assembleia, Chicago, EUA, outubro 2017.

COMPROMISSO DO MÉDICO

COMO MEMBRO DA PROFISSÃO MÉDICA:

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

FAÇO ESTAS PROMESSAS solenemente, livremente e sob palavra de honra;`}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent>
                  <h3 className="text-lg font-bold mb-2">Carta de Asclépio</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {`Queres ser médico meu filho?
É aspiração própria de uma alma generosa, de um espírito ávido de ciência. Desejas que os homens te tomem por um Deus que alivie os seus males e lhes afugenta os temores?

Pensaste bem no que vai ser a tua vida? Terás que renunciar à vida privada: enquanto que a maioria das pessoas podem, terminado o seu trabalho, isolar-se dos aborrecimentos, a tua porta estará sempre aberta a todos; a qualquer hora do dia ou da noite virão perturbar o teu descanso, os teus prazeres, as tuas meditações; já não terás horas para dedicar à tua família, às tuas amizades, ao estudo; em suma, já não te pertencerás.

Trabalharás de dia e de noite, e serás interrompido por males, dores e chamadas inesperadas. Em tempo de frio e de calor, em dias claros e encobertos, partirás para onde estiver a dor e o sofrimento, e pouco encontrarás onde te esconder.

Não busques festas, não busques honras, não busques riquezas. Aprende a contentar-te com a gratidão dos teus doentes, com a paz da tua consciência e com o valor de uma vida útil.

Serás testemunha de lágrimas, incompreensão e ingratidão. Muitos não entenderão os teus sacrifícios, e outros levarão a tua ajuda como algo que lhes é devido.

Não permitas que a cobiça te corrompa, nem que o teu coração se endureça. Guarda a tua dignidade, a tua coragem e a tua compaixão. Trata sempre os teus doentes com respeito, fidelidade e humanidade.

Cuida de ti ao mesmo tempo em que cuidas dos outros, para que mantenhas força, equilíbrio e honestidade no exercício da tua arte.

Se verdadeiramente queres seguir esta profissão, prepara-te para uma vida de serviço, de entrega e de responsabilidade. Faz-te médico, meu filho.

`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Documentos oficiais em PDF (geridos no painel) */}
      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentos oficiais</h2>
        <DocumentsList category="codigo-deontologico" emptyText="O documento oficial será disponibilizado em breve." />
      </div>
    </div>
  );
}
