import { ServicePortal } from "@/components/service-portal";

export const metadata = { title: "Renovação de Inscrição" };

export default function RenovacaoPage() {
  return (
    <ServicePortal
      serviceType="renovacao-inscricao"
      title="Renovação de Inscrição"
      description="Renove a sua inscrição na ORMED à distância. Submeta o pedido, acompanhe pelo código e efetue o pagamento online."
      paid
      intro="Submeta o pedido e os documentos necessários. Após análise, receberá as coordenadas de pagamento no separador de consulta, onde poderá enviar o comprovativo e descarregar o recibo."
    />
  );
}
