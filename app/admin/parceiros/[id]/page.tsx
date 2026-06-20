"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { PartnerItem, Asset } from "@/lib/admin-types";
import { BackLink, Field, TextInput, Toggle, SaveButton } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";

export default function ParceiroFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [order, setOrder] = useState("0");
  const [logo, setLogo] = useState<Asset | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (isNew) return;
    const load = async () => {
      try {
        const item = await api.get<PartnerItem>(`/partners/admin/all`, true).then((arr) =>
          (arr as unknown as PartnerItem[]).find((p) => p._id === id),
        );
        if (item) {
          setName(item.name);
          setWebsite(item.website);
          setOrder(String(item.order));
          setLogo(item.logo);
          setIsPublished(item.isPublished);
        }
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
      website: website || undefined,
      order: Number(order) || 0,
      logo: logo ?? undefined,
      isPublished,
    };
    try {
      if (isNew) await api.post("/partners", payload, true);
      else await api.patch(`/partners/${id}`, payload);
      router.push("/admin/parceiros");
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
      <BackLink href="/admin/parceiros" label="Voltar aos parceiros" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Novo parceiro" : "Editar parceiro"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nome">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome do parceiro" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Website" hint="Opcional">
            <TextInput type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Ordem">
            <TextInput type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
          </Field>
        </div>
        <MediaUpload label="Logótipo" kind="image" value={logo} onChange={setLogo} />
        <Toggle checked={isPublished} onChange={setIsPublished} label="Visível no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
