"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/components/admin/auth-context";

export interface NotifItem {
  type: string;
  label: string;
  status: string;
  at: string;
  link: string;
}
export interface NotifSummary {
  total: number;
  counts: {
    validacoes: number;
    solicitacoes: number;
    denuncias: number;
    mensagens: number;
    inscricoes: number;
    apoioPesquisa: number;
    listas: number;
    aprovacoes: number;
  };
  recent: NotifItem[];
}

interface Ctx {
  summary: NotifSummary | null;
  refresh: () => void;
}

const NotificationsContext = createContext<Ctx>({ summary: null, refresh: () => {} });

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAdminAuth();
  const [summary, setSummary] = useState<NotifSummary | null>(null);

  const refresh = useCallback(async () => {
    if (!user || user.role === "universidade") return;
    try {
      setSummary(await api.get<NotifSummary>("/notifications/summary", true));
    } catch {
      /* ignora */
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "universidade") return;
    refresh();
    const t = setInterval(refresh, 60_000); // atualiza a cada minuto
    return () => clearInterval(t);
  }, [user, refresh]);

  return <NotificationsContext.Provider value={{ summary, refresh }}>{children}</NotificationsContext.Provider>;
}

export const useNotifications = () => useContext(NotificationsContext);
