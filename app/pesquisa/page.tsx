"use client";

import { useState } from "react";
import { FlaskConical, Loader2, Check, Send } from "lucide-react";
import { API_URL } from "@/lib/api";

const SUPPORT_TYPES = [
  "Orientação metodológica",
  "Apoio estatístico",
  "Revisão de artigo",
  "Financiamento / Bolsa",
  "Publicação / Divulgação",
  "Parceria / Colaboração",
  "Outro",
];

export default function PesquisaPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [supportType, setSupportType] = useState(SUPPORT_TYPES[0]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/research-support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, supportType, message }),
      });
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
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-gold/20 text-angola-gold text-sm font-medium mb-4">
            <FlaskConical className="w-4 h-4" />
            Investigação
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Apoio à Pesquisa Científica</h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl">
            A Ordem apoia os médicos na sua atividade de investigação. Diga-nos que apoio precisa
            e a nossa equipa entrará em contacto.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16">
        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Pedido enviado!</h2>
            <p className="text-gray-600">A equipa da Ordem irá analisar o seu pedido e entrar em contacto.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Pedir apoio</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <input className={inputClass} required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className={inputClass} required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Contacto</label>
                <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Que apoio precisa?</label>
              <select value={supportType} onChange={(e) => setSupportType(e.target.value)} aria-label="Tipo de apoio" className={inputClass}>
                {SUPPORT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descreva o seu pedido</label>
              <textarea className={`${inputClass} min-h-[120px]`} required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Detalhe a sua pesquisa e o apoio que necessita..." />
            </div>
            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-angola-navy text-white font-semibold py-3 rounded-lg hover:brightness-110 disabled:opacity-60">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar pedido
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
