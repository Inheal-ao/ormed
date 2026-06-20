"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { BastonarioItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function BastonarioFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [mandate, setMandate] = useState("");
  const [bio, setBio] = useState("");
  const [order, setOrder] = useState("0");
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const item = await api.get<BastonarioItem>(`/bastonarios/admin/${id}`, true);
        setName(item.name);
        setMandate(item.mandate);
        setBio(item.bio);
        setOrder(String(item.order));
        setPhoto(item.photo);
        setIsCurrent(item.isCurrent);
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
      name,
      mandate,
      bio,
      order: Number(order) || 0,
      photo: photo ?? undefined,
      isCurrent,
      isPublished,
    };
    try {
      if (isNew) await api.post("/bastonarios", payload, true);
      else await api.patch(`/bastonarios/${id}`, payload);
      router.push("/admin/bastonarios");
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
      <BackLink href="/admin/bastonarios" label="Voltar aos bastonários" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo bastonário" : "Editar bastonário"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nome">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome completo" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mandato">
            <TextInput value={mandate} onChange={(e) => setMandate(e.target.value)} placeholder="Ex.: 2015 - 2020" />
          </Field>
          <Field label="Ordem" hint="Posição na lista (menor primeiro)">
            <TextInput type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </Field>
        </div>
        <Field label="Biografia">
          <TextArea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Breve biografia" />
        </Field>
        <MediaUpload label="Fotografia" kind="image" value={photo} onChange={setPhoto} />
        <Toggle checked={isCurrent} onChange={setIsCurrent} label="Bastonário em exercício" />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Visível no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
