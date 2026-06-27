import { ServiceInfo } from "@/components/service-info";

export const metadata = { title: "Declaração da Ordem" };

export default function DeclaracaoPage() {
  return (
    <ServiceInfo
      title="Declaração da Ordem"
      description="Obtenha uma declaração oficial emitida pela Ordem dos Médicos de Angola — de inscrição, de situação ou outra — diretamente no portal do médico."
      passos={[
        "Entre na Área do Membro com as suas credenciais.",
        "Aceda a 'Serviços & Dados' e escolha Declaração da Ordem.",
        "Indique o tipo de declaração pretendido e submeta o pedido.",
        "Acompanhe o estado e descarregue a declaração/recibo quando emitidos.",
      ]}
      nota="As declarações são emitidas a médicos inscritos. O documento fica disponível no seu portal, em 'Atividade & Certificados'."
    />
  );
}
