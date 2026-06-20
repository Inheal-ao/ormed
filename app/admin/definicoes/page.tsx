"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { api } from "@/lib/api";
import { SiteSettings } from "@/lib/admin-types";
import { Field, TextInput, SaveButton } from "@/components/admin/admin-ui";

export default function DefinicoesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettings>({
    phone: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const s = await api.get<SiteSettings>("/settings");
        setForm({
          phone: s.phone ?? "",
          email: s.email ?? "",
          address: s.address ?? "",
          facebook: s.facebook ?? "",
          instagram: s.instagram ?? "",
          linkedin: s.linkedin ?? "",
          youtube: s.youtube ?? "",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const set = (key: keyof SiteSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api.put("/settings", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Definições do site</h1>
      <p className="text-gray-500 text-sm mb-6">Contactos e redes sociais mostrados no site público.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Contactos</h2>
          <Field label="Telefone">
            <TextInput value={form.phone} onChange={set("phone")} placeholder="+244 ..." />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={form.email} onChange={set("email")} placeholder="geral@ordemdosmedicos.ao" />
          </Field>
          <Field label="Morada">
            <TextInput value={form.address} onChange={set("address")} placeholder="Luanda, Angola" />
          </Field>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Redes sociais</h2>
          <Field label="Facebook">
            <TextInput value={form.facebook} onChange={set("facebook")} placeholder="https://facebook.com/..." />
          </Field>
          <Field label="Instagram">
            <TextInput value={form.instagram} onChange={set("instagram")} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="LinkedIn">
            <TextInput value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/..." />
          </Field>
          <Field label="YouTube">
            <TextInput value={form.youtube} onChange={set("youtube")} placeholder="https://youtube.com/..." />
          </Field>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

        <div className="flex items-center gap-3">
          <SaveButton saving={saving} />
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Guardado
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
