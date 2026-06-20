"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { ArticleItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function ArtigoFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [category, setCategory] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [doi, setDoi] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [coverImage, setCoverImage] = useState<Asset | null>(null);
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<ArticleItem>(`/revmed/admin/${id}`, true);
        setTitle(item.title);
        setSubtitle(item.subtitle);
        setAuthors(item.authors);
        setAffiliation(item.affiliation);
        setCategory(item.category);
        setAbstractText(item.abstract);
        setContent(item.content);
        setKeywords((item.keywords ?? []).join(", "));
        setDoi(item.doi);
        setExternalLink(item.externalLink);
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
      title, subtitle, authors, affiliation, category,
      abstract: abstractText, content,
      keywords: keywords ? keywords.split(",").map((k) => k.trim()).filter(Boolean) : [],
      doi, externalLink: externalLink || undefined,
      publishedAt: publishDate ? new Date(publishDate).toISOString() : undefined,
      coverImage: coverImage ?? undefined, pdf: pdf ?? undefined, isPublished,
    };
    try {
      if (isNew) await api.post("/revmed", payload, true);
      else await api.patch(`/revmed/${id}`, payload);
      router.push("/admin/revmed");
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
      <BackLink href="/admin/revmed" label="Voltar à RevMed" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo artigo" : "Editar artigo"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Título do artigo/pesquisa" />
        </Field>
        <Field label="Subtítulo">
          <TextInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo (opcional)" />
        </Field>
        <Field label="Autores" hint="Separe vários autores por vírgula.">
          <TextInput value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Dr. João Silva, Dra. Maria Costa" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Afiliação / Instituição">
            <TextInput value={affiliation} onChange={(e) => setAffiliation(e.target.value)} placeholder="Ex.: Hospital Américo Boavida" />
          </Field>
          <Field label="Área / Especialidade">
            <TextInput value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex.: Cardiologia" />
          </Field>
        </div>
        <Field label="Resumo (abstract)">
          <TextArea value={abstractText} onChange={(e) => setAbstractText(e.target.value)} placeholder="Resumo da pesquisa" />
        </Field>
        <Field label="Conteúdo completo">
          <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Texto completo ou resumo alargado" />
        </Field>
        <Field label="Palavras-chave" hint="Separe por vírgula.">
          <TextInput value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="diabetes, prevenção, Angola" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="DOI">
            <TextInput value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.1056/..." />
          </Field>
          <Field label="Data de publicação">
            <TextInput type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Link externo" hint="Se a pesquisa foi publicada noutra revista.">
          <TextInput type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
        </Field>
        <MediaUpload label="Imagem de capa" kind="image" value={coverImage} onChange={setCoverImage} />
        <MediaUpload label="Artigo em PDF (opcional)" kind="pdf" value={pdf} onChange={setPdf} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicado no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
