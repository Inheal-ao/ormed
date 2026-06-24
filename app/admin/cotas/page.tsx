"use client";

import { useEffect, useState } from "react";
import { Loader2, Coins, Save, Check, Receipt, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { BankMember } from "@/lib/admin-types";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { MemberPicker } from "@/components/admin/member-picker";
import { printRecibo, mesLabel, kz } from "@/lib/recibo";

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900 text-sm";

interface Settings { cotaMensal: number; multaMensal: number; inicioCobranca: string }
interface Status { cotaMensal: number; multaMensal: number; mesesEmFalta: string[]; mesesPagos: string[]; divida: number; emDia: boolean }
interface MemberInfo { _id: string; name: string; numeroOrdem: string; numeroUtente: string; especialidade: string; situacao: string }

export default function CotasPage() {
  const { user } = useAdminAuth();
  const canEdit = user?.role === "super_admin" || user?.role === "bastonaria";
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState<Settings>({ cotaMensal: 0, multaMensal: 0, inicioCobranca: "" });
  const [savedMsg, setSavedMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  const [picked, setPicked] = useState<{ id: string; name: string } | null>(null);
  const [info, setInfo] = useState<{ member: MemberInfo; status: Status } | null>(null);
  const [loadingMember, setLoadingMember] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get<Settings>("/quotas/settings", true).then((s) => { setSettings(s); setForm(s); }).catch(() => {});
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const s = await api.put<Settings>("/quotas/settings", form);
      setSettings(s); setSavedMsg(true); setTimeout(() => setSavedMsg(false), 2000);
    } finally { setSaving(false); }
  };

  const loadMember = async (id: string) => {
    setLoadingMember(true); setInfo(null);
    try { setInfo(await api.get<{ member: MemberInfo; status: Status }>(`/quotas/member/${id}`, true)); } finally { setLoadingMember(false); }
  };

  const registar = async () => {
    if (!info) return;
    if (!confirm(`Registar o pagamento de ${info.status.mesesEmFalta.length} mês(es) — ${kz(info.status.divida)}?`)) return;
    setPaying(true);
    try {
      const res = await api.post<{ recibo: string; status: Status; payment: { meses: string[]; total: number } }>(`/quotas/member/${info.member._id}/pay`, {}, true);
      printRecibo({ recibo: res.recibo, memberName: info.member.name, numeroOrdem: info.member.numeroOrdem, meses: res.payment.meses, cotaMensal: info.status.cotaMensal, multaMensal: info.status.multaMensal, total: res.payment.total });
      await loadMember(info.member._id);
    } catch (err) { alert(err instanceof Error ? err.message : "Erro."); } finally { setPaying(false); }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Cotas" description="Valor mensal da cota e multa, e gestão de pagamentos dos médicos." />

      {/* Definições (só Bastonária) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><Coins className="w-5 h-5 text-angola-navy" /> Valores (definidos pela Bastonária)</h2>
        {settings === null ? <Loader2 className="w-5 h-5 animate-spin text-angola-gold" /> : (
          <>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Cota mensal (Kz)</label>
                <input type="number" min="0" className={inputClass} disabled={!canEdit} value={form.cotaMensal} onChange={(e) => setForm((p) => ({ ...p, cotaMensal: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Multa por mês em atraso (Kz)</label>
                <input type="number" min="0" className={inputClass} disabled={!canEdit} value={form.multaMensal} onChange={(e) => setForm((p) => ({ ...p, multaMensal: Number(e.target.value) }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Início da cobrança (AAAA-MM)</label>
                <input type="month" className={inputClass} disabled={!canEdit} value={form.inicioCobranca} onChange={(e) => setForm((p) => ({ ...p, inicioCobranca: e.target.value }))} />
              </div>
            </div>
            {canEdit ? (
              <button type="button" onClick={saveSettings} disabled={saving} className="mt-4 inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : savedMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />} {savedMsg ? "Guardado" : "Guardar valores"}
              </button>
            ) : <p className="text-xs text-gray-400 mt-3">Só a Bastonária pode alterar os valores.</p>}
          </>
        )}
      </div>

      {/* Consulta / pagamento por médico */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><Wallet className="w-5 h-5 text-angola-navy" /> Situação de um médico</h2>
        <MemberPicker label="Médico" soloVigor={false} placeholder="Procurar médico no banco..."
          selected={picked} onSelect={(m: BankMember | null) => { setPicked(m ? { id: m._id, name: m.name } : null); setInfo(null); if (m) loadMember(m._id); }} />

        {loadingMember ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
        ) : info && (
          <div className="mt-4">
            <div className={`rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 ${info.status.emDia ? "bg-green-50" : "bg-amber-50"}`}>
              <div>
                <p className="font-semibold text-gray-900">{info.member.name}</p>
                <p className="text-xs text-gray-500 font-mono">Ordem {info.member.numeroOrdem}</p>
              </div>
              {info.status.emDia ? (
                <span className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm"><Check className="w-4 h-4" /> Cotas em dia</span>
              ) : (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Dívida ({info.status.mesesEmFalta.length} mês/es)</p>
                  <p className="text-lg font-bold text-amber-700">{kz(info.status.divida)}</p>
                </div>
              )}
            </div>

            {!info.status.emDia && (
              <>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {info.status.mesesEmFalta.map((m) => <span key={m} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{mesLabel(m)}</span>)}
                </div>
                <button type="button" onClick={registar} disabled={paying} className="mt-4 inline-flex items-center gap-2 bg-angola-gold text-angola-navy font-semibold px-5 py-2.5 rounded-lg hover:brightness-95 disabled:opacity-60">
                  {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />} Registar pagamento e emitir recibo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
