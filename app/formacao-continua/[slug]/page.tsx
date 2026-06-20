"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap, MapPin, Clock, Tag, User, Calendar, Monitor,
  ArrowLeft, Loader2, ExternalLink,
} from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { CourseItem } from "@/lib/admin-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { RegistrationForm } from "@/components/registration-form";

const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  misto: "Misto",
};

export default function CursoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, loading } = usePublicData<CourseItem>(`/courses/slug/${slug}`, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>;
  }
  if (!course) {
    return (
      <div className="pt-32 pb-20 text-center">
        <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h1>
        <Link href="/formacao-continua/" className="text-angola-gold hover:underline">Voltar à formação</Link>
      </div>
    );
  }

  const canRegister = course.registrationOpen;

  return (
    <div className="pt-36 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/formacao-continua/" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar à formação
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {course.coverImage?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={course.coverImage.url} alt={course.title} className="w-full rounded-2xl object-cover max-h-[420px] mb-6" />
            )}
            {course.area && <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold">{course.area}</span>}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1 mb-4">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1.5"><Monitor className="w-4 h-4 text-angola-gold" />{MODALITY_LABEL[course.modality] ?? course.modality}</span>
              {course.instructor && <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-angola-gold" />{course.instructor}</span>}
              {course.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-angola-gold" />{course.duration}</span>}
              {course.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-angola-gold" />{course.location}</span>}
              {course.startDate && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-angola-gold" />{formatDate(course.startDate)}</span>}
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-angola-gold" />{course.price > 0 ? formatCurrency(course.price) : "Gratuito"}</span>
            </div>
            {course.description && <p className="text-lg text-gray-700 mb-4">{course.description}</p>}
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{course.content}</div>
          </div>

          <div className="lg:col-span-1">
            {!canRegister ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                As inscrições estão encerradas.
              </div>
            ) : course.registrationType === "external" && course.externalLink ? (
              <a href={course.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-4 rounded-2xl hover:brightness-110">
                <ExternalLink className="w-5 h-5" />
                Inscrever-se
              </a>
            ) : (
              <RegistrationForm targetId={course._id} price={course.price} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
