"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, ArrowRight, Newspaper, CalendarDays, GraduationCap, FlaskConical, Briefcase, Megaphone } from "lucide-react";
import { api } from "@/lib/api";

interface Hit {
  group: string;
  icon: typeof Newspaper;
  title: string;
  sub: string;
  href: string;
}

interface SourceItem {
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  abstract?: string;
  entity?: string;
}

const SOURCES: {
  key: string;
  icon: typeof Newspaper;
  path: string;
  href: (s: string) => string;
  sub: (i: SourceItem) => string;
}[] = [
  { key: "Notícias", icon: Newspaper, path: "/news", href: (s) => `/noticias/${s}/`, sub: (i) => i.excerpt ?? "" },
  { key: "Comunicados", icon: Megaphone, path: "/announcements", href: (s) => `/comunicados/${s}/`, sub: (i) => i.description ?? "" },
  { key: "Eventos", icon: CalendarDays, path: "/events", href: (s) => `/eventos/${s}/`, sub: (i) => i.description ?? "" },
  { key: "Cursos", icon: GraduationCap, path: "/courses", href: (s) => `/formacao-continua/${s}/`, sub: (i) => i.description ?? "" },
  { key: "RevMed", icon: FlaskConical, path: "/revmed", href: (s) => `/revmed/${s}/`, sub: (i) => i.abstract ?? "" },
  { key: "Vagas", icon: Briefcase, path: "/jobs", href: (s) => `/vagas/${s}/`, sub: (i) => i.entity ?? "" },
];

function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get("q") ?? "";
  const [term, setTerm] = useState(query);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTerm(query);
    if (!query.trim()) {
      setHits([]);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.allSettled(
      SOURCES.map((s) =>
        api.get<{ items: SourceItem[] }>(`${s.path}?search=${encodeURIComponent(query)}&limit=6`),
      ),
    ).then((results) => {
      if (!active) return;
      const all: Hit[] = [];
      results.forEach((r, i) => {
        if (r.status !== "fulfilled") return;
        const src = SOURCES[i];
        (r.value.items ?? []).forEach((it) => {
          all.push({
            group: src.key,
            icon: src.icon,
            title: it.title ?? "",
            sub: src.sub(it),
            href: src.href(it.slug ?? ""),
          });
        });
      });
      setHits(all);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/procurar?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="pt-36 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-5">Pesquisar</h1>
          <form onSubmit={submit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              autoFocus
              placeholder="Pesquisar notícias, eventos, cursos, vagas..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-angola-gold"
            />
          </form>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {!query.trim() ? (
          <p className="text-center text-gray-500 py-12">Escreva algo para pesquisar na plataforma.</p>
        ) : loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : hits.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              Sem resultados para <span className="font-semibold text-gray-700">&quot;{query}&quot;</span>.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{hits.length} resultado(s) para &quot;{query}&quot;</p>
            <div className="space-y-3">
              {hits.map((hit, i) => (
                <Link
                  key={i}
                  href={hit.href}
                  className="group flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-angola-gold/50 hover:shadow-sm transition"
                >
                  <span className="w-10 h-10 rounded-lg bg-angola-navy/5 flex items-center justify-center shrink-0">
                    <hit.icon className="w-5 h-5 text-angola-navy" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold">{hit.group}</span>
                    <p className="font-semibold text-gray-900 group-hover:text-angola-navy truncate">{hit.title}</p>
                    {hit.sub && <p className="text-sm text-gray-500 line-clamp-1">{hit.sub}</p>}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-angola-gold self-center shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProcurarPage() {
  return (
    <Suspense fallback={<div className="pt-36 pb-16 min-h-screen flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
