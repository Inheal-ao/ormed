"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { EventItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function EventoFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const item = await api.get<EventItem>(`/events/admin/${id}`, true);
        setTitle(item.title);
        setLocation(item.location);
        setDescription(item.description);
        setContent(item.content);
        setStartDate(toDateInput(item.startDate));
        setEndDate(toDateInput(item.endDate));
        setCoverImage(item.coverImage);
        setIsPublished(item.isPublished);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title,
      location,
      description,
      content,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      coverImage: coverImage ?? undefined,
      isPublished,
    };
    try {
      if (isNew) await api.post("/events", payload, true);
      else await api.patch(`/events/${id}`, payload);
      router.push("/admin/eventos");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-angola-gold" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <BackLink href="/admin/eventos" label="Voltar aos eventos" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo evento" : "Editar evento"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Nome do evento" />
        </Field>
        <Field label="Local">
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex.: Luanda, Centro de Convenções" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Data de início">
            <TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </Field>
          <Field label="Data de fim" hint="Opcional">
            <TextInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Descrição">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição" />
        </Field>
        <Field label="Conteúdo">
          <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Detalhes do evento" />
        </Field>
        <MediaUpload label="Imagem de capa" kind="image" value={coverImage} onChange={setCoverImage} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
