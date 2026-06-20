"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { AnnouncementItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton, CategorySelect } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";
import { CATEGORIES } from "@/lib/categories";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function ComunicadoFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Geral");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<AnnouncementItem>(`/announcements/admin/${id}`, true);
        setTitle(item.title);
        setCategory(item.category);
        setContent(item.content);
        setPublishDate(toDateInput(item.publishedAt));
        setCoverImage(item.coverImage);
        setPdf(item.pdf);
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
      title, category, content,
      publishedAt: publishDate ? new Date(publishDate).toISOString() : undefined,
      coverImage: coverImage ?? undefined, pdf: pdf ?? undefined, isPublished,
    };
    try {
      if (isNew) await api.post("/announcements", payload, true);
      else await api.patch(`/announcements/${id}`, payload);
      router.push("/admin/comunicados");
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
      <BackLink href="/admin/comunicados" label="Voltar aos comunicados" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo comunicado" : "Editar comunicado"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título do comunicado" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoria"><CategorySelect value={category} onChange={setCategory} options={CATEGORIES} /></Field>
          <Field label="Data"><TextInput type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} /></Field>
        </div>
        <Field label="Conteúdo"><TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Texto do comunicado" /></Field>
        <MediaUpload label="Imagem (opcional)" kind="image" value={coverImage} onChange={setCoverImage} />
        <MediaUpload label="Documento PDF (opcional)" kind="pdf" value={pdf} onChange={setPdf} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
