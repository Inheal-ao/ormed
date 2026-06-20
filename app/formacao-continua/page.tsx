"use client";

import Link from "next/link";
import { GraduationCap, Loader2, Clock, MapPin, Tag, ArrowRight, Monitor } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, CourseItem } from "@/lib/admin-types";
import { formatCurrency } from "@/lib/utils";

const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  misto: "Misto",
};

export default function FormacaoContinuaPage() {
  const { data, loading } = usePublicData<Paginated<CourseItem>>("/courses?limit=100");
  const courses = data?.items ?? [];

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            Formação
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Formação Contínua</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Cursos e programas de educação médica permanente para os profissionais de saúde.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Brevemente</h2>
            <p className="text-gray-600">Os cursos serão publicados em breve.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link
                key={c._id}
                href={`/formacao-continua/${c.slug}/`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[4/3] bg-angola-navy relative overflow-hidden">
                  {c.coverImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverImage.url} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-xs font-medium bg-white/90 text-angola-navy px-2 py-1 rounded-full inline-flex items-center gap-1">
                    <Monitor className="w-3 h-3" />
                    {MODALITY_LABEL[c.modality] ?? c.modality}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  {c.area && <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold mb-1">{c.area}</span>}
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-angola-navy transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{c.description}</p>
                  <div className="mt-auto flex flex-wrap gap-3 text-xs text-gray-500">
                    {c.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{c.duration}</span>}
                    {c.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{c.location}</span>}
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{c.price > 0 ? formatCurrency(c.price) : "Gratuito"}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-angola-gold font-medium text-sm mt-4">
                    Ver curso e inscrição
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
