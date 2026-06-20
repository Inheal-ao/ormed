"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, FileText, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { DocumentItem, Asset } from "@/lib/admin-types";
import { PageHeader, Field, TextInput, TextArea } from "@/components/admin/admin-ui";
import { MediaUpload } from "@/components/admin/media-upload";
import { DOC_CATEGORIES, docCategoryLabel } from "@/lib/doc-categories";

export default function DocumentosPage() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // formulário
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(DOC_CATEGORIES[0].value);
  const [description, setDescription] = useState("");
  const [pdf, setPdf] = useState<Asset | null>(null);
  const [externalLink, setExternalLink] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<DocumentItem[]>("/documents/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf && !externalLink) {
      setError("Carregue um PDF ou indique um link externo.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.post(
        "/documents",
        { title, category, description, pdf: pdf ?? undefined, externalLink: externalLink || undefined },
        true,
      );
      setTitle("");
      setDescription("");
      setPdf(null);
      setExternalLink("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar este documento?")) return;
    setDeleting(id);
    try {
      await api.delete(`/documents/${id}`);
      setItems((prev) => prev.filter((d) => d._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Documentos institucionais" description="Estatutos, códigos, regulamentos e normas em PDF." />

      <form onSubmit={add} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 mb-8">
        <h2 className="font-semibold text-gray-900">Adicionar documento</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Título">
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Ex.: Estatutos da ORMED" />
          </Field>
          <Field label="Categoria (página)">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Categoria do documento"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none text-gray-900"
            >
              {DOC_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Descrição (opcional)">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>
        <MediaUpload label="Ficheiro PDF" kind="pdf" value={pdf} onChange={setPdf} />
        <Field label="Ou link externo" hint="Em vez do PDF.">
          <TextInput type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
        </Field>
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Adicionar
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-10">Ainda não há documentos.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y">
          {items.map((d) => (
            <div key={d._id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-angola-navy/5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-angola-navy" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{d.title}</p>
                <p className="text-xs text-gray-500">{docCategoryLabel(d.category)}</p>
              </div>
              <button type="button" onClick={() => remove(d._id)} disabled={deleting === d._id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Eliminar">
                {deleting === d._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
