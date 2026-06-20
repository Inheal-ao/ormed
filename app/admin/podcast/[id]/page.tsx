"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PodcastItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function PodcastFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [episode, setEpisode] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<PodcastItem>(`/podcast/admin/${id}`, true);
        setTitle(item.title);
        setEpisode(item.episode);
        setYoutubeUrl(item.youtubeUrl);
        setDescription(item.description);
        setCoverImage(item.coverImage);
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
      title, episode, youtubeUrl, description,
      coverImage: coverImage ?? undefined, isPublished,
    };
    try {
      if (isNew) await api.post("/podcast", payload, true);
      else await api.patch(`/podcast/${id}`, payload);
      router.push("/admin/podcast");
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
      <BackLink href="/admin/podcast" label="Voltar ao podcast" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo episódio" : "Editar episódio"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título do episódio" />
        </Field>
        <Field label="Episódio">
          <TextInput value={episode} onChange={(e) => setEpisode(e.target.value)} placeholder="Ex.: Episódio #1" />
        </Field>
        <Field label="Link do YouTube" hint="Cole o endereço do vídeo no YouTube.">
          <TextInput type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} required placeholder="https://youtube.com/watch?v=..." />
        </Field>
        <Field label="Descrição"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <MediaUpload label="Miniatura (opcional)" kind="image" value={coverImage} onChange={setCoverImage} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
