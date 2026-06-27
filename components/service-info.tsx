import Link from "next/link";
import { IdCard, CheckCircle2, ArrowRight, Search } from "lucide-react";

interface ServiceInfoProps {
  title: string;
  description: string;
  passos: string[];
  nota?: string;
}

/**
 * Página informativa de um serviço (sem formulário público).
 * O pedido é feito na Área do Membro pelo médico inscrito.
 */
export function ServiceInfo({ title, description, passos, nota }: ServiceInfoProps) {
  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-angola-gold text-sm font-semibold uppercase tracking-wide">Serviço ao médico</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">{title}</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">{description}</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8 items-start">
        {/* Como solicitar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Como solicitar</h2>
          <ol className="space-y-3">
            {passos.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-angola-navy/5 text-angola-navy text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-sm text-gray-700">{p}</span>
              </li>
            ))}
          </ol>
          {nota && <p className="text-xs text-gray-500 mt-5 border-t border-gray-100 pt-4">{nota}</p>}
        </div>

        {/* CTA — Área do Membro */}
        <div className="bg-gradient-to-br from-angola-navy to-[#001631] text-white rounded-2xl p-7">
          <span className="w-12 h-12 rounded-xl bg-angola-gold/20 text-angola-gold flex items-center justify-center mb-4"><IdCard className="w-6 h-6" /></span>
          <h2 className="text-xl font-bold">Solicite na Área do Membro</h2>
          <p className="text-gray-300 text-sm mt-2 mb-5">Este serviço é tratado de forma segura no portal do médico. Entre com as suas credenciais para o solicitar e acompanhar.</p>
          <ul className="space-y-2 text-sm text-gray-200 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-angola-gold" /> Pedido associado ao seu registo na Ordem.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-angola-gold" /> Acompanhamento do estado e documentos no portal.</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-angola-gold" /> Recibos e comprovativos sempre disponíveis.</li>
          </ul>
          <Link href="/area-membro/" className="inline-flex items-center gap-2 bg-angola-gold text-angola-navy font-semibold px-5 py-3 rounded-lg hover:brightness-95">
            <IdCard className="w-4 h-4" /> Entrar na Área do Membro <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Já tem um pedido? Consulte o estado em <Link href="/consultar/" className="underline">/consultar</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
