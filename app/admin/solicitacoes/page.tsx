"use client";

import { ServiceRequestsConsole } from "@/components/admin/service-requests-console";

export default function SolicitacoesAdminPage() {
  return (
    <ServiceRequestsConsole
      scope="ordem"
      title="Documentos da Ordem"
      description="Renovações, carteiras profissionais, cotas e declarações."
    />
  );
}
