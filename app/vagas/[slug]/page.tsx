"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, MapPin, Clock, Building2, ArrowLeft, Loader2, Mail, ExternalLink,
} from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { JobItem } from "@/lib/admin-types";
import { formatDate } from "@/lib/utils";

export default function VagaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, loading } = usePublicData<JobItem>(`/jobs/slug/${slug}`, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>;
  }
  if (!job) {
    return (
      <div className="pt-32 pb-20 text-center">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vaga não encontrada</h1>
        <Link href="/vagas/" className="text-angola-gold hover:underline">Voltar às vagas</Link>
      </div>
    );
  }

  return (
    <article className="pt-36 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/vagas/" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar às vagas
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
          {job.entity && <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-angola-gold" />{job.entity}</span>}
          {job.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-angola-gold" />{job.location}</span>}
          {job.type && <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-angola-gold" />{job.type}</span>}
          {job.deadline && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-angola-gold" />Até {formatDate(job.deadline)}</span>}
        </div>

        {job.description && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Descrição</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{job.description}</div>
          </div>
        )}

        {job.requirements && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Requisitos</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{job.requirements}</div>
          </div>
        )}

        {/* Candidatura */}
        {(job.applicationEmail || job.externalLink) && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Como candidatar-se</h2>
            <div className="flex flex-wrap gap-3">
              {job.externalLink && (
                <a href={job.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110">
                  <ExternalLink className="w-4 h-4" /> Candidatar-se
                </a>
              )}
              {job.applicationEmail && (
                <a href={`mailto:${job.applicationEmail}?subject=Candidatura: ${encodeURIComponent(job.title)}`} className="inline-flex items-center gap-2 border border-gray-200 font-semibold px-5 py-2.5 rounded-lg hover:bg-white">
                  <Mail className="w-4 h-4" /> {job.applicationEmail}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
