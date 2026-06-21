"use client";

import { Loader2, Users, Building2, MapPin } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { OrgaoItem } from "@/lib/admin-types";

const REGION_LABEL: Record<string, string> = {
  norte: "Região Norte",
  centro: "Região Centro",
  sul: "Região Sul",
};

function OrgaoCard({ o }: { o: OrgaoItem }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{o.name}</h3>
          {o.region && (
            <span className="inline-flex items-center gap-1 text-xs text-angola-gold font-medium">
              <MapPin className="w-3 h-3" /> {REGION_LABEL[o.region]}
            </span>
          )}
        </div>
      </div>

      {o.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{o.description}</p>}

      {o.members.length > 0 ? (
        <div className="space-y-2 pt-3 border-t border-gray-100">
          {o.members.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-angola-gold/20 text-angola-navy flex items-center justify-center text-xs font-bold shrink-0">
                {m.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                {m.role && <p className="text-xs text-gray-500 truncate">{m.role}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400 flex items-center gap-1 pt-3 border-t border-gray-100">
          <Users className="w-3.5 h-3.5" /> Composição a anunciar
        </p>
      )}
    </div>
  );
}

export function OrgaosView({ scope }: { scope: "nacional" | "regional" }) {
  const { data, loading } = usePublicData<OrgaoItem[]>("/orgaos");
  const items = (data ?? []).filter((o) => o.scope === scope);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-angola-gold" />
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-20">Conteúdo a anunciar em breve.</p>;
  }

  if (scope === "regional") {
    const byRegion = ["norte", "centro", "sul"]
      .map((r) => ({ region: r, list: items.filter((o) => o.region === r) }))
      .filter((g) => g.list.length > 0);
    return (
      <div className="space-y-12">
        {byRegion.map((g) => (
          <div key={g.region}>
            <h2 className="text-2xl font-bold text-angola-navy mb-5 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-angola-gold" /> {REGION_LABEL[g.region]}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {g.list.map((o) => <OrgaoCard key={o._id} o={o} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {items.map((o) => <OrgaoCard key={o._id} o={o} />)}
    </div>
  );
}
