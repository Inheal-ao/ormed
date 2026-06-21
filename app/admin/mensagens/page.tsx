"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Download, Mail, MailOpen } from "lucide-react";
import { api, tokenStore, API_URL } from "@/lib/api";
import { PageHeader } from "@/components/admin/admin-ui";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MensagensAdminPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await api.get<Message[]>("/contact/admin/all", true));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (id: string, read: boolean) => {
    await api.patch(`/contact/${id}/read`, { read });
    setItems((prev) => prev.map((m) => (m._id === id ? { ...m, read } : m)));
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta mensagem?")) return;
    await api.delete(`/contact/${id}`);
    setItems((prev) => prev.filter((m) => m._id !== id));
  };

  const exportCsv = async () => {
    const res = await fetch(`${API_URL}/contact/admin/export`, {
      headers: { Authorization: `Bearer ${tokenStore.getAccess()}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mensagens-contacto.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const unread = items.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Mensagens de Contacto" description={unread > 0 ? `${unread} por ler` : "Mensagens recebidas pelo site."} />
        {items.length > 0 && (
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 bg-angola-navy text-white font-semibold px-4 py-2 rounded-lg hover:brightness-110 shrink-0">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-angola-gold" /></div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-16">Ainda não há mensagens.</p>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div key={m._id} className={`bg-white rounded-xl border p-4 ${m.read ? "border-gray-200" : "border-angola-gold/50 bg-angola-cream/20"}`}>
              <div className="flex items-start justify-between gap-3 mb-1">
                <div>
                  <p className="font-semibold text-gray-900">{m.subject || "(sem assunto)"}</p>
                  <p className="text-xs text-gray-500">{m.name} · <a href={`mailto:${m.email}`} className="text-angola-blue hover:underline">{m.email}</a></p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(m.createdAt).toLocaleDateString("pt-PT")}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{m.message}</p>
              <div className="flex gap-2 pt-2 border-t">
                <button type="button" onClick={() => toggleRead(m._id, !m.read)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                  {m.read ? <Mail className="w-3.5 h-3.5" /> : <MailOpen className="w-3.5 h-3.5" />}
                  {m.read ? "Marcar por ler" : "Marcar como lida"}
                </button>
                <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Contacto ORMED")}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-angola-navy text-white rounded-lg hover:brightness-110">
                  Responder
                </a>
                <button type="button" onClick={() => remove(m._id)} className="ml-auto inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
