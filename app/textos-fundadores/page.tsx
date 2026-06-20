"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollText, Feather, Landmark, Scale } from "lucide-react";

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

const foundational = [
  { id: "juramento", label: "Juramento de Hipócrates", icon: ScrollText, text: JURAMENTO, image: true },
  { id: "genebra", label: "Declaração de Genebra (AMM)", icon: Landmark, text: GENEBRA },
  { id: "asclepio", label: "Carta de Asclépio", icon: Feather, text: ASCLEPIO },
];

export default function TextosFundadoresPage() {
  const [activeText, setActiveText] = useState("juramento");
  const text = foundational.find((f) => f.id === activeText)!;

  return (
    <div className="pt-36 pb-16 min-h-screen">
      {/* Hero */}
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <Scale className="w-4 h-4" />
            Ética & Deontologia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Textos Fundadores da Ética Médica</h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Os compromissos históricos que inspiram e orientam a profissão médica.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
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
            <h2 className="text-xl md:text-2xl font-bold text-angola-navy uppercase tracking-wide flex items-center gap-3">
              <text.icon className="w-6 h-6 text-angola-gold" />
              {text.label}
            </h2>
          </div>
          <div className="px-6 md:px-10 py-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{text.text}</p>

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
    </div>
  );
}
