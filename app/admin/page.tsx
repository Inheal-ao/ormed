"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Newspaper, CalendarDays, BookOpen, Users, Handshake } from "lucide-react";
import { api } from "@/lib/api";
import { useAdminAuth } from "@/components/admin/auth-context";
import { Paginated } from "@/lib/admin-types";

interface Stat {
  label: string;
  href: string;
  icon: typeof Newspaper;
  count: number | null;
}

export default function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<Stat[]>([
    { label: "Notícias", href: "/admin/noticias", icon: Newspaper, count: null },
    { label: "Eventos", href: "/admin/eventos", icon: CalendarDays, count: null },
    { label: "Revistas", href: "/admin/revistas", icon: BookOpen, count: null },
    { label: "Bastonários", href: "/admin/bastonarios", icon: Users, count: null },
    { label: "Parceiros", href: "/admin/parceiros", icon: Handshake, count: null },
  ]);

  useEffect(() => {
    const load = async () => {
      const [news, events, magazines, bastonarios, partners] = await Promise.allSettled([
        api.get<Paginated<unknown>>("/news/admin/all?limit=1", true),
        api.get<Paginated<unknown>>("/events/admin/all?limit=1", true),
        api.get<Paginated<unknown>>("/magazines/admin/all?limit=1", true),
        api.get<unknown[]>("/bastonarios/admin/all", true),
        api.get<unknown[]>("/partners/admin/all", true),
      ]);

      const count = (r: PromiseSettledResult<unknown>, kind: "page" | "array") => {
        if (r.status !== "fulfilled") return 0;
        if (kind === "page") return (r.value as Paginated<unknown>).total;
        return (r.value as unknown[]).length;
      };

      setStats((prev) =>
        prev.map((s) => {
          switch (s.label) {
            case "Notícias":
              return { ...s, count: count(news, "page") };
            case "Eventos":
              return { ...s, count: count(events, "page") };
            case "Revistas":
              return { ...s, count: count(magazines, "page") };
            case "Bastonários":
              return { ...s, count: count(bastonarios, "array") };
            case "Parceiros":
              return { ...s, count: count(partners, "array") };
            default:
              return s;
          }
        }),
      );
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        Olá, {user?.name?.split(" ")[0]}
      </h1>
      <p className="text-gray-500 mb-8">Gestão de conteúdos da plataforma ORMED.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-angola-gold hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-10 h-10 rounded-lg bg-angola-navy/5 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-angola-navy" />
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {s.count === null ? "—" : s.count}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
