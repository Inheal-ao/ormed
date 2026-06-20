"use client";

import { useState } from "react";
import { Loader2, Check, Upload } from "lucide-react";
import { API_URL } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface RegistrationFormProps {
  /** ID do evento ou curso (a inscrição é guardada nesse registo). */
  targetId: string;
  price: number;
}

/**
 * Formulário público de inscrição (eventos e cursos). Recolhe dados +
 * comprovativo de pagamento e documentos, e envia para a API.
 */
export function RegistrationForm({ targetId, price }: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [docs, setDocs] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("email", email);
      form.append("phone", phone);
      form.append("notes", notes);
      if (proof) form.append("paymentProof", proof);
      docs.forEach((d) => form.append("documents", d));

      const res = await fetch(`${API_URL}/event-registrations/${targetId}`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha na inscrição.",
        );
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao inscrever.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Inscrição recebida!</h3>
        <p className="text-gray-600">
          A sua inscrição foi registada. A equipa da Ordem irá validar os seus dados.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-angola-gold outline-none text-gray-900";

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Inscrição</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
        <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} placeholder="O seu nome" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" className={inputClass} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+244 ..." />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea className={`${inputClass} min-h-[80px]`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Mensagem (opcional)" />
      </div>

      {price > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comprovativo de pagamento ({formatCurrency(price)})
          </label>
          <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
            <Upload className="w-4 h-4" />
            {proof ? proof.name : "Carregar comprovativo (imagem ou PDF)"}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setProof(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Documentos (opcional)</label>
        <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-angola-gold cursor-pointer">
          <Upload className="w-4 h-4" />
          {docs.length > 0 ? `${docs.length} ficheiro(s)` : "Anexar documentos pessoais"}
          <input type="file" accept="image/*,application/pdf" multiple className="hidden" onChange={(e) => setDocs(Array.from(e.target.files ?? []))} />
        </label>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}

      <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        Confirmar inscrição
      </button>
    </form>
  );
}
