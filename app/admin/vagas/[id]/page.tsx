"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { JobItem } from "@/lib/admin-types";
import { BackLink, Field, TextInput, TextArea, Toggle, SaveButton } from "@/components/admin/admin-ui";

function toDateInput(value: string | null): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function VagaFormPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "novo";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [entity, setEntity] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [applicationEmail, setApplicationEmail] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const item = await api.get<JobItem>(`/jobs/admin/${id}`, true);
        setTitle(item.title);
        setEntity(item.entity);
        setLocation(item.location);
        setType(item.type);
        setDescription(item.description);
        setRequirements(item.requirements);
        setDeadline(toDateInput(item.deadline));
        setApplicationEmail(item.applicationEmail);
        setExternalLink(item.externalLink);
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
      title, entity, location, type, description, requirements,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      applicationEmail: applicationEmail || undefined,
      externalLink: externalLink || undefined,
      isPublished,
    };
    try {
      if (isNew) await api.post("/jobs", payload, true);
      else await api.patch(`/jobs/${id}`, payload);
      router.push("/admin/vagas");
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
      <BackLink href="/admin/vagas" label="Voltar às vagas" />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{isNew ? "Nova vaga" : "Editar vaga"}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Cargo / Título">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: Médico Especialista em Pediatria" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Entidade / Empregador"><TextInput value={entity} onChange={(e) => setEntity(e.target.value)} placeholder="Ex.: Hospital Geral de Luanda" /></Field>
          <Field label="Local"><TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex.: Luanda" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo"><TextInput value={type} onChange={(e) => setType(e.target.value)} placeholder="Ex.: Tempo inteiro" /></Field>
          <Field label="Prazo de candidatura"><TextInput type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></Field>
        </div>
        <Field label="Descrição"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição da função" /></Field>
        <Field label="Requisitos"><TextArea value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requisitos e qualificações" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email de candidatura"><TextInput type="email" value={applicationEmail} onChange={(e) => setApplicationEmail(e.target.value)} placeholder="rh@exemplo.ao" /></Field>
          <Field label="Ou link externo"><TextInput type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." /></Field>
        </div>
        <Toggle checked={isPublished} onChange={setIsPublished} label="Publicada no site" />
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <SaveButton saving={saving} />
      </form>
    </div>
  );
}
