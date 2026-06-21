import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ormed-qx3s.vercel.app";

// Rotas públicas principais (o /admin fica de fora propositadamente)
const routes = [
  "",
  "sobre",
  "historia",
  "estatutos",
  "orgaos-nacionais",
  "orgaos-regionais",
  "bastonarios",
  "especialidades",
  "consulta-medicos",
  "codigo-deontologico",
  "codigo-disciplinar",
  "regulamento-geral",
  "processo-etico",
  "textos-fundadores",
  "denuncias",
  "noticias",
  "comunicados",
  "eventos",
  "formacao-continua",
  "vagas",
  "revista",
  "revmed",
  "boletins",
  "livros",
  "podcast",
  "galeria",
  "biblioteca",
  "validacao",
  "renovacao",
  "carteira",
  "pagar-cotas",
  "declaracao",
  "inscricao",
  "contactos",
  "pesquisa",
  "privacidade",
  "termos",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Apenas a data (sem hora) para não revelar o momento exato dos deploys.
  const lastModified = new Date().toISOString().slice(0, 10);
  return routes.map((path) => ({
    url: `${SITE_URL}/${path}`.replace(/\/$/, "") + "/",
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
