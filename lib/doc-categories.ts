/** Categorias de documentos institucionais (valor = slug usado nas páginas). */
export const DOC_CATEGORIES: { value: string; label: string }[] = [
  { value: "estatutos", label: "Estatutos" },
  { value: "codigo-deontologico", label: "Código Deontológico" },
  { value: "codigo-disciplinar", label: "Código Disciplinar" },
  { value: "regulamento-geral", label: "Regulamento Geral" },
  { value: "normas", label: "Normas e Diretrizes" },
  { value: "outros", label: "Outros" },
];

export function docCategoryLabel(value: string): string {
  return DOC_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
