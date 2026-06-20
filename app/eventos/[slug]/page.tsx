"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  Loader2,
  ExternalLink,
  Check,
  Upload,
} from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { EventItem } from "@/lib/admin-types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { API_URL } from "@/lib/api";

function RegistrationForm({ event }: { event: EventItem }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [docs, setDocs] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("phone", phone);
      form.append("notes", notes);
      if (proof) form.append("paymentProof", proof);
      docs.forEach((d) => form.append("documents", d));

      const res = await fetch(`${API_URL}/event-registrations/${event._id}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha na inscrição.",
        );
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao inscrever.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Inscrição recebida!</h3>
        <p className="text-gray-600">
          A sua inscrição foi registada. A equipa da Ordem irá validar os seus dados.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-angola-gold outline-none text-gray-900";

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Inscrição</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
        <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className={inputClass} required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea className={`${inputClass} min-h-[80px]`} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {event.price > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comprovativo de pagamento ({formatCurrency(event.price)})
          </label>
          <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
            <Upload className="w-4 h-4" />
            {proof ? proof.name : "Carregar comprovativo (imagem ou PDF)"}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setProof(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documentos (opcional)</label>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
          <Upload className="w-4 h-4" />
          {docs.length > 0 ? `${docs.length} ficheiro(s)` : "Anexar documentos pessoais"}
          <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => setDocs(Array.from(e.target.files ?? []))} />
        </label>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Confirmar inscrição
      </button>
    </form>
  );
}

export default function EventoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: event, loading } = usePublicData<EventItem>(`/events/slug/${slug}`, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
      </div>
    );
  }
  if (!event) {
    return (
      <div className="pt-32 pb-20 text-center">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Evento não encontrado</h1>
        <Link href="/eventos/" className="text-angola-gold hover:underline">Voltar aos eventos</Link>
      </div>
    );
  }

  const isPast = new Date(event.startDate) < new Date();
  const canRegister = event.registrationOpen && !isPast;

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <Link href="/eventos/" className="flex w-fit items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos eventos
        </Link>

        {event.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage.url} alt={event.title} className="w-full rounded-2xl object-cover max-h-[360px] mb-8" />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-angola-gold" />{formatDate(event.startDate)}</span>
              {event.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-angola-gold" />{event.location}</span>}
              {event.capacity > 0 && <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-angola-gold" />{event.capacity} vagas</span>}
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-angola-gold" />{event.price > 0 ? formatCurrency(event.price) : "Gratuito"}</span>
            </div>
            {event.description && <p className="text-lg text-gray-700 mb-4">{event.description}</p>}
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{event.content}</div>
          </div>

          <div className="lg:col-span-1">
            {!canRegister ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                {isPast ? "Este evento já foi realizado." : "As inscrições estão encerradas."}
              </div>
            ) : event.registrationType === "external" && event.externalLink ? (
              <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-4 rounded-2xl hover:brightness-110">
                <ExternalLink className="w-5 h-5" />
                Inscrever-se
              </a>
            ) : (
              <RegistrationForm event={event} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
