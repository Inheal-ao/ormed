import { ServicePortal } from "@/components/service-portal";

export const metadata = { title: "Validação de Documentos" };

export default function ValidacaoPage() {
  return (
    <ServicePortal
      serviceType="validacao-documentos"
      title="Validação de Documentos"
      description="Valide à distância se um documento foi emitido pela Ordem e se o médico está em situação regular — sem precisar de se deslocar."
      intro="Preencha o formulário e anexe o documento. Receberá um código de serviço para acompanhar o estado da validação. Não é necessário deslocar-se com documentos físicos."
    />
  );
}
