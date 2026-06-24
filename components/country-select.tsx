"use client";

import { useEffect, useState } from "react";

// Cache em memória — carrega a lista de países uma vez por sessão.
let CACHE: string[] | null = null;
const FALLBACK = ["Angola", "Portugal", "Brasil", "Cabo Verde", "Moçambique", "São Tomé e Príncipe", "Guiné-Bissau", "Cuba", "África do Sul", "Namíbia", "República Democrática do Congo", "Congo"];

async function loadCountries(): Promise<string[]> {
  if (CACHE) return CACHE;
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=translations,name");
    if (!res.ok) throw new Error("falha");
    const data = (await res.json()) as { translations?: { por?: { common?: string } }; name?: { common?: string } }[];
    const names = data
      .map((c) => c.translations?.por?.common || c.name?.common || "")
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "pt"));
    // Angola primeiro.
    const ordered = ["Angola", ...names.filter((n) => n !== "Angola")];
    CACHE = ordered;
    return ordered;
  } catch {
    CACHE = FALLBACK;
    return FALLBACK;
  }
}

/** Seletor de país alimentado por uma API gratuita de países (com fallback). */
export function CountrySelect({ value, onChange, className, label }: {
  value: string; onChange: (v: string) => void; className?: string; label?: string;
}) {
  const [countries, setCountries] = useState<string[]>(CACHE ?? []);

  useEffect(() => { loadCountries().then(setCountries); }, []);

  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>}
      <select className={className} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label ?? "País"}>
        <option value="">— País —</option>
        {value && !countries.includes(value) && <option value={value}>{value}</option>}
        {countries.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
