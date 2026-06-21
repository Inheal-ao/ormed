import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      subtitle="Como a Ordem dos Médicos de Angola recolhe, usa e protege os seus dados pessoais."
      updated="Junho de 2026"
      sections={[
        {
          heading: "Âmbito",
          body: "Esta política aplica-se a todos os dados pessoais tratados pela Ordem dos Médicos de Angola (ORMED) através deste site e dos seus serviços digitais. Ao utilizar a plataforma, concorda com as práticas aqui descritas.",
        },
        {
          heading: "Dados que recolhemos",
          body: "Recolhemos apenas os dados necessários, como: nome, email, telefone e perfil ao inscrever-se em eventos, cursos ou ao submeter formulários; conteúdos que nos envia (mensagens, denúncias, reclamações e respetivos anexos); e dados técnicos básicos de navegação. As denúncias podem ser submetidas de forma anónima.",
        },
        {
          heading: "Finalidades do tratamento",
          body: "Utilizamos os seus dados para: processar inscrições e pedidos; responder a contactos e dúvidas; gerir denúncias e reclamações; enviar comunicações e newsletter (quando subscritas); e melhorar os nossos serviços. Não vendemos os seus dados a terceiros.",
        },
        {
          heading: "Partilha de dados",
          body: "Os dados podem ser partilhados internamente com os órgãos competentes da ORMED para análise dos pedidos, e com prestadores técnicos (ex.: alojamento e armazenamento de ficheiros) estritamente para a operação da plataforma, sempre sob obrigações de confidencialidade.",
        },
        {
          heading: "Segurança",
          body: "Adotamos medidas técnicas e organizativas para proteger os seus dados contra acesso não autorizado, perda ou divulgação, incluindo cifragem de comunicações, controlo de acessos e mecanismos de proteção contra ataques.",
        },
        {
          heading: "Conservação",
          body: "Conservamos os dados apenas pelo período necessário às finalidades para que foram recolhidos ou conforme exigido por obrigações legais. Os pedidos resolvidos podem ser mantidos para fins de registo e estatística.",
        },
        {
          heading: "Os seus direitos",
          body: "Pode solicitar o acesso, a correção ou a eliminação dos seus dados, bem como opor-se a determinados tratamentos. Para exercer estes direitos, contacte-nos através dos canais indicados na página de Contactos.",
        },
        {
          heading: "Alterações",
          body: "Esta política pode ser atualizada periodicamente. A versão em vigor será sempre a publicada nesta página, com a respetiva data de atualização.",
        },
      ]}
    />
  );
}
