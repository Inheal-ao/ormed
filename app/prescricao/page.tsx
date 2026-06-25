"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pill, Search, QrCode, ShieldCheck, IdCard } from "lucide-react";

export default function PrescricaoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (c) router.push(`/receita/${encodeURIComponent(c)}/`);
  };

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-angola-gold text-sm font-semibold uppercase tracking-wide flex items-center gap-2"><Pill className="w-4 h-4" /> Serviço digital</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">Prescrição Eletrónica</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Receitas médicas digitais emitidas pelos médicos inscritos na Ordem, com código e QR de verificação para as farmácias.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 grid lg:grid-cols-2 gap-8 items-start">
        {/* Verificação (farmácia) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Search className="w-5 h-5 text-angola-navy" /> Verificar uma receita</h2>
          <p className="text-gray-500 text-sm mt-1 mb-5">Farmácias: introduza o código da receita (ou leia o QR) para confirmar a sua validade e o médico emissor.</p>
          <form onSubmit={verify} className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-mono outline-none focus:ring-2 focus:ring-angola-gold text-gray-900"
              placeholder="RX-2026-000000" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Código da receita"
            />
            <button type="submit" className="bg-angola-navy text-white font-semibold px-5 rounded-lg hover:brightness-110">Verificar</button>
          </form>
          <div className="mt-5 flex items-start gap-2 text-xs text-gray-500">
            <QrCode className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span>Cada receita tem um QR que, ao ser lido, abre diretamente a página de verificação com os medicamentos e a situação do médico.</span>
          </div>
        </div>

        {/* Para médicos */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><IdCard className="w-5 h-5 text-angola-navy" /> É médico?</h2>
          <p className="text-gray-600 text-sm mt-1 mb-4">Emita receitas eletrónicas na sua área pessoal — pesquise medicamentos, defina a posologia e imprima com QR de verificação.</p>
          <ul className="space-y-2 text-sm text-gray-700 mb-5">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Disponível para médicos com inscrição em vigor.</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Pesquisa de medicamentos integrada.</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Receita imprimível com logótipo e QR oficial.</li>
          </ul>
          <Link href="/area-membro/" className="inline-flex items-center gap-2 bg-angola-gold text-angola-navy font-semibold px-5 py-2.5 rounded-lg hover:brightness-95">
            <IdCard className="w-4 h-4" /> Entrar na Área do Membro
          </Link>
        </div>
      </div>
    </div>
  );
}
