"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Users } from "lucide-react";
import { api } from "@/lib/api";
import { CourseItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function CursoFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [instructor, setInstructor] = useState("");
  const [area, setArea] = useState("");
  const [modality, setModality] = useState<"presencial" | "online" | "misto">("presencial");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [capacity, setCapacity] = useState("0");
  const [price, setPrice] = useState("0");
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [registrationType, setRegistrationType] = useState<"internal" | "external">("internal");
  const [externalLink, setExternalLink] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<CourseItem>(`/courses/admin/${id}`, true);
        setTitle(item.title);
        setDescription(item.description);
        setContent(item.content);
        setInstructor(item.instructor);
        setArea(item.area);
        setModality(item.modality ?? "presencial");
        setDuration(item.duration);
        setLocation(item.location);
        setStartDate(toDateInput(item.startDate));
        setCoverImage(item.coverImage);
        setCapacity(String(item.capacity ?? 0));
        setPrice(String(item.price ?? 0));
        setRegistrationOpen(item.registrationOpen ?? true);
        setRegistrationType(item.registrationType ?? "internal");
        setExternalLink(item.externalLink ?? "");
        setIsPublished(item.isPublished);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title, description, content, instructor, area, modality, duration, location,
      startDate: startDate ? new Date(startDate).toISOString() : undefined,
      coverImage: coverImage ?? undefined,
      capacity: Number(capacity) || 0, price: Number(price) || 0,
      registrationOpen, registrationType, externalLink: externalLink || undefined, isPublished,
    };
    try {
      if (isNew) await api.post("/courses", payload, true);
      else await api.patch(`/courses/${id}`, payload);
      router.push("/admin/cursos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>;
  }

  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/cursos" label="Voltar aos cursos" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo curso" : "Editar curso"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Nome do curso/formação" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Formador"><TextInput value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Nome do formador" /></Field>
          <Field label="Área"><TextInput value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex.: Cardiologia" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Modalidade">
            <select value={modality} onChange={(e) => setModality(e.target.value as "presencial" | "online" | "misto")} aria-label="Modalidade" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-900">
              <option value="presencial">Presencial</option>
              <option value="online">Online</option>
              <option value="misto">Misto</option>
            </select>
          </Field>
          <Field label="Duração"><TextInput value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ex.: 20 horas / 3 dias" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Local"><TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Local ou plataforma" /></Field>
          <Field label="Data de início"><TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
        </div>
        <Field label="Descrição"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição" /></Field>
        <Field label="Conteúdo / Programa"><TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Programa detalhado do curso" /></Field>
        <MediaUpload label="Cartaz do curso" kind="image" value={coverImage} onChange={setCoverImage} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Vagas" hint="0 = ilimitadas"><TextInput type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} /></Field>
          <Field label="Preço (Kz)" hint="0 = gratuito"><TextInput type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <Toggle checked={registrationOpen} onChange={setRegistrationOpen} label="Inscrições abertas" />
          <Field label="Tipo de inscrição">
            <select value={registrationType} onChange={(e) => setRegistrationType(e.target.value as "internal" | "external")} aria-label="Tipo de inscrição" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-900">
              <option value="internal">Formulário no site (recolhe dados e comprovativos)</option>
              <option value="external">Link externo</option>
            </select>
          </Field>
          {registrationType === "external" && (
            <Field label="Link externo de inscrição"><TextInput type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." /></Field>
          )}
        </div>

        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />

        {!isNew && (
          <Link href={`/admin/cursos/${id}/inscricoes`} className="flex items-center gap-2 text-angola-navy font-medium hover:underline">
            <Users className="w-4 h-4" />Ver inscrições deste curso
          </Link>
        )}

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
