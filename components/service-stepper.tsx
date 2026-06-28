"use client";

import { Check, X } from "lucide-react";
import { computeSteps } from "@/lib/service-requests";

/** Gráfico horizontal das etapas do processo: concluídas, atual, por fazer ou erro. */
export function ServiceStepper({ isPaid, status, isInscricao = false }: { isPaid: boolean; status: string; isInscricao?: boolean }) {
  const steps = computeSteps(isPaid, status, isInscricao);
  return (
    <div className="flex items-start overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s.key} className="flex items-start shrink-0">
          <div className="flex flex-col items-center w-[72px] sm:w-20">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                s.state === "done"
                  ? "bg-green-500 border-green-500 text-white"
                  : s.state === "current"
                  ? "bg-angola-gold border-angola-gold text-angola-navy ring-4 ring-angola-gold/20"
                  : s.state === "error"
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {s.state === "done" ? <Check className="w-4 h-4" /> : s.state === "error" ? <X className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] sm:text-[11px] text-center mt-1.5 leading-tight ${s.state === "todo" ? "text-gray-400" : "text-gray-700"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-4 sm:w-6 mt-4 ${s.state === "done" ? "bg-green-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
