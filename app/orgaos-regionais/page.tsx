import { OrgaosView } from "@/components/orgaos-view";

export const metadata = { title: "Órgãos Regionais" };

export default function OrgaosRegionaisPage() {
  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-angola-gold font-medium mb-2">A Ordem</p>
          <h1 className="text-4xl md:text-5xl font-bold">Órgãos Regionais</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            A Ordem organiza-se em três regiões — Norte, Centro e Sul — aproximando os serviços
            e a representação dos médicos em todo o país.
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <OrgaosView scope="regional" />
      </div>
    </div>
  );
}
