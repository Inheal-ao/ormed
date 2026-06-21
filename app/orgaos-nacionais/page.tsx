import { OrgaosView } from "@/components/orgaos-view";

export const metadata = { title: "Órgãos Nacionais" };

export default function OrgaosNacionaisPage() {
  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-angola-gold font-medium mb-2">A Ordem</p>
          <h1 className="text-4xl md:text-5xl font-bold">Órgãos Nacionais</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Os órgãos de âmbito nacional da Ordem dos Médicos de Angola, responsáveis pela
            direção, fiscalização e disciplina da classe médica em todo o território.
          </p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-14">
        <OrgaosView scope="nacional" />
      </div>
    </div>
  );
}
