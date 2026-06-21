import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ormed-qx3s.vercel.app";

// Rotas públicas principais (o /admin fica de fora propositadamente)
const routes = [
  "",
  "sobre",
  "historia",
  "estatutos",
  "orgaos-sociais",
  "comissoes",
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
  const now = new Date();
  return routes.map((path) => ({
    url: `${SITE_URL}/${path}`.replace(/\/$/, "") + "/",
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
