import { Scale } from "lucide-react";

export interface LegalSection {
  heading: string;
  body: string;
}

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
}: {
  title: string;
  subtitle: string;
  updated?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Scale className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">{subtitle}</p>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 py-14">
        {updated && <p className="text-sm text-gray-400 mb-8">Última atualização: {updated}</p>}
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{`${i + 1}. ${s.heading}`}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
