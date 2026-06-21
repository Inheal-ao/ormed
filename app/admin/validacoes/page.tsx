"use client";

import { ServiceRequestsConsole } from "@/components/admin/service-requests-console";

export default function ValidacoesAdminPage() {
  return (
    <ServiceRequestsConsole
      scope="validacao"
      title="Validação de Documentos"
      description="Pedidos de validação de documentos emitidos pela Ordem."
    />
  );
}
