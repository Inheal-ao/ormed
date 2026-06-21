"use client";

import { useState } from "react";
import { ShieldAlert, Loader2, Check, Send, Upload, Lock } from "lucide-react";
import { API_URL } from "@/lib/api";

const CATEGORIES = [
  { value: "medico", label: "Conduta de um médico" },
  { value: "ordem", label: "Funcionário / serviços da Ordem" },
  { value: "atraso", label: "Atraso ou reclamação de serviço" },
  { value: "outro", label: "Outra situação" },
];

export default function DenunciasPage() {
  const [category, setCategory] = useState("medico");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("category", category);
      form.append("subject", subject);
      form.append("description", description);
      form.append("isAnonymous", String(isAnonymous));
      if (!isAnonymous) {
        form.append("name", name);
        form.append("email", email);
        form.append("phone", phone);
      }
      if (externalLink) form.append("externalLink", externalLink);
      files.forEach((f) => form.append("attachments", f));

      const res = await fetch(`${API_URL}/complaints`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao enviar.");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-angola-gold outline-none text-gray-900";

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            <ShieldAlert className="w-4 h-4" />
            Ética & Deontologia
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Denúncias e Reclamações</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            Denuncie condutas de médicos ou funcionários da Ordem, ou apresente uma reclamação.
            Toda a informação é tratada com confidencialidade.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Recebido</h2>
            <p className="text-gray-600">A sua denúncia/reclamação foi registada e será analisada pela equipa da Ordem.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Categoria">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
              <input className={inputClass} required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Resumo da situação" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição detalhada</label>
              <textarea className={`${inputClass} min-h-[140px]`} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o que aconteceu, com datas, locais e pessoas envolvidas..." />
            </div>

            {/* Provas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Provas (opcional)</label>
              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
                <Upload className="w-4 h-4" />
                {files.length > 0 ? `${files.length} ficheiro(s)` : "Anexar imagens ou PDF"}
                <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
              </label>
              <input className={`${inputClass} mt-2`} type="url" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="Ou link de vídeo/prova (YouTube, Drive, etc.)" />
            </div>

            {/* Anónimo */}
            <label className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 cursor-pointer">
              <input type="checkbox" aria-label="Submeter de forma anónima" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-4 h-4 accent-angola-navy" />
              <span className="flex items-center gap-1.5 text-sm text-gray-700">
                <Lock className="w-4 h-4 text-angola-gold" />
                Submeter de forma anónima (sem os meus dados)
              </span>
            </label>

            {!isAnonymous && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="O seu nome" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </button>
            <p className="text-xs text-gray-400 text-center">A informação é confidencial e usada apenas para análise interna.</p>
          </form>
        )}
      </div>
    </div>
  );
}
