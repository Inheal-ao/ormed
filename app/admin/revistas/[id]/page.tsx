"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { MagazineItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function RevistaFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [year, setYear] = useState<string>("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const item = await api.get<MagazineItem>(`/magazines/admin/${id}`, true);
        setTitle(item.title);
        setEdition(item.edition);
        setYear(item.year ? String(item.year) : "");
        setDescription(item.description);
        setCoverImage(item.coverImage);
        setPdf(item.pdf);
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
    if (isPublished && !pdf?.url) {
      setError("É necessário carregar o PDF para publicar a revista.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      title,
      edition,
      year: year ? Number(year) : undefined,
      description,
      coverImage: coverImage ?? undefined,
      pdf: pdf ?? undefined,
      isPublished,
    };
    try {
      if (isNew) await api.post("/magazines", payload, true);
      else await api.patch(`/magazines/${id}`, payload);
      router.push("/admin/revistas");
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
      <BackLink href="/admin/revistas" label="Voltar às revistas" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Nova edição" : "Editar edição"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: Revista ORMED" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Edição">
            <TextInput value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="Ex.: Nº 12" />
          </Field>
          <Field label="Ano">
            <TextInput type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" />
          </Field>
        </div>
        <Field label="Descrição">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Resumo dos conteúdos desta edição" />
        </Field>
        <MediaUpload label="Capa" kind="image" value={coverImage} onChange={setCoverImage} />
        <MediaUpload label="Ficheiro PDF" kind="pdf" value={pdf} onChange={setPdf} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicada no site (requer PDF)" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
