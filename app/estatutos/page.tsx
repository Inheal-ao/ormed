import { DocumentsList } from "@/components/documents-list";

export const metadata = { title: "Estatutos" };

export default function EstatutosPage() {
  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Estatutos</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Estatutos da Ordem dos Médicos de Angola.
          </p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <DocumentsList category="estatutos" emptyText="Os estatutos serão disponibilizados em breve." />
      </div>
    </div>
  );
}
