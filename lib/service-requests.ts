export type ServiceType =
  | "validacao-documentos"
  | "renovacao-inscricao"
  | "carteira-profissional"
  | "pagar-cotas"
  | "declaracao";

export const SERVICE_LABEL: Record<string, string> = {
  "validacao-documentos": "Validação de Documentos",
  "renovacao-inscricao": "Renovação de Inscrição",
  "carteira-profissional": "Carteira Profissional",
  "pagar-cotas": "Pagamento de Cotas",
  "declaracao": "Declaração da Ordem",
};

export interface StatusMeta {
  label: string;
  className: string; // estilo do badge (claro)
}

export const STATUS_META: Record<string, StatusMeta> = {
  recebido: { label: "Recebido", className: "bg-blue-100 text-blue-700" },
  "em-analise": { label: "Em análise", className: "bg-amber-100 text-amber-700" },
  rejeitado: { label: "Rejeitado", className: "bg-red-100 text-red-700" },
  validado: { label: "Validado", className: "bg-green-100 text-green-700" },
  "nao-validado": { label: "Não validado", className: "bg-red-100 text-red-700" },
  "aguarda-pagamento": { label: "Aguarda pagamento", className: "bg-orange-100 text-orange-700" },
  "pagamento-em-analise": { label: "Pagamento em análise", className: "bg-amber-100 text-amber-700" },
  pago: { label: "Pago", className: "bg-emerald-100 text-emerald-700" },
  "recibo-emitido": { label: "Recibo emitido", className: "bg-teal-100 text-teal-700" },
  concluido: { label: "Concluído", className: "bg-green-100 text-green-700" },
};

export const ALL_STATUSES = Object.keys(STATUS_META);

// Motivos sugeridos para "não validado" (o operador pode escrever outro)
export const NAO_VALIDADO_REASONS = [
  "Documento não emitido pela Ordem",
  "Médico que emitiu não existe",
  "Médico que emitiu não se encontra em situação regular",
  "Documento falso",
];

export interface ServiceTrack {
  serviceCode: string;
  serviceType: ServiceType;
  requesterName: string;
  ownerName: string;
  status: string;
  statusDetail: string;
  isPaid: boolean;
  payment: { amount: string; instructions: string } | null;
  hasPaymentProof: boolean;
  receiptUrl: string | null;
  canSubmitProof: boolean;
  createdAt: string;
}
