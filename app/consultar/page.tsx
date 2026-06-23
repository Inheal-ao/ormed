import { Search } from "lucide-react";
import { ConsultPanel } from "@/components/service-portal";

export const metadata = { title: "Consultar Estado do Serviço" };

export default function ConsultarPage() {
  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Search className="w-4 h-4" />
            Serviços
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Consultar Estado do Serviço</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Introduza o seu código de serviço para acompanhar qualquer pedido — validação de documentos,
            inscrição, renovação, carteira, cotas ou declaração. A plataforma identifica automaticamente o serviço.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <ConsultPanel paid />
      </div>
    </div>
  );
}
