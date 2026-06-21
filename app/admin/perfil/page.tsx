"use client";

import { useState } from "react";
import { Loader2, KeyRound, Check } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";
import { useAdminAuth } from "@/components/admin/auth-context";
import { PasswordInput } from "@/components/admin/password-input";
import { isStrongPassword } from "@/lib/password";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Administrador (Sistema)",
  admin: "Administrador",
  editor: "Editor",
  bastonaria: "Bastonária",
  funcionario: "Funcionário",
  universidade: "Universidade",
};

const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-angola-gold text-gray-900";

export default function PerfilPage() {
  const { user } = useAdminAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!isStrongPassword(next)) {
      setFeedback({ ok: false, text: "A nova password deve ter mín. 8 caracteres, com maiúscula, minúscula, número e símbolo." });
      return;
    }
    if (next !== confirm) {
      setFeedback({ ok: false, text: "A confirmação não coincide." });
      return;
    }
    setSaving(true);
    try {
      await api.patch("/profile/password", { currentPassword: current, newPassword: next });
      setFeedback({ ok: true, text: "Password alterada com sucesso." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setFeedback({ ok: false, text: err instanceof Error ? err.message : "Erro ao alterar a password." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg">
      <PageHeader title="O meu perfil" description="Os seus dados e segurança da conta." />

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-1 text-sm">
        <p><span className="text-gray-400">Nome:</span> {user?.name}</p>
        <p><span className="text-gray-400">Email:</span> {user?.email}</p>
        <p><span className="text-gray-400">Perfil:</span> {ROLE_LABEL[user?.role ?? ""] ?? user?.role}</p>
        {user?.universityName && <p><span className="text-gray-400">Instituição:</span> {user.universityName}</p>}
        <p className="text-xs text-gray-400 pt-2">As suas informações só podem ser alteradas pela Bastonária ou pelo Administrador.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><KeyRound className="w-4 h-4" /> Alterar password</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password atual</label>
          <input type="password" aria-label="Password atual" placeholder="Password atual" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova password</label>
          <PasswordInput value={next} onChange={setNext} placeholder="Nova password" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nova password</label>
          <input type="password" aria-label="Confirmar nova password" placeholder="Repita a nova password" className={inputClass} value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        {feedback && (
          <p className={`text-sm flex items-center gap-1.5 ${feedback.ok ? "text-green-600" : "text-red-600"}`}>
            {feedback.ok && <Check className="w-4 h-4" />}{feedback.text}
          </p>
        )}
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Alterar password
        </button>
      </form>
    </div>
  );
}
