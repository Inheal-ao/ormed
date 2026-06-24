"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, ShieldCheck, IdCard, Award, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { College } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useNotifications } from "@/components/admin/notifications-context";

interface CatReq {
  _id: string; memberName: string; numeroOrdem: string; categoria: string; action: string;
  collegeId: string; requestedByRole: string; status: string; createdAt: string;
}
interface ChangeReq {
  _id: string; numeroUtente: string; memberName: string; changes: Record<string, string>;
  status: string; createdAt: string;
}

const CATEGORIA_LABEL: Record<string, string> = { interno: "Interno", especialista: "Especialista", orientador: "Orientador" };
const FIELD_LABEL: Record<string, string> = { name: "Nome", phone: "Telefone", email: "Email", especialidade: "Especialidade", provincia: "Província", residencia: "Residência" };
const ROLE_LABEL: Record<string, string> = { colegio: "Presidente do Colégio", bastonaria: "Bastonária", super_admin: "Administrador" };

export default function AprovacoesPage() {
  const { refresh } = useNotifications();
  const [cats, setCats] = useState<CatReq[]>([]);
  const [changes, setChanges] = useState<ChangeReq[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, ch, col] = await Promise.all([
        api.get<CatReq[]>("/members/category-requests/all?status=pending", true),
        api.get<ChangeReq[]>("/members/change-requests/all?status=pending", true).catch(() => [] as ChangeReq[]),
        api.get<College[]>("/colleges", true).catch(() => [] as College[]),
      ]);
      setCats(c); setChanges(ch); setColleges(col);
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const collegeName = (id: string) => colleges.find((c) => c._id === id)?.name ?? "";

  const resolveCat = async (r: CatReq, status: "approved" | "rejected") => {
    setBusy(r._id);
    try {
      await api.patch(`/members/category-requests/${r._id}`, { status });
      setCats((p) => p.filter((x) => x._id !== r._id));
      refresh();
    } catch (err) { alert(err instanceof Error ? err.message : "Erro."); } finally { setBusy(null); }
  };
  const resolveChange = async (r: ChangeReq, status: "approved" | "rejected") => {
    setBusy(r._id);
    try {
      await api.patch(`/members/change-requests/${r._id}`, { status });
      setChanges((p) => p.filter((x) => x._id !== r._id));
      refresh();
    } catch (err) { alert(err instanceof Error ? err.message : "Erro."); } finally { setBusy(null); }
  };

  const total = cats.length + changes.length;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Aprovações" description="Tudo o que carece da aprovação da Bastonária: atribuições de categoria e alterações de dados dos médicos." />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : total === 0 ? (
        <div className="text-center py-16">
          <ShieldCheck className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="text-gray-500">Sem pendências. Tudo aprovado.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Atribuições de categoria */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Award className="w-4 h-4" /> Atribuições de categoria {cats.length > 0 && <span className="bg-angola-gold text-angola-navy text-xs font-bold rounded-full px-2">{cats.length}</span>}
            </h2>
            {cats.length === 0 ? <p className="text-sm text-gray-400">Nenhuma pendente.</p> : (
              <div className="space-y-2">
                {cats.map((r) => (
                  <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><Award className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{r.memberName} <span className="text-xs text-gray-400 font-mono font-normal">· {r.numeroOrdem}</span></p>
                      <p className="text-xs text-gray-600 flex items-center gap-1.5 flex-wrap">
                        <span className={r.action === "remove" ? "text-red-600" : "text-green-700"}>{r.action === "remove" ? "Remover" : "Atribuir"}</span>
                        <span className="font-medium">{CATEGORIA_LABEL[r.categoria] ?? r.categoria}</span>
                        {r.collegeId && <><ArrowRight className="w-3 h-3 text-gray-300" /> {collegeName(r.collegeId)}</>}
                      </p>
                      <p className="text-[11px] text-gray-400">Pedido por {ROLE_LABEL[r.requestedByRole] ?? r.requestedByRole} · {new Date(r.createdAt).toLocaleDateString("pt-PT")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={busy === r._id} onClick={() => resolveCat(r, "rejected")} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"><X className="w-4 h-4" /> Rejeitar</button>
                      <button type="button" disabled={busy === r._id} onClick={() => resolveCat(r, "approved")} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{busy === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Aprovar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Alterações de dados */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <IdCard className="w-4 h-4" /> Alterações de dados {changes.length > 0 && <span className="bg-angola-gold text-angola-navy text-xs font-bold rounded-full px-2">{changes.length}</span>}
            </h2>
            {changes.length === 0 ? <p className="text-sm text-gray-400">Nenhuma pendente.</p> : (
              <div className="space-y-2">
                {changes.map((r) => (
                  <div key={r._id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4 flex-wrap">
                    <div className="w-10 h-10 rounded-full bg-angola-navy/5 text-angola-navy flex items-center justify-center shrink-0"><IdCard className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{r.memberName} <span className="text-xs text-gray-400 font-mono font-normal">· {r.numeroUtente}</span></p>
                      <ul className="text-xs text-gray-600 mt-1 space-y-0.5">
                        {Object.entries(r.changes).map(([k, v]) => (
                          <li key={k}><span className="text-gray-400">{FIELD_LABEL[k] ?? k}:</span> {v}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={busy === r._id} onClick={() => resolveChange(r, "rejected")} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50"><X className="w-4 h-4" /> Rejeitar</button>
                      <button type="button" disabled={busy === r._id} onClick={() => resolveChange(r, "approved")} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">{busy === r._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Aprovar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
