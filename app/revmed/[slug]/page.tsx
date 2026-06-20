"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, FlaskConical, User, Building2, Download,
  ExternalLink, Link2, Check, Share2,
} from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { ArticleItem } from "@/lib/admin-types";
import { formatDate } from "@/lib/utils";

function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encT}%20${enc}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${enc}&text=${encT}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc}` },
    { label: "Email", href: `mailto:?subject=${encT}&body=${enc}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm text-gray-500 mr-1">
        <Share2 className="w-4 h-4" /> Partilhar:
      </span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-angola-gold transition">
          {l.label}
        </a>
      ))}
      <button type="button" onClick={copy} className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5">
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copiado" : "Copiar link"}
      </button>
    </div>
  );
}

export default function ArtigoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: a, loading } = usePublicData<ArticleItem>(`/revmed/slug/${slug}`, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-angola-gold" /></div>;
  }
  if (!a) {
    return (
      <div className="pt-32 pb-20 text-center">
        <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Artigo não encontrado</h1>
        <Link href="/revmed/" className="text-angola-gold hover:underline">Voltar à RevMed</Link>
      </div>
    );
  }

  return (
    <article className="pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/revmed/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-angola-navy mb-6">
          <ArrowLeft className="w-4 h-4" /> Voltar à RevMed
        </Link>

        {a.category && (
          <span className="text-xs font-semibold uppercase tracking-wide text-angola-gold">{a.category}</span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-1 mb-3 leading-tight font-display">{a.title}</h1>
        {a.subtitle && <p className="text-xl text-gray-600 mb-4">{a.subtitle}</p>}

        <div className="space-y-1 text-sm text-gray-600 mb-6 pb-6 border-b">
          {a.authors && <p className="flex items-center gap-1.5"><User className="w-4 h-4 text-angola-gold" />{a.authors}</p>}
          {a.affiliation && <p className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-angola-gold" />{a.affiliation}</p>}
          <p className="text-gray-400">{formatDate(a.publishedAt ?? a.createdAt)}{a.doi ? ` · DOI: ${a.doi}` : ""}</p>
        </div>

        {a.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.coverImage.url} alt={a.title} className="w-full rounded-2xl object-cover max-h-[420px] mb-8" />
        )}

        {a.abstract && (
          <div className="bg-gray-50 border-l-4 border-angola-gold rounded-r-xl p-5 mb-8">
            <h2 className="font-bold text-gray-900 mb-2">Resumo</h2>
            <p className="text-gray-700 leading-relaxed">{a.abstract}</p>
          </div>
        )}

        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">{a.content}</div>

        {a.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {a.keywords.map((k) => (
              <span key={k} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{k}</span>
            ))}
          </div>
        )}

        {/* Ações: PDF / link externo */}
        <div className="flex flex-wrap gap-3 mb-8">
          {a.pdf?.url && (
            <a href={a.pdf.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg hover:brightness-110">
              <Download className="w-4 h-4" /> Descarregar PDF
            </a>
          )}
          {a.externalLink && (
            <a href={a.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-gray-200 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50">
              <ExternalLink className="w-4 h-4" /> Ver publicação original
            </a>
          )}
        </div>

        <div className="pt-6 border-t">
          <ShareBar title={a.title} />
        </div>
      </div>
    </article>
  );
}
