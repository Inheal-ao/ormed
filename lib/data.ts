export const siteConfig = {
  name: "Ordem dos Médicos de Angola",
  acronym: "ORMED",
  founded: 1991,
  address: "Rua Amílcar Cabral, 151/153, Maíanga, Luanda",
  phone: "+244 222 123 456",
  email: "geral@ordemdosmedicos.ao",
  social: {
    facebook: "https://facebook.com/ormed.ao",
    twitter: "https://twitter.com/ormed_ao",
    linkedin: "https://linkedin.com/company/ormed",
    youtube: "https://youtube.com/@ordemdosmedicosangola",
  },
};

export const navItems = [
  {
    label: "Institucional",
    href: "#",
    children: [
      { label: "Sobre Nós", href: "/sobre/" },
      { label: "História", href: "/historia/" },
      { label: "Estatutos", href: "/estatutos/" },
      { label: "Órgãos Nacionais", href: "/orgaos-nacionais/" },
      { label: "Órgãos Regionais", href: "/orgaos-regionais/" },
      { label: "Bastonários", href: "/bastonarios/" },
    ],
  },
  {
    label: "Médicos",
    href: "#",
    children: [
      { label: "Área do Médico (a minha ficha)", href: "/area-membro/" },
      { label: "Inscrição na Ordem", href: "/inscricao/" },
      { label: "Renovação de Inscrição", href: "/renovacao/" },
      { label: "Carteira Profissional / 2ª Via", href: "/carteira/" },
      { label: "Pagar Cotas", href: "/pagar-cotas/" },
      { label: "Declaração da Ordem", href: "/declaracao/" },
      { label: "Especialidades", href: "/especialidades/" },
      { label: "Formação Contínua", href: "/formacao-continua/" },
      { label: "Vagas de Emprego", href: "/vagas/" },
    ],
  },
  {
    label: "Ética & Deontologia",
    href: "#",
    children: [
      { label: "Textos Fundadores da Ética", href: "/textos-fundadores/" },
      { label: "Código Deontológico", href: "/codigo-deontologico/" },
      { label: "Código Disciplinar", href: "/codigo-disciplinar/" },
      { label: "Regulamento Geral", href: "/regulamento-geral/" },
      { label: "Denúncias", href: "/denuncias/" },
      { label: "Processo Ético", href: "/processo-etico/" },
    ],
  },
  {
    label: "Notícias",
    href: "/noticias/",
  },
  {
    label: "Comunicados",
    href: "/comunicados/",
  },
  {
    label: "Eventos",
    href: "/eventos/",
  },
  {
    label: "Publicações",
    href: "#",
    children: [
      { label: "Revista ORMED", href: "/revista/" },
      { label: "RevMed (Científica)", href: "/revmed/" },
      { label: "Boletins", href: "/boletins/" },
      { label: "Livros", href: "/livros/" },
      { label: "Podcast", href: "/podcast/" },
      { label: "Galeria", href: "/galeria/" },
    ],
  },
  {
    label: "Serviços",
    href: "#",
    children: [
      { label: "Consultar Estado do Serviço", href: "/consultar/" },
      { label: "Validação de Documentos", href: "/validacao/" },
      { label: "Consulta de Médicos", href: "/consulta-medicos/" },
      { label: "Apoio à Pesquisa Científica", href: "/pesquisa/" },
      { label: "Biblioteca", href: "/biblioteca/" },
    ],
  },
  {
    label: "Contactos",
    href: "/contactos/",
  },
];

export const stats = [
  { value: "35+", label: "Anos de Existência", icon: "Calendar" },
  { value: "12.500+", label: "Médicos Inscritos", icon: "Users" },
  { value: "18", label: "Províncias com Delegações", icon: "MapPin" },
  { value: "98%", label: "Taxa de Satisfação", icon: "Heart" },
];

export const bastonarios = [
  {
    name: "Dra. Jovita André",
    period: "2025 - Presente",
    image: "/images/bastonaria.jpg",
    bio: "Licenciatura em Medicina - UAN (1993). Especialidade em Medicina Interna - Hospital da Força Aérea do Galeão/Rio (2004). Especialidade em Reumatologia - UFRJ (2005). Docente Universitária. MBA em Gestão em Saúde. Coronel-Médica reformada das FAA.",
    quote: "Aproveito esse momento para reconhecer a importância de todos e a graça que é poder contar com a colaboração e a parceria de pessoas de bem. Juntos podemos fazer a diferença!",
    isCurrent: true,
  },
  {
    name: "Dra. Elisa Gaspar",
    period: "2019 - 2025",
    image: "/images/bastonaria-elisa-gaspar.jpg",
    bio: "Ex-Bastonária da Ordem dos Médicos de Angola.",
    quote: "",
    isCurrent: false,
  },
  {
    name: "Dr. Carlos José Pintos",
    period: "2007 - 2019",
    image: "/images/bastonario-pintos-sousa.png",
    bio: "Ex-Bastonário da Ordem dos Médicos de Angola.",
    quote: "",
    isCurrent: false,
  },
  {
    name: "Dr. José João Bastos",
    period: "2002 - 2007",
    image: "/images/bastonario-bastos-santos.png",
    bio: "Ex-Bastonário da Ordem dos Médicos de Angola.",
    quote: "",
    isCurrent: false,
  },
  {
    name: "Dr. Carlos Fernandes",
    period: "1999 - 2002",
    image: "/images/bastonario-fernandes-santos.png",
    bio: "Ex-Bastonário da Ordem dos Médicos de Angola.",
    quote: "",
    isCurrent: false,
  },
  {
    name: "Dr. Carlos Alberto Mac",
    period: "1997 - 1998",
    image: "/images/bastonario-mac-mahon.png",
    bio: "Ex-Bastonário da Ordem dos Médicos de Angola.",
    quote: "",
    isCurrent: false,
  },
];

export const news = [
  {
    id: 1,
    title: "Cerimónia de Tomada de Posse da Dra. Jovita André",
    excerpt:
      "A nova Bastonária da Ordem dos Médicos de Angola tomou posse numa cerimónia marcada pela presença da Ministra da Saúde e diversas autoridades.",
    date: "2024-11-22",
    category: "Institucional",
    image: "/images/bastonaria-2.jpg",
    author: "ORMED",
    featured: true,
  },
  {
    id: 2,
    title: "ORMED lança programa de Formação Contínua 2025",
    excerpt:
      "Novo programa inclui workshops, webinars e conferências em todas as províncias do país, com foco em especialidades emergentes.",
    date: "2025-01-15",
    category: "Formação",
    image: "/images/news-formacao.jpg",
    author: "Comissão de Formação",
    featured: false,
  },
  {
    id: 3,
    title: "Parceria com Ordem dos Médicos de Portugal fortalecida",
    excerpt:
      "Acordo de cooperação técnica visa o intercâmbio de conhecimentos e a capacitação de médicos angolanos em Portugal.",
    date: "2025-02-10",
    category: "Cooperação",
    image: "/images/news-encontro-2.jpg",
    author: "Gabinete de Relações Internacionais",
    featured: false,
  },
  {
    id: 4,
    title: "Dia Mundial da Saúde: ORMED promove campanha nacional",
    excerpt:
      "Campanha de sensibilização sobre doenças cardiovasculares alcançou mais de 50 mil pessoas em todo o território nacional.",
    date: "2025-04-07",
    category: "Saúde Pública",
    image: "/images/news-gala.jpg",
    author: "Comissão de Saúde Pública",
    featured: false,
  },
  {
    id: 5,
    title: "Novo Código Deontológico entra em vigor",
    excerpt:
      "Revisão do Código Deontológico incorpora novas realidades da prática médica, incluindo telemedicina e inteligência artificial.",
    date: "2025-03-01",
    category: "Ética",
    image: "/images/news-random-1.jpg",
    author: "Conselho Deontológico",
    featured: false,
  },
  {
    id: 6,
    title: "Congresso Nacional de Medicina 2025",
    excerpt:
      "O maior evento médico do país reunirá mais de 2.000 profissionais em Luanda para discutir os desafios do sistema de saúde angolano.",
    date: "2025-05-20",
    category: "Eventos",
    image: "/images/news-congresso-2.jpg",
    author: "Comissão Organizadora",
    featured: true,
  },
];

export const events = [
  {
    id: 1,
    title: "Webinar: IA na Medicina",
    description: "O que muda na investigação e nos artigos científicos?",
    date: "2025-06-18",
    time: "18:30",
    location: "Plataforma Zoom",
    type: "Webinar",
    image: "/images/event-1.jpg",
    registrationOpen: true,
    spots: 500,
    registered: 342,
  },
  {
    id: 2,
    title: "Congresso Nacional de Medicina 2025",
    description: "O maior evento médico de Angola com participação internacional.",
    date: "2025-09-15",
    time: "08:00",
    location: "Centro de Convenções de Luanda",
    type: "Congresso",
    image: "/images/event-2.jpg",
    registrationOpen: true,
    spots: 2000,
    registered: 1245,
  },
  {
    id: 3,
    title: "Workshop de Cirurgia Minimamente Invasiva",
    description: "Técnicas avançadas em laparoscopia e robótica cirúrgica.",
    date: "2025-07-10",
    time: "09:00",
    location: "Hospital Militar Principal, Luanda",
    type: "Workshop",
    image: "/images/event-3.jpg",
    registrationOpen: true,
    spots: 80,
    registered: 67,
  },
  {
    id: 4,
    title: "Jornadas de Medicina Interna",
    description: "Atualização em patologias internas com casos clínicos reais.",
    date: "2025-08-05",
    time: "08:30",
    location: "Faculdade de Medicina da UAN",
    type: "Jornadas",
    image: "/images/event-4.jpg",
    registrationOpen: false,
    spots: 150,
    registered: 150,
  },
];

export const services = [
  {
    title: "Consulta de Médicos",
    description: "Verifique a regularidade do registo de qualquer médico em Angola.",
    icon: "Search",
    href: "/consulta-medicos/",
    color: "bg-blue-500",
  },
  {
    title: "Inscrição Online",
    description: "Inscreva-se na Ordem dos Médicos de forma digital e rápida.",
    icon: "UserPlus",
    href: "/inscricao/",
    color: "bg-angola-gold",
  },
  {
    title: "Área do Membro",
    description: "Aceda à sua área pessoal com todos os serviços disponíveis.",
    icon: "Shield",
    href: "/area-membro/",
    color: "bg-medical-teal",
  },
  {
    title: "Prescrição Eletrónica",
    description: "Sistema seguro de prescrição digital para médicos e farmácias.",
    icon: "FileText",
    href: "/prescricao/",
    color: "bg-medical-emerald",
  },
  {
    title: "Validação de Documentos",
    description: "Valide certidões e documentos emitidos pela ORMED.",
    icon: "CheckCircle",
    href: "/validacao/",
    color: "bg-medical-indigo",
  },
  {
    title: "Denúncias",
    description: "Apresente denúncias sobre conduta médica de forma segura.",
    icon: "AlertTriangle",
    href: "/denuncias/",
    color: "bg-amber-500",
  },
];

export const testimonials = [
  {
    name: "Dr. António Silva",
    role: "Médico Internista",
    location: "Luanda",
    text: "A ORMED tem sido fundamental para a minha carreira. A formação contínua e o apoio ético são incomparáveis.",
    avatar: "/images/avatar1.jpg",
  },
  {
    name: "Dra. Maria Fernandes",
    role: "Pediatra",
    location: "Benguela",
    text: "Graças à ORMED, consegui especialização em Portugal com bolsa de estudo. A instituição realmente cuida dos seus membros.",
    avatar: "/images/avatar2.jpg",
  },
  {
    name: "Dr. Pedro Kiala",
    role: "Cirurgião",
    location: "Huambo",
    text: "O sistema de prescrição eletrónica revolucionou a minha prática clínica. Excelente inovação da ORMED.",
    avatar: "/images/avatar3.jpg",
  },
  {
    name: "Dra. Ana Costa",
    role: "Ginecologista",
    location: "Lubango",
    text: "A representação da ORMED junto do governo tem melhorado significativamente as condições de trabalho dos médicos.",
    avatar: "/images/avatar4.jpg",
  },
];

export const faqs = [
  {
    question: "Como posso inscrever-me na Ordem dos Médicos?",
    answer:
      "Para se inscrever, necessita de apresentar o diploma de licenciatura em Medicina homologado, certificado de residência (se aplicável), fotografia tipo passe, e pagar a taxa de inscrição. Pode efetuar o processo online através da nossa plataforma digital.",
  },
  {
    question: "Qual a diferença entre a Ordem e o Sindicato dos Médicos?",
    answer:
      "A Ordem dos Médicos regula o exercício profissional, garante a ética e deontologia médica, e atribui a carteira profissional. O Sindicato dos Médicos defende os interesses laborais e socioeconómicos dos médicos. São entidades distintas e complementares.",
  },
  {
    question: "Como renovar a minha inscrição?",
    answer:
      "A renovação anual pode ser feita online na Área do Membro, mediante pagamento da quota anual. Receberá um lembrete 30 dias antes do vencimento.",
  },
  {
    question: "A ORMED emprega médicos?",
    answer:
      "Não. A Ordem não é responsável pela empregabilidade dos médicos. A nossa função é regular o exercício da profissão, garantir a qualidade e a ética. Para questões laborais, contacte o Sindicato dos Médicos.",
  },
  {
    question: "Como apresentar uma denúncia?",
    answer:
      "Pode apresentar uma denúncia através do nosso formulário online na secção 'Denúncias', ou presencialmente na sede da ORMED. Toda a informação é tratada com confidencialidade.",
  },
  {
    question: "Quais as especialidades reconhecidas pela ORMED?",
    answer:
      "A ORMED reconhece mais de 50 especialidades médicas, desde Medicina Geral e Familiar até especialidades cirúrgicas e de diagnóstico. Consulte a lista completa na secção 'Especialidades'.",
  },
];

export const specialties = [
  "Medicina Geral e Familiar",
  "Medicina Interna",
  "Cirurgia Geral",
  "Pediatria",
  "Ginecologia e Obstetrícia",
  "Anestesiologia",
  "Cardiologia",
  "Dermatologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Hematologia",
  "Infectologia",
  "Nefrologia",
  "Neurologia",
  "Oftalmologia",
  "Ortopedia",
  "Otorrinolaringologia",
  "Pneumologia",
  "Psiquiatria",
  "Radiologia",
  "Reumatologia",
  "Urologia",
  "Oncologia",
  "Medicina Intensiva",
  "Medicina de Emergência",
];

// 21 províncias de Angola (nova gestão administrativa, reforma de 2024).
export const provinces = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando",
  "Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Icolo e Bengo",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Moxico Leste",
  "Namibe",
  "Uíge",
  "Zaire",
];

export const timeline = [
  {
    year: "1991",
    title: "Fundação da ORMED",
    description:
      "Criação da Ordem dos Médicos de Angola como instituição de utilidade pública.",
  },
  {
    year: "1997",
    title: "Primeira Bastonaria",
    description: "Dr. Carlos Alberto Mac assume como primeiro Bastonário.",
  },
  {
    year: "2002",
    title: "Expansão Nacional",
    description:
      "Início da criação de delegações em todas as províncias de Angola.",
  },
  {
    year: "2010",
    title: "Código Deontológico",
    description: "Aprovação do primeiro Código Deontológico da medicina angolana.",
  },
  {
    year: "2015",
    title: "Plataforma Digital",
    description: "Lançamento do primeiro sistema de gestão online para médicos.",
  },
  {
    year: "2019",
    title: "Parceria Internacional",
    description:
      "Acordo de cooperação com a Ordem dos Médicos de Portugal e outras ordens internacionais.",
  },
  {
    year: "2025",
    title: "Nova Era",
    description:
      "Dra. Jovita André assume a Bastonaria, trazendo nova visão para a instituição.",
  },
  {
    year: "2025",
    title: "Transformação Digital",
    description:
      "Lançamento da nova plataforma completa com serviços digitais avançados.",
  },
];
