"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { NewsItem, Asset } from "@/lib/admin-types";
import {
  BackLink,
  Field,
  TextInput,
  TextArea,
  Toggle,
  SaveButton,
} from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";
import { MultiImageUpload } from "@/components/admin/multi-image-upload";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function NoticiaFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Geral");
  const [source, setSource] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [images, setImages] = useState<Asset[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const item = await api.get<NewsItem>(`/news/admin/${id}`, true);
        setTitle(item.title);
        setSubtitle(item.subtitle ?? "");
        setCategory(item.category);
        setSource(item.source ?? "");
        setPublishDate(toDateInput(item.publishedAt));
        setExcerpt(item.excerpt);
        setContent(item.content);
        setCoverImage(item.coverImage);
        setImages(item.images ?? []);
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
      subtitle,
      category,
      source,
      publishedAt: publishDate ? new Date(publishDate).toISOString() : undefined,
      excerpt,
      content,
      coverImage: coverImage ?? undefined,
      images,
      isPublished,
    };
    try {
      if (isNew) {
        await api.post("/news", payload, true);
      } else {
        await api.patch(`/news/${id}`, payload);
      }
      router.push("/admin/noticias");
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
      <BackLink href="/admin/noticias" label="Voltar às notícias" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? "Nova notícia" : "Editar notícia"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título da notícia" />
        </Field>

        <Field label="Subtítulo" hint="Linha secundária, mostrada por baixo do título.">
          <TextInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo (opcional)" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Categoria">
            <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex.: Institucional" />
          </Field>
          <Field label="Data de publicação">
            <TextInput type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
          </Field>
        </div>

        <Field label="Fonte" hint="Origem da notícia (ex.: Jornal de Angola, link, autor).">
          <TextInput value={source} onChange={(e) => setSource(e.target.value)} placeholder="Fonte (opcional)" />
        </Field>

        <Field label="Resumo" hint="Texto curto mostrado na listagem.">
          <TextArea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Breve resumo da notícia" />
        </Field>

        <Field label="Conteúdo">
          <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Conteúdo completo da notícia" />
        </Field>

        <MediaUpload label="Imagem de capa" kind="image" value={coverImage} onChange={setCoverImage} />

        <MultiImageUpload label="Fotos adicionais (carrossel)" value={images} onChange={setImages} />

        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicada no site" />

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
