import { ServiceInfo } from "@/components/service-info";

export const metadata = { title: "Pagamento de Cotas" };

export default function PagarCotasPage() {
  return (
    <ServiceInfo
      title="Pagamento de Cotas"
      description="Consulte e regularize as suas cotas de membro da Ordem dos Médicos de Angola diretamente no portal do médico."
      passos={[
        "Entre na Área do Membro com as suas credenciais.",
        "Aceda a 'As minhas cotas' para ver a sua dívida atualizada.",
        "Efetue o pagamento dos meses em falta.",
        "Descarregue o recibo, emitido automaticamente após a confirmação.",
      ]}
      nota="O valor da cota e da eventual multa é definido pela Bastonária. A dívida corresponde aos meses em falta desde o início de cobrança."
    />
  );
}
