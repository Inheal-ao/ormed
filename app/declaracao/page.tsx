import { ServicePortal } from "@/components/service-portal";

export const metadata = { title: "Declaração da Ordem" };

export default function DeclaracaoPage() {
  return (
    <ServicePortal
      serviceType="declaracao"
      title="Declaração da Ordem"
      description="Solicite uma declaração emitida pela ORMED, acompanhe o pedido pelo código e efetue o pagamento online."
      paid
      intro="Submeta o pedido com os documentos necessários. Após análise, receberá as coordenadas de pagamento no separador de consulta, onde poderá enviar o comprovativo e descarregar o recibo."
    />
  );
}
