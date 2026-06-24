"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { BankMember } from "@/lib/admin-types";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

/**
 * Seletor de médico a partir do banco de médicos da Ordem (sem digitação manual).
 * Pesquisa em /members; pode filtrar por categoria (ex.: orientador) e por situação (vigor).
 */
export function MemberPicker({
  label, placeholder, categoria, soloVigor = true, selected, onSelect, allowClear,
}: {
  label?: string;
  placeholder?: string;
  categoria?: string;
  soloVigor?: boolean;
  selected?: { id: string; name: string; meta?: string } | null;
  onSelect: (m: BankMember | null) => void;
  allowClear?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<BankMember[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("search", q.trim());
        if (categoria) params.set("categoria", categoria);
        if (soloVigor) params.set("situacao", "vigor");
        const list = await api.get<BankMember[]>(`/members?${params.toString()}`, true);
        setResults(list.slice(0, 25));
      } catch { setResults([]); } finally { setLoading(false); }
    }, 250);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [q, open, categoria, soloVigor]);

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
      {selected ? (
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
          <Check className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm text-gray-900 truncate flex-1">{selected.name}{selected.meta ? <span className="text-gray-400"> · {selected.meta}</span> : null}</span>
          <button type="button" onClick={() => { setOpen(true); onSelect(null); }} className="text-xs text-angola-navy hover:underline shrink-0">Mudar</button>
          {allowClear && <button type="button" onClick={() => onSelect(null)} aria-label="Remover" className="text-gray-400 hover:text-red-600 shrink-0"><X className="w-4 h-4" /></button>}
        </div>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-2">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              className="flex-1 py-2 text-sm outline-none bg-transparent text-gray-900"
              placeholder={placeholder ?? "Procurar médico no banco (nome, nº ordem, nº utente)..."}
              value={q}
              onFocus={() => setOpen(true)}
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            />
            {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400 shrink-0" />}
          </div>
          {open && (
            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-xs text-gray-400 px-3 py-3 text-center">{loading ? "A procurar..." : "Sem médicos. Escreva para pesquisar."}</p>
              ) : results.map((m) => (
                <button key={m._id} type="button"
                  onClick={() => { onSelect(m); setOpen(false); setQ(""); }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-2.5">
                  {m.photo?.url
                    ? <img src={m.photo.url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                    : <span className="w-8 h-8 rounded-full bg-angola-navy/10 text-angola-navy flex items-center justify-center text-xs font-bold shrink-0">{m.name.charAt(0).toUpperCase()}</span>}
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">{m.name}</span>
                    <span className="block text-[11px] text-gray-500 font-mono truncate">{m.numeroOrdem}{m.especialidade ? ` · ${m.especialidade}` : ""}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { inputClass as memberPickerInputClass };
