// Modelos de competências/habilidades por especialidade (pré-carregados no Mapa de Registo).
// O orientador só preenche os números (Observador/Ajudante/Executor/Total realizado).
export interface CompTemplate { competencia: string; totalMinimo: number }

export const COMPETENCIAS_TEMPLATE: Record<string, CompTemplate[]> = {
  "Medicina Geral e Familiar": [
    { competencia: "Indicar e avaliar exames complementares.", totalMinimo: 40 },
    { competencia: "Avaliar o estado nutricional e orientar as ações relevantes de acordo com a idade, sexo e problemas de saúde.", totalMinimo: 40 },
    { competencia: "Aplicar o esquema nacional de imunização.", totalMinimo: 30 },
    { competencia: "Relatórios de doenças infecciosas através do sistema estatístico estabelecido a este respeito.", totalMinimo: 30 },
    { competencia: "Avaliação da criança e o adolescente normais.", totalMinimo: 20 },
    { competencia: "Avaliação da criança e o adolescente em risco.", totalMinimo: 20 },
    { competencia: "Avaliação da criança e o adolescente doentes.", totalMinimo: 20 },
    { competencia: "Diagnóstico precoce de doenças infecciosas (tuberculose pulmonar, arboviroses, cólera, hepatites, entre outras).", totalMinimo: 60 },
    { competencia: "Interpretar radiografias convencionais simples.", totalMinimo: 10 },
    { competencia: "Ressuscitação cardiopulmonar.", totalMinimo: 10 },
    { competencia: "Balanço hidromineral.", totalMinimo: 20 },
    { competencia: "Puericultura.", totalMinimo: 45 },
  ],
};

export function templateFor(especialidade?: string): CompTemplate[] {
  return (especialidade && COMPETENCIAS_TEMPLATE[especialidade]) || [];
}
