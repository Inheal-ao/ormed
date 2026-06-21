import { ServicePortal } from "@/components/service-portal";

export const metadata = { title: "Pagamento de Cotas" };

export default function PagarCotasPage() {
  return (
    <ServicePortal
      serviceType="pagar-cotas"
      title="Pagamento de Cotas"
      description="Regularize as suas cotas de membro da ORMED à distância. Submeta o pedido, acompanhe pelo código e envie o comprovativo."
      paid
      intro="Submeta o pedido. Receberá as coordenadas e o valor a pagar no separador de consulta, onde poderá enviar o comprovativo e descarregar o recibo após confirmação."
    />
  );
}
