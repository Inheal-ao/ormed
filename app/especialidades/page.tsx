"use client";

import { Stethoscope, Loader2 } from "lucide-react";
import { usePublicData } from "@/lib/use-public-data";
import { SpecialtyItem } from "@/lib/admin-types";

export default function EspecialidadesPage() {
  const { data, loading } = usePublicData<SpecialtyItem[]>("/specialties");
  const specialties = data ?? [];

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Especialidades</h1>
          <p className="text-gray-300 text-lg mt-4">
            Especialidades médicas reconhecidas pela ORMED
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-angola-gold" />
          </div>
        ) : specialties.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            Lista de especialidades em atualização.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 hover:border-angola-gold hover:shadow-sm transition"
              >
                <span className="w-10 h-10 rounded-lg bg-angola-navy/5 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-angola-navy" />
                </span>
                <span className="font-medium text-gray-800">{s.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
