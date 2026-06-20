"use client";

import { useState } from "react";
import {
  UserPlus,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const steps = [
  { id: 1, title: "Dados Pessoais", icon: UserPlus },
  { id: 2, title: "Formação", icon: GraduationCap },
  { id: 3, title: "Documentos", icon: FileText },
  { id: 4, title: "Pagamento", icon: CreditCard },
];

export default function InscricaoPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-angola-cream text-angola-gold text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4" />
            Inscrição
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Inscreva-se na ORMED
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Preencha o formulário abaixo para se tornar membro da Ordem dos
            Médicos de Angola
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step.id <= currentStep
                      ? "bg-angola-navy text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`hidden md:block ml-2 text-sm font-medium ${
                    step.id <= currentStep ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      step.id < currentStep ? "bg-angola-navy" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Form */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Dados Pessoais
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome Completo
                    </label>
                    <Input placeholder="Nome completo" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Data de Nascimento
                    </label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nº do Bilhete de Identidade
                    </label>
                    <Input placeholder="000000000LA000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      NIF
                    </label>
                    <Input placeholder="Número de identificação fiscal" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <Input type="email" placeholder="email@exemplo.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefone
                    </label>
                    <Input placeholder="+244 9xx xxx xxx" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Morada
                  </label>
                  <Input placeholder="Rua, número, bairro, cidade" />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Formação Académica
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Universidade
                    </label>
                    <Input placeholder="Nome da universidade" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Curso
                      </label>
                      <Input placeholder="Licenciatura em Medicina" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Ano de Conclusão
                      </label>
                      <Input placeholder="2020" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Especialidade (se aplicável)
                    </label>
                    <Input placeholder="Ex: Medicina Interna" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nº da Cédula Profissional
                    </label>
                    <Input placeholder="Número da cédula (se já possuir)" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Documentos Necessários
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Diploma de Licenciatura", required: true },
                    { label: "Certificado de Habilitações", required: true },
                    { label: "Bilhete de Identidade", required: true },
                    { label: "Fotografia tipo passe", required: true },
                    { label: "Certificado de Residência", required: false },
                    { label: "Comprovativo de Especialidade", required: false },
                  ].map((doc) => (
                    <div
                      key={doc.label}
                      className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-angola-gold hover:bg-angola-cream transition-colors cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {doc.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {doc.required ? "Obrigatório" : "Opcional"} · PDF, JPG
                        ou PNG
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Pagamento
                </h2>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Resumo da Inscrição
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Taxa de Inscrição</span>
                      <span className="font-medium">50.000 AOA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Quota Anual</span>
                      <span className="font-medium">30.000 AOA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Emissão de Carteira</span>
                      <span className="font-medium">10.000 AOA</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-base">
                      <span>Total</span>
                      <span className="text-angola-gold">90.000 AOA</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Método de Pagamento
                  </h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {["Multicaixa", "Transferência Bancária", "Depósito"].map(
                      (method) => (
                        <button
                          key={method}
                          className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-center hover:border-angola-gold hover:bg-angola-cream transition-colors"
                        >
                          <CreditCard className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm font-medium">{method}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              {currentStep < 4 ? (
                <Button className="bg-angola-navy hover:bg-angola-blue" onClick={nextStep}>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-angola-navy hover:bg-angola-blue">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Finalizar Inscrição
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
