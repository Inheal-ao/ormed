"use client";

import { FileText, Loader2, Download, ExternalLink } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { DocumentItem } from "@/lib/admin-types";

interface DocumentsListProps {
  category: string;
  /** Texto mostrado quando ainda não há documentos. */
  emptyText?: string;
}

export function DocumentsList({ category, emptyText }: DocumentsListProps) {
  const { data, loading } = usePublicData<DocumentItem[]>(
    `/documents?category=${category}`,
    [category],
  );
  const docs = data ?? [];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-7 h-7 animate-spin text-angola-gold" />
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl p-10 text-center">
        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">{emptyText ?? "Documentos disponíveis em breve."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {docs.map((d) => {
        const href = d.pdf?.url || d.externalLink;
        const isExternal = !d.pdf?.url && !!d.externalLink;
        return (
          <a
            key={d._id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-angola-gold hover:shadow-sm transition"
          >
            <div className="w-11 h-11 rounded-lg bg-angola-navy/5 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-angola-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-angola-navy">{d.title}</p>
              {d.description && <p className="text-sm text-gray-500 line-clamp-1">{d.description}</p>}
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-angola-gold">
              {isExternal ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {isExternal ? "Aceder" : "Abrir PDF"}
            </span>
          </a>
        );
      })}
    </div>
  );
}
