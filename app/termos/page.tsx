import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      subtitle="Condições de utilização do site e dos serviços digitais da Ordem dos Médicos de Angola."
      updated="Junho de 2026"
      sections={[
        {
          heading: "Aceitação",
          body: "Ao aceder e utilizar este site, o utilizador aceita os presentes Termos de Uso. Caso não concorde, deve abster-se de utilizar a plataforma.",
        },
        {
          heading: "Utilização da plataforma",
          body: "O utilizador compromete-se a usar a plataforma de forma lícita, não publicando ou submetendo conteúdos falsos, ofensivos, difamatórios ou que violem direitos de terceiros. É proibido tentar comprometer a segurança ou o funcionamento do site.",
        },
        {
          heading: "Conteúdos e propriedade intelectual",
          body: "Os conteúdos disponibilizados (textos, imagens, documentos, marcas e logótipos) pertencem à ORMED ou aos seus titulares e estão protegidos por lei. A sua reprodução carece de autorização, salvo para uso pessoal e não comercial.",
        },
        {
          heading: "Inscrições e submissões",
          body: "As inscrições em eventos e cursos, bem como as denúncias, reclamações e pedidos submetidos, estão sujeitas a análise pela ORMED. As informações fornecidas devem ser verdadeiras e completas. Comprovativos de pagamento e documentos anexados são tratados de forma confidencial.",
        },
        {
          heading: "Assistente de IA",
          body: "O assistente \"Kamba Med\" fornece informação de apoio com base nos conteúdos da plataforma. As respostas têm caráter informativo e não substituem aconselhamento médico, jurídico ou profissional individual. Para questões clínicas, consulte sempre um médico.",
        },
        {
          heading: "Limitação de responsabilidade",
          body: "A ORMED envida esforços para manter a informação atualizada e o serviço disponível, mas não garante a ausência de erros ou interrupções. A ORMED não se responsabiliza por danos resultantes do uso indevido da plataforma ou de conteúdos de sites externos ligados.",
        },
        {
          heading: "Alterações",
          body: "A ORMED pode alterar estes Termos a qualquer momento. A versão em vigor é a publicada nesta página. A utilização continuada após alterações implica a sua aceitação.",
        },
        {
          heading: "Contacto",
          body: "Para qualquer questão sobre estes Termos, contacte a ORMED através dos canais indicados na página de Contactos.",
        },
      ]}
    />
  );
}
