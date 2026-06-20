import { DocumentsList } from "@/components/documents-list";

export const metadata = { title: "Regulamento Geral" };

export default function RegulamentoGeralPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Regulamento Geral</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Regulamento geral da Ordem dos Médicos de Angola.
          </p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <DocumentsList category="regulamento-geral" emptyText="O regulamento será disponibilizado em breve." />
      </div>
    </div>
  );
}
