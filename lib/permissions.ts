// Secções do painel que podem ser atribuídas a um funcionário.
// A `key` é usada tanto na navegação como no seletor de permissões.
export const PERMISSION_SECTIONS: { key: string; label: string }[] = [
  { key: "noticias", label: "Notícias" },
  { key: "comunicados", label: "Comunicados" },
  { key: "vagas", label: "Vagas de Emprego" },
  { key: "eventos", label: "Eventos" },
  { key: "cursos", label: "Formação/Cursos" },
  { key: "revistas", label: "Revistas" },
  { key: "revmed", label: "RevMed" },
  { key: "documentos", label: "Documentos" },
  { key: "boletins", label: "Boletins" },
  { key: "livros", label: "Livros" },
  { key: "podcast", label: "Podcast" },
  { key: "galeria", label: "Galeria" },
  { key: "bastonarios", label: "Bastonários" },
  { key: "orgaos", label: "Órgãos" },
  { key: "parceiros", label: "Parceiros" },
  { key: "estatisticas", label: "Estatísticas" },
  { key: "especialidades", label: "Especialidades" },
  { key: "apoio-pesquisa", label: "Apoio à Pesquisa" },
  { key: "validacoes", label: "Validação de Documentos" },
  { key: "solicitacoes", label: "Documentos da Ordem" },
  { key: "listas-universidades", label: "Listas das Universidades" },
  { key: "membros", label: "Membros (Médicos)" },
  { key: "denuncias", label: "Denúncias" },
  { key: "mensagens", label: "Mensagens" },
  { key: "newsletter", label: "Newsletter" },
  { key: "faqs", label: "FAQs" },
  { key: "testemunhos", label: "Testemunhos" },
  { key: "cronologia", label: "Cronologia" },
];

export const isManagerRole = (role?: string) =>
  role === "super_admin" || role === "admin" || role === "bastonaria";
