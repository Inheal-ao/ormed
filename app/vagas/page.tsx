"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Loader2, MapPin, Clock, ArrowRight, Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePublicData } from "@/lib/use-public-data";
import { Paginated, JobItem } from "@/lib/admin-types";
import { formatDate } from "@/lib/utils";

export default function VagasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading } = usePublicData<Paginated<JobItem>>("/jobs?limit=100");
  const jobs = data?.items ?? [];

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Carreira
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Vagas de Emprego</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Oportunidades de emprego para profissionais de saúde em Angola.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Pesquisar por cargo, entidade ou local..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {jobs.length === 0 ? "Não há vagas abertas de momento." : "Nenhuma vaga encontrada."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <Link
                key={job._id}
                href={`/vagas/${job.slug}/`}
                className="group block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-angola-gold/40 transition-all"
              >
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-angola-navy transition-colors mb-2">
                  {job.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                  {job.entity && <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" />{job.entity}</span>}
                  {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location}</span>}
                  {job.type && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{job.type}</span>}
                </div>
                {job.description && <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>}
                <div className="flex items-center justify-between mt-4">
                  {job.deadline ? (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Até {formatDate(job.deadline)}
                    </span>
                  ) : <span />}
                  <span className="inline-flex items-center gap-1 text-angola-gold font-medium text-sm">
                    Ver vaga
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
