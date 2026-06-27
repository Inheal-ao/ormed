import { ServiceInfo } from "@/components/service-info";

export const metadata = { title: "Renovação de Inscrição" };

export default function RenovacaoPage() {
  return (
    <ServiceInfo
      title="Renovação de Inscrição"
      description="Mantenha a sua inscrição na Ordem dos Médicos de Angola em vigor, renovando-a à distância pelo portal do médico."
      passos={[
        "Entre na Área do Membro com as suas credenciais.",
        "Aceda a 'Serviços & Dados' e escolha a Renovação de Inscrição.",
        "Confirme os seus dados e submeta o pedido.",
        "Acompanhe o estado e, quando aplicável, efetue o pagamento e descarregue o recibo.",
      ]}
      nota="A renovação está disponível para médicos já inscritos. Se ainda não é membro, faça primeiro a inscrição na Ordem."
    />
  );
}
