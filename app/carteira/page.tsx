import { ServiceInfo } from "@/components/service-info";

export const metadata = { title: "Carteira Profissional" };

export default function CarteiraPage() {
  return (
    <ServiceInfo
      title="Carteira Profissional"
      description="Peça a emissão ou a 2ª via da sua carteira profissional de médico, de forma segura, no portal do médico."
      passos={[
        "Entre na Área do Membro com as suas credenciais.",
        "Aceda a 'Serviços & Dados' e escolha Carteira Profissional (emissão ou 2ª via).",
        "Confirme os seus dados e submeta o pedido.",
        "Acompanhe o estado, efetue o pagamento e levante/descarregue o comprovativo.",
      ]}
      nota="A carteira é emitida a médicos com inscrição em vigor. A 2ª via aplica-se em caso de perda, roubo ou dano."
    />
  );
}
