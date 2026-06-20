"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { BulletinItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function BoletimFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<BulletinItem>(`/bulletins/admin/${id}`, true);
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
    })();
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      title, edition, year: year ? Number(year) : undefined, description,
      coverImage: coverImage ?? undefined, pdf: pdf ?? undefined, isPublished,
    };
    try {
      if (isNew) await api.post("/bulletins", payload, true);
      else await api.patch(`/bulletins/${id}`, payload);
      router.push("/admin/boletins");
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
      <BackLink href="/admin/boletins" label="Voltar aos boletins" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo boletim" : "Editar boletim"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: Boletim Informativo" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Edição"><TextInput value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="Ex.: Nº 5" /></Field>
          <Field label="Ano"><TextInput type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" /></Field>
        </div>
        <Field label="Descrição"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
        <MediaUpload label="Capa" kind="image" value={coverImage} onChange={setCoverImage} />
        <MediaUpload label="Ficheiro PDF" kind="pdf" value={pdf} onChange={setPdf} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
