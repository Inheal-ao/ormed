import { ServicePortal } from "@/components/service-portal";

export const metadata = { title: "Inscrição na Ordem" };

export default function InscricaoPage() {
  return (
    <ServicePortal
      serviceType="inscricao"
      title="Inscrição na Ordem"
      description="Solicite a sua inscrição na Ordem dos Médicos de Angola. Submeta os documentos, acompanhe pelo código de serviço e efetue o pagamento online."
      paid
      intro="Preencha o formulário e anexe os documentos exigidos. Receberá um código de serviço para acompanhar o processo. Após a análise, receberá as coordenadas de pagamento no separador de consulta, onde poderá enviar o comprovativo e descarregar o recibo."
    />
  );
}
