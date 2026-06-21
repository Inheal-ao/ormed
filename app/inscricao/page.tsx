"use client";

import { useState } from "react";
import {
  UserPlus, CheckCircle, ChevronRight, ChevronLeft, Upload,
  FileText, GraduationCap, Loader2, Copy, Check, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { API_URL } from "@/lib/api";
import { ConsultPanel } from "@/components/service-portal";
import { Turnstile, captchaEnabled, captchaHeaders } from "@/components/turnstile";

const steps = [
  { id: 1, title: "Dados Pessoais", icon: UserPlus },
  { id: 2, title: "Formação", icon: GraduationCap },
  { id: 3, title: "Documentos", icon: FileText },
];

const DOCS = [
  { key: "diploma", label: "Diploma de Licenciatura", required: true },
  { key: "habilitacoes", label: "Certificado de Habilitações", required: true },
  { key: "bi", label: "Bilhete de Identidade", required: true },
  { key: "foto", label: "Fotografia tipo passe", required: true },
  { key: "residencia", label: "Certificado de Residência", required: false },
  { key: "especialidade", label: "Comprovativo de Especialidade", required: false },
];

export default function InscricaoPage() {
  const [tab, setTab] = useState<"inscrever" | "consultar">("inscrever");
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nome: "", dataNascimento: "", bi: "", nif: "", email: "", telefone: "", morada: "",
    universidade: "", curso: "", anoConclusao: "", especialidade: "", cedula: "",
  });
  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 3));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const submit = async () => {
    setError(null);
    if (!form.nome.trim() || !form.telefone.trim()) {
      setError("Preencha o nome e o telefone (passo 1).");
      return;
    }
    const missing = DOCS.filter((d) => d.required && !docs[d.key]);
    if (missing.length > 0) {
      setError(`Anexe os documentos obrigatórios: ${missing.map((d) => d.label).join(", ")}.`);
      return;
    }
    if (captchaEnabled && !captchaToken) {
      setError("Complete a verificação anti-spam.");
      return;
    }
    setSubmitting(true);
    try {
      const details = [
        `Nome: ${form.nome}`,
        `Data de nascimento: ${form.dataNascimento}`,
        `Bilhete de Identidade: ${form.bi}`,
        `NIF: ${form.nif}`,
        `Email: ${form.email}`,
        `Telefone: ${form.telefone}`,
        `Morada: ${form.morada}`,
        `Universidade: ${form.universidade}`,
        `Curso: ${form.curso}`,
        `Ano de conclusão: ${form.anoConclusao}`,
        `Especialidade: ${form.especialidade || "—"}`,
        `Cédula profissional: ${form.cedula || "—"}`,
      ].join("\n");

      const fd = new FormData();
      fd.append("serviceType", "inscricao");
      fd.append("requesterName", form.nome);
      fd.append("ownerName", form.nome);
      if (form.email) fd.append("email", form.email);
      fd.append("phone", form.telefone);
      fd.append("details", details);
      DOCS.forEach((d) => {
        const f = docs[d.key];
        if (f) fd.append("attachments", f, `${d.label} - ${f.name}`);
      });

      const res = await fetch(`${API_URL}/service-requests`, { method: "POST", body: fd, headers: captchaHeaders(captchaToken) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao enviar.");
      }
      const data = await res.json();
      setCode(data.serviceCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  // Ecrã de sucesso com o código
  if (code) {
    return (
      <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Inscrição enviada para avaliação!</h2>
            <p className="text-gray-600 mb-4">Guarde o seu <strong>código de serviço</strong> para acompanhar o processo e, após a avaliação, efetuar o pagamento.</p>
            <div className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-angola-gold rounded-xl px-4 py-3 mb-2">
              <span className="text-2xl font-mono font-bold text-angola-navy tracking-wider">{code}</span>
              <button type="button" onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="p-2 text-gray-400 hover:text-angola-navy" aria-label="Copiar código">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600">Código copiado!</p>}
            <button type="button" onClick={() => { setCode(null); setTab("consultar"); }} className="mt-4 text-sm text-angola-blue hover:underline">
              Consultar estado da inscrição →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-cream text-angola-gold text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4" /> Inscrição
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Inscreva-se na ORMED</h1>
          <p className="text-gray-600 dark:text-gray-400">Preencha o formulário para se tornar membro da Ordem dos Médicos de Angola</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
          <button type="button" onClick={() => setTab("inscrever")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === "inscrever" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>Nova Inscrição</button>
          <button type="button" onClick={() => setTab("consultar")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${tab === "consultar" ? "bg-white shadow text-angola-navy" : "text-gray-500"}`}>Consultar Estado</button>
        </div>

        {tab === "consultar" ? (
          <div className="max-w-2xl mx-auto"><ConsultPanel paid /></div>
        ) : (
          <>
            {/* Progresso */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step.id <= currentStep ? "bg-angola-navy text-white" : "bg-gray-200 text-gray-500"}`}>
                      {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
                    </div>
                    <span className={`hidden md:block ml-2 text-sm font-medium ${step.id <= currentStep ? "text-gray-900" : "text-gray-400"}`}>{step.title}</span>
                    {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step.id < currentStep ? "bg-angola-navy" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
              <Progress value={(currentStep / 3) * 100} className="h-2" />
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Nome Completo"><Input placeholder="Nome completo" value={form.nome} onChange={(e) => set("nome", e.target.value)} /></Field>
                      <Field label="Data de Nascimento"><Input type="date" value={form.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} /></Field>
                      <Field label="Nº do Bilhete de Identidade"><Input placeholder="000000000LA000" value={form.bi} onChange={(e) => set("bi", e.target.value)} /></Field>
                      <Field label="NIF"><Input placeholder="Número de identificação fiscal" value={form.nif} onChange={(e) => set("nif", e.target.value)} /></Field>
                      <Field label="Email"><Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => set("email", e.target.value)} /></Field>
                      <Field label="Telefone"><Input placeholder="+244 9xx xxx xxx" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} /></Field>
                    </div>
                    <Field label="Morada"><Input placeholder="Rua, número, bairro, cidade" value={form.morada} onChange={(e) => set("morada", e.target.value)} /></Field>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Formação Académica</h2>
                    <Field label="Universidade"><Input placeholder="Nome da universidade" value={form.universidade} onChange={(e) => set("universidade", e.target.value)} /></Field>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Curso"><Input placeholder="Licenciatura em Medicina" value={form.curso} onChange={(e) => set("curso", e.target.value)} /></Field>
                      <Field label="Ano de Conclusão"><Input placeholder="2020" value={form.anoConclusao} onChange={(e) => set("anoConclusao", e.target.value)} /></Field>
                    </div>
                    <Field label="Especialidade (se aplicável)"><Input placeholder="Ex: Medicina Interna" value={form.especialidade} onChange={(e) => set("especialidade", e.target.value)} /></Field>
                    <Field label="Nº da Cédula Profissional"><Input placeholder="Número da cédula (se já possuir)" value={form.cedula} onChange={(e) => set("cedula", e.target.value)} /></Field>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Documentos Necessários</h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {DOCS.map((doc) => {
                        const file = docs[doc.key];
                        return (
                          <label key={doc.key} className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer block ${file ? "border-green-400 bg-green-50" : "border-gray-200 dark:border-gray-700 hover:border-angola-gold hover:bg-angola-cream"}`}>
                            {file ? <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" /> : <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />}
                            <p className="text-sm font-medium text-gray-700 mb-1">{doc.label}</p>
                            <p className="text-xs text-gray-400 truncate">{file ? file.name : `${doc.required ? "Obrigatório" : "Opcional"} · PDF, JPG ou PNG`}</p>
                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setDocs((p) => ({ ...p, [doc.key]: e.target.files?.[0] ?? null }))} />
                          </label>
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-500 bg-angola-cream/60 border border-angola-gold/20 rounded-lg p-3">
                      Após enviar, a sua inscrição será <strong>avaliada pela Ordem</strong>. Receberá um código de serviço para acompanhar o estado e, após aprovação, as <strong>coordenadas e o valor a pagar</strong> aparecerão no separador "Consultar Estado".
                    </p>
                    {currentStep === 3 && <Turnstile onToken={setCaptchaToken} />}
                    {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
                  </div>
                )}

                {/* Navegação */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Anterior
                  </Button>
                  {currentStep < 3 ? (
                    <Button className="bg-angola-navy hover:bg-angola-blue" onClick={nextStep}>
                      Próximo <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="bg-angola-navy hover:bg-angola-blue" onClick={submit} disabled={submitting}>
                      {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                      Enviar para Avaliação
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
