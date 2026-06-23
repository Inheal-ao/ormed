"use client";

import { useState } from "react";
import {
  UserPlus, GraduationCap, FileText, CheckCircle, ChevronLeft, ChevronRight,
  Loader2, Send, Copy, Check, Upload,
} from "lucide-react";
import { API_URL } from "@/lib/api";

const STEPS = [
  { id: 1, title: "Dados Pessoais", icon: UserPlus },
  { id: 2, title: "Dados Profissionais", icon: GraduationCap },
  { id: 3, title: "Documentos", icon: FileText },
];

const ESTADO_CIVIL = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União de facto"];
const GENERO = ["Masculino", "Feminino"];
const SANGUE = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

// Modelos de documentos consoante nacionalidade / onde estudou
const COMMON_C: { key: string; label: string }[] = [
  { key: "foto", label: "Fotografia" },
  { key: "passaporte", label: "Passaporte" },
  { key: "atestado", label: "Atestado Médico" },
  { key: "registo", label: "Registo Criminal" },
  { key: "requerimento", label: "Requerimento solicitando inscrição" },
  { key: "cert_lic", label: "Certificado de Licenciatura" },
  { key: "diploma", label: "Diploma" },
  { key: "residencia", label: "Autorização de Residência" },
  { key: "inaares", label: "Certificado de reconhecimento de estudos homologado pelo INAARES" },
  { key: "atestado_origem", label: "Atestado emitido pelo estado de origem ou proveniência" },
  { key: "cert_ordem_origem", label: "Certificado passado pela Ordem dos Médicos do país de origem" },
  { key: "contrato", label: "Contrato de vínculo laboral com a entidade empregadora" },
  { key: "registo_consular", label: "Registo consular da representação do país de nacionalidade" },
];

const DOC_MODELS: Record<string, { desc: string; docs: { key: string; label: string }[] }> = {
  A: {
    desc: "Médicos angolanos com licenciatura angolana",
    docs: [
      { key: "foto", label: "Fotografia" },
      { key: "bi", label: "Bilhete" },
      { key: "atestado", label: "Atestado Médico" },
      { key: "registo", label: "Registo Criminal" },
      { key: "requerimento", label: "Requerimento solicitando inscrição" },
      { key: "cert_lic", label: "Certificado de Licenciatura" },
      { key: "diploma", label: "Diploma" },
      { key: "programa", label: "Programa Curricular" },
    ],
  },
  B: {
    desc: "Médicos angolanos com licenciatura estrangeira (também medicina dentária)",
    docs: [
      { key: "foto", label: "Fotografia" },
      { key: "bi", label: "Bilhete" },
      { key: "atestado", label: "Atestado Médico" },
      { key: "registo", label: "Registo Criminal" },
      { key: "requerimento", label: "Requerimento solicitando inscrição" },
      { key: "programa", label: "Programa curricular das disciplinas do curso" },
      { key: "diploma_notas", label: "Diploma com notas descriminadas e carga horária" },
      { key: "inaares", label: "Certificado de reconhecimento de estudos homologado pelo INAARES" },
      { key: "cert_notas", label: "Certificado com notas descriminadas e carga horária" },
    ],
  },
  C: { desc: "Médicos estrangeiros residentes", docs: COMMON_C },
  D: { desc: "Médicos estrangeiros residentes temporariamente em Angola por contrato", docs: COMMON_C },
  E: {
    desc: "Médicos estrangeiros com licenciatura angolana",
    docs: [
      { key: "foto", label: "Fotografia" },
      { key: "passaporte", label: "Passaporte" },
      { key: "atestado", label: "Atestado Médico" },
      { key: "registo", label: "Registo Criminal" },
      { key: "requerimento", label: "Requerimento solicitando inscrição" },
      { key: "cert_lic", label: "Certificado de Licenciatura" },
      { key: "diploma", label: "Diploma" },
    ],
  },
};

const EMPTY_FORM = {
  nome: "", estadoCivil: "", genero: "", grupoSanguineo: "", dataNascimento: "",
  biPassaporte: "", nif: "", emitidoEm: "", validoAte: "", biVitalicio: false,
  nomePai: "", nomeMae: "", nacionalidade: "", nacionalidadeAlt: "", residencia: "",
  provincia: "", municipio: "", comuna: "", distrito: "", email: "", telefone: "", telefoneAlt: "",
  // profissionais
  licenciaturaEm: "", universidade: "", paisFormacao: "", dataConclusao: "",
  trabalho: false, entidadePatronal: "", enderecoTrabalho: "",
  espEm: "", espLocal: "", espPais: "", espData: "",
  subEm: "", subLocal: "", subPais: "", subData: "",
  posEm: "", posLocal: "", posPais: "", posData: "",
  mestEm: "", mestLocal: "", mestPais: "", mestData: "",
  doutEm: "", doutLocal: "", doutPais: "", doutData: "",
};

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

export default function InscricaoPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [model, setModel] = useState("A");
  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      const req: [string, string][] = [
        ["nome", "Nome Completo"], ["estadoCivil", "Estado Civil"], ["genero", "Género"],
        ["grupoSanguineo", "Grupo Sanguíneo"], ["dataNascimento", "Data de Nascimento"],
        ["biPassaporte", "Nº Bilhete/Passaporte"], ["nomePai", "Nome do Pai"], ["nomeMae", "Nome da Mãe"],
        ["nacionalidade", "Nacionalidade"], ["residencia", "Local de Residência"],
        ["provincia", "Província"], ["municipio", "Município"], ["email", "Email"], ["telefone", "Nº Telefone Principal"],
      ];
      const m = req.find(([k]) => !String(form[k as keyof typeof form]).trim());
      if (m) return `Preencha: ${m[1]}.`;
    }
    if (s === 2) {
      const req: [string, string][] = [
        ["licenciaturaEm", "Licenciado(a) em"], ["universidade", "Universidade de Formação"],
        ["paisFormacao", "País de Formação"], ["dataConclusao", "Data de Conclusão"],
      ];
      const m = req.find(([k]) => !String(form[k as keyof typeof form]).trim());
      if (m) return `Preencha: ${m[1]}.`;
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    setStep((p) => Math.min(p + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prev = () => { setError(null); setStep((p) => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const buildDetails = () => {
    const L = (label: string, v: string | boolean) => (v ? `${label}: ${v === true ? "Sim" : v}\n` : "");
    const modelDocs = DOC_MODELS[model];
    return (
      "=== DADOS PESSOAIS ===\n" +
      L("Nome", form.nome) + L("Estado civil", form.estadoCivil) + L("Género", form.genero) +
      L("Grupo sanguíneo", form.grupoSanguineo) + L("Data de nascimento", form.dataNascimento) +
      L("BI/Passaporte", form.biPassaporte) + L("NIF/Identificação", form.nif) +
      L("Emitido em", form.emitidoEm) + L("Válido até", form.validoAte) + L("BI vitalício", form.biVitalicio) +
      L("Nome do pai", form.nomePai) + L("Nome da mãe", form.nomeMae) +
      L("Nacionalidade", form.nacionalidade) + L("Nacionalidade alternativa", form.nacionalidadeAlt) +
      L("Residência", form.residencia) + L("Província", form.provincia) + L("Município", form.municipio) +
      L("Comuna", form.comuna) + L("Distrito urbano", form.distrito) +
      L("Email", form.email) + L("Telefone principal", form.telefone) + L("Telefone alternativo", form.telefoneAlt) +
      "\n=== DADOS PROFISSIONAIS ===\n" +
      L("Licenciado(a) em", form.licenciaturaEm) + L("Universidade", form.universidade) +
      L("País de formação", form.paisFormacao) + L("Data de conclusão", form.dataConclusao) +
      "\n=== DADOS LABORAIS ===\n" +
      L("Trabalha", form.trabalho) + L("Entidade patronal", form.entidadePatronal) + L("Endereço do trabalho", form.enderecoTrabalho) +
      (form.espEm ? "\n=== ESPECIALIDADE ===\n" + L("Especialista em", form.espEm) + L("Local", form.espLocal) + L("País", form.espPais) + L("Conclusão", form.espData) : "") +
      (form.subEm ? "\n=== SUB-ESPECIALIDADE ===\n" + L("Sub-especialista em", form.subEm) + L("Local", form.subLocal) + L("País", form.subPais) + L("Conclusão", form.subData) : "") +
      (form.posEm ? "\n=== PÓS-GRADUAÇÃO ===\n" + L("Pós-graduado em", form.posEm) + L("Local", form.posLocal) + L("País", form.posPais) + L("Conclusão", form.posData) : "") +
      (form.mestEm ? "\n=== MESTRADO ===\n" + L("Mestrado em", form.mestEm) + L("Local", form.mestLocal) + L("País", form.mestPais) + L("Conclusão", form.mestData) : "") +
      (form.doutEm ? "\n=== DOUTORAMENTO ===\n" + L("Doutoramento em", form.doutEm) + L("Local", form.doutLocal) + L("País", form.doutPais) + L("Conclusão", form.doutData) : "") +
      `\n=== MODELO DE DOCUMENTOS ===\nModelo ${model} — ${modelDocs.desc}\n`
    );
  };

  const submit = async () => {
    setError(null);
    const modelDocs = DOC_MODELS[model].docs;
    const missing = modelDocs.filter((d) => !docs[d.key]);
    if (missing.length > 0) {
      setError(`Anexe todos os documentos: falta ${missing.map((d) => d.label).join(", ")}.`);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("serviceType", "inscricao");
      fd.append("requesterName", form.nome);
      fd.append("ownerName", form.nome);
      if (form.email) fd.append("email", form.email);
      fd.append("phone", form.telefone);
      fd.append("details", buildDetails());
      modelDocs.forEach((d) => {
        const f = docs[d.key];
        if (f) fd.append("attachments", f, `${d.label} - ${f.name}`);
      });
      const res = await fetch(`${API_URL}/service-requests`, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(", ") : err.message || "Falha ao enviar.");
      }
      const data = await res.json();
      setCode(data.serviceCode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Ecrã de sucesso =====
  if (code) {
    return (
      <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <p className="font-bold text-gray-900 mb-2">{form.nome}</p>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              A sua inscrição foi submetida com sucesso.<br />
              1. Depois da sua candidatura passar por um processo de avaliação, receberá uma referência para efetuar o pagamento da inscrição.<br />
              2. Depois da sua candidatura ser aprovada, enviaremos-lhe um email com as suas credenciais de acesso ao sistema.
            </p>
            <div className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-angola-gold rounded-xl px-4 py-3 mb-1">
              <span className="text-xl font-mono font-bold text-angola-navy tracking-wider">{code}</span>
              <button type="button" onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="p-2 text-gray-400 hover:text-angola-navy" aria-label="Copiar código">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600">Código copiado!</p>}
            <p className="text-xs text-gray-500 mt-2">Guarde este código de serviço para acompanhar o processo.</p>
            <a href="/consultar" className="mt-3 inline-block text-sm text-angola-blue hover:underline">Consultar estado da inscrição →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <img src="/images/logo.svg" alt="ORMED" className="w-16 h-16 mx-auto mb-3 object-contain" />
          <h1 className="text-lg md:text-xl font-bold text-gray-900">
            ORDEM DOS MÉDICOS DE ANGOLA <span className="text-gray-400">|</span> FORMULÁRIO DE INSCRIÇÃO{" "}
            <span className="bg-angola-navy text-white px-2 py-1 rounded text-sm align-middle">{STEPS[step - 1].title.toUpperCase()}</span>
          </h1>
        </div>

        {/* Progresso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${s.id <= step ? "bg-angola-navy text-white" : "bg-gray-200 text-gray-500"}`}>
                  {s.id < step ? <CheckCircle className="w-5 h-5" /> : s.id}
                </div>
                <span className={`hidden md:block ml-2 text-sm font-medium ${s.id <= step ? "text-gray-900" : "text-gray-400"}`}>{s.title}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${s.id < step ? "bg-angola-navy" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          {step === 1 && <StepPessoais form={form} set={set} />}
          {step === 2 && <StepProfissionais form={form} set={set} />}
          {step === 3 && <StepDocumentos model={model} setModel={setModel} docs={docs} setDocs={setDocs} />}

          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-5">{error}</div>}

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button type="button" onClick={prev} disabled={step === 1} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            {step < 3 ? (
              <button type="button" onClick={next} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-angola-navy text-white font-semibold hover:brightness-110">
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-angola-navy text-white font-semibold hover:brightness-110 disabled:opacity-60">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Finalizar Inscrição
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Componentes auxiliares =====
type SetFn = (k: any, v: string | boolean) => void;

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-8 mb-4 first:mt-0">
      <span className="bg-angola-navy text-white text-sm font-semibold px-3 py-1.5 rounded shrink-0">{children}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function StepPessoais({ form, set }: { form: any; set: SetFn }) {
  return (
    <div className="space-y-5">
      <Field label="Nome Completo" required>
        <input className={inputClass} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Nome completo" />
      </Field>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Estado Civil" required>
          <select className={inputClass} value={form.estadoCivil} onChange={(e) => set("estadoCivil", e.target.value)} aria-label="Estado civil">
            <option value="">Selecione</option>{ESTADO_CIVIL.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Género" required>
          <select className={inputClass} value={form.genero} onChange={(e) => set("genero", e.target.value)} aria-label="Género">
            <option value="">Selecione</option>{GENERO.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Grupo Sanguíneo" required>
          <select className={inputClass} value={form.grupoSanguineo} onChange={(e) => set("grupoSanguineo", e.target.value)} aria-label="Grupo sanguíneo">
            <option value="">Selecione</option>{SANGUE.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Data de Nascimento" required>
          <input type="date" className={inputClass} value={form.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nº Bilhete/Passaporte" required>
          <input className={inputClass} value={form.biPassaporte} onChange={(e) => set("biPassaporte", e.target.value)} placeholder="000000000LA000" />
        </Field>
        <Field label="NIF / Arquivo de Identificação">
          <input className={inputClass} value={form.nif} onChange={(e) => set("nif", e.target.value)} placeholder="Número de identificação fiscal" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
        <Field label="Emitido em">
          <input type="date" className={inputClass} value={form.emitidoEm} onChange={(e) => set("emitidoEm", e.target.value)} disabled={form.biVitalicio} />
        </Field>
        <Field label="Válido até">
          <input type="date" className={inputClass} value={form.validoAte} onChange={(e) => set("validoAte", e.target.value)} disabled={form.biVitalicio} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
          <input type="checkbox" checked={form.biVitalicio} onChange={(e) => set("biVitalicio", e.target.checked)} className="w-4 h-4 accent-angola-navy" />
          Meu BI é vitalício
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nome do Pai" required>
          <input className={inputClass} value={form.nomePai} onChange={(e) => set("nomePai", e.target.value)} placeholder="digite aqui o nome do pai" />
        </Field>
        <Field label="Nome da Mãe" required>
          <input className={inputClass} value={form.nomeMae} onChange={(e) => set("nomeMae", e.target.value)} placeholder="digite aqui o nome da mãe" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Nacionalidade" required>
          <input className={inputClass} value={form.nacionalidade} onChange={(e) => set("nacionalidade", e.target.value)} placeholder="Angola" />
        </Field>
        <Field label="Nacionalidade Alternativa">
          <input className={inputClass} value={form.nacionalidadeAlt} onChange={(e) => set("nacionalidadeAlt", e.target.value)} placeholder="outra nacionalidade" />
        </Field>
        <Field label="Local de Residência Actual" required>
          <input className={inputClass} value={form.residencia} onChange={(e) => set("residencia", e.target.value)} placeholder="Rua, bairro, município, província" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Field label="Província" required><input className={inputClass} value={form.provincia} onChange={(e) => set("provincia", e.target.value)} placeholder="Luanda" /></Field>
        <Field label="Município" required><input className={inputClass} value={form.municipio} onChange={(e) => set("municipio", e.target.value)} placeholder="Talatona" /></Field>
        <Field label="Comuna"><input className={inputClass} value={form.comuna} onChange={(e) => set("comuna", e.target.value)} placeholder="Comuna" /></Field>
        <Field label="Distrito Urbano"><input className={inputClass} value={form.distrito} onChange={(e) => set("distrito", e.target.value)} placeholder="Distrito" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label="Email" required><input type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@exemplo.com" /></Field>
        <Field label="Nº Telefone Principal" required><input className={inputClass} value={form.telefone} onChange={(e) => set("telefone", e.target.value)} placeholder="+244 9xx xxx xxx" /></Field>
        <Field label="Nº Telefone Alternativo"><input className={inputClass} value={form.telefoneAlt} onChange={(e) => set("telefoneAlt", e.target.value)} placeholder="9xxxxxxxx" /></Field>
      </div>
    </div>
  );
}

function FormacaoBlock({ form, set, prefix, em, emLabel, localLabel }: { form: any; set: SetFn; prefix: string; em: string; emLabel: string; localLabel: string }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={emLabel}><input className={inputClass} value={form[em]} onChange={(e) => set(em, e.target.value)} placeholder={`digite aqui ${emLabel.toLowerCase()}`} /></Field>
        <Field label={localLabel}><input className={inputClass} value={form[`${prefix}Local`]} onChange={(e) => set(`${prefix}Local`, e.target.value)} placeholder="Universidade/Hospital/Clínica" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="País de Formação"><input className={inputClass} value={form[`${prefix}Pais`]} onChange={(e) => set(`${prefix}Pais`, e.target.value)} placeholder="digite aqui o país" /></Field>
        <Field label="Data de Conclusão"><input type="date" className={inputClass} value={form[`${prefix}Data`]} onChange={(e) => set(`${prefix}Data`, e.target.value)} /></Field>
      </div>
    </div>
  );
}

function StepProfissionais({ form, set }: { form: any; set: SetFn }) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Licenciado(a) em" required><input className={inputClass} value={form.licenciaturaEm} onChange={(e) => set("licenciaturaEm", e.target.value)} placeholder="informe o curso da sua licenciatura" /></Field>
        <Field label="Universidade de Formação" required><input className={inputClass} value={form.universidade} onChange={(e) => set("universidade", e.target.value)} placeholder="digite aqui a universidade" /></Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <Field label="País de Formação" required><input className={inputClass} value={form.paisFormacao} onChange={(e) => set("paisFormacao", e.target.value)} placeholder="digite aqui o país de formação" /></Field>
        <Field label="Data de Conclusão" required><input type="date" className={inputClass} value={form.dataConclusao} onChange={(e) => set("dataConclusao", e.target.value)} /></Field>
      </div>

      <SectionTitle>Dados Laborais</SectionTitle>
      <label className="flex items-center gap-2 text-sm text-gray-700 mb-3">
        <input type="checkbox" checked={form.trabalho} onChange={(e) => set("trabalho", e.target.checked)} className="w-4 h-4 accent-angola-navy" />
        Eu trabalho
      </label>
      {form.trabalho && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Entidade Patronal"><input className={inputClass} value={form.entidadePatronal} onChange={(e) => set("entidadePatronal", e.target.value)} placeholder="digite aqui o local de trabalho" /></Field>
          <Field label="Endereço do local de trabalho"><input className={inputClass} value={form.enderecoTrabalho} onChange={(e) => set("enderecoTrabalho", e.target.value)} placeholder="digite aqui o endereço" /></Field>
        </div>
      )}

      <SectionTitle>Dados da Especialidade</SectionTitle>
      <FormacaoBlock form={form} set={set} prefix="esp" em="espEm" emLabel="Especialista em" localLabel="Local da Especialidade" />

      <SectionTitle>Dados da Sub-Especialidade</SectionTitle>
      <FormacaoBlock form={form} set={set} prefix="sub" em="subEm" emLabel="Sub-Especialista em" localLabel="Local da Sub-Especialidade" />

      <SectionTitle>Dados da Pós-Graduação</SectionTitle>
      <FormacaoBlock form={form} set={set} prefix="pos" em="posEm" emLabel="Pós-Graduado em" localLabel="Local da Pós-Graduação" />

      <SectionTitle>Dados do Mestrado</SectionTitle>
      <FormacaoBlock form={form} set={set} prefix="mest" em="mestEm" emLabel="Mestrado em" localLabel="Local do Mestrado" />

      <SectionTitle>Dados do Doutoramento</SectionTitle>
      <FormacaoBlock form={form} set={set} prefix="dout" em="doutEm" emLabel="Doutoramento em" localLabel="Local do Doutoramento" />
    </div>
  );
}

function StepDocumentos({ model, setModel, docs, setDocs }: { model: string; setModel: (m: string) => void; docs: Record<string, File | null>; setDocs: React.Dispatch<React.SetStateAction<Record<string, File | null>>> }) {
  const m = DOC_MODELS[model];
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">Escolha um modelo de documentos:</p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
        {Object.keys(DOC_MODELS).map((k) => (
          <button key={k} type="button" onClick={() => setModel(k)} className={`py-2.5 rounded-lg text-sm font-semibold transition border ${model === k ? "bg-angola-navy text-white border-angola-navy" : "bg-white text-angola-navy border-gray-200 hover:border-angola-gold hover:bg-angola-cream/40"}`}>
            Modelo {k}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-5">
        <span className="bg-angola-navy text-white text-sm font-semibold px-2.5 py-1 rounded shrink-0">Modelo {model}</span>
        <span className="text-sm text-gray-600">{m.desc}</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {m.docs.map((d) => (
          <FileField key={d.key} label={d.label} file={docs[d.key] ?? null} onChange={(f) => setDocs((p) => ({ ...p, [d.key]: f }))} />
        ))}
      </div>
    </div>
  );
}

function FileField({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}<span className="text-red-500">*</span></label>
      <label className={`flex items-center gap-2 border rounded-lg px-2 py-1.5 text-sm cursor-pointer ${file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-angola-gold"}`}>
        <span className="bg-gray-100 px-2.5 py-1 rounded text-gray-700 shrink-0 text-xs">Escolher</span>
        <span className="truncate text-gray-500 text-xs flex-1">{file ? file.name : "Nenhum ficheiro"}</span>
        {file && <Upload className="w-3.5 h-3.5 text-green-500 shrink-0" />}
        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </label>
    </div>
  );
}
