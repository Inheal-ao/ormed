export interface Asset {
  url: string;
  publicId?: string;
}

export type UserRoleType =
  | "super_admin" | "admin" | "editor"
  | "bastonaria" | "funcionario" | "universidade" | "colegio";

export interface College {
  _id: string; name: string; especialidade: string; description: string;
  presidentId: string; coordinator: string; status: string;
}
export interface Interno {
  _id: string; college: string; memberId: string; name: string; numeroOrdem: string; biPassaporte: string;
  phone: string; email: string; anoInternato: string; hospital: string;
  orientadorId: string; orientador: string; status: string; createdAt: string;
}
export interface Programa {
  _id: string; college: string; tipo: string; title: string; ano: string; description: string; document: Asset | null; createdAt: string;
}
export interface BankMember {
  _id: string; numeroUtente: string; numeroOrdem: string; name: string;
  especialidade: string; situacao: string; categorias: string[]; collegeId?: string;
}
export interface Competencia {
  competencia: string; totalMinimo: number; observador: number; ajudante: number; executor: number; totalRealizado: number;
}
export interface Rotation {
  _id: string; interno: string; college: string; internoName: string; especialidade: string;
  rotationName: string; periodoInicio: string; periodoFim: string; anoInternato: string;
  provincia: string; municipio: string; hospital: string; instituicaoResponsavel: string;
  competencias: Competencia[]; observacoes: string;
  evaluatorId: string; evaluator: string;
  status: string; signedDocument: Asset | null; createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  permissions?: string[];
  universityName?: string;
  responsibleType?: string;
  lastLoginAt?: string | null;
}

export interface ManagedUser {
  _id: string;
  name: string;
  email: string;
  role: UserRoleType;
  permissions: string[];
  universityName: string;
  responsibleType: string;
  institutionType?: string;
  phone: string;
  collegeId?: string;
  isActive: boolean;
  isBlocked: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  source: string;
  coverImage: Asset | null;
  images: Asset[];
  category: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface EventItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: Asset | null;
  location: string;
  startDate: string;
  endDate: string | null;
  capacity: number;
  price: number;
  registrationOpen: boolean;
  registrationType: "internal" | "external";
  externalLink: string;
  isPublished: boolean;
  createdAt: string;
}

export interface JobItem {
  _id: string;
  title: string;
  slug: string;
  entity: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  deadline: string | null;
  applicationEmail: string;
  externalLink: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface AnnouncementItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  content: string;
  coverImage: Asset | null;
  images: Asset[];
  pdf: Asset | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface CourseItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: Asset | null;
  instructor: string;
  area: string;
  modality: "presencial" | "online" | "misto";
  duration: string;
  location: string;
  startDate: string | null;
  capacity: number;
  price: number;
  registrationOpen: boolean;
  registrationType: "internal" | "external";
  externalLink: string;
  isPublished: boolean;
  createdAt: string;
}

export interface OrgaoMember {
  name: string;
  role?: string;
}

export interface OrgaoItem {
  _id: string;
  name: string;
  scope: "nacional" | "regional";
  region: "" | "norte" | "centro" | "sul";
  description: string;
  members: OrgaoMember[];
  order: number;
  isPublished: boolean;
}

export interface EventRegistration {
  _id: string;
  event: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  notes: string;
  attachments: Asset[];
  paymentProof: Asset | null;
  status: "pending" | "validated" | "rejected";
  adminNotes: string;
  createdAt: string;
}

export interface MagazineItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  edition: string;
  year: number;
  coverImage: Asset | null;
  pdf: Asset | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface BastonarioItem {
  _id: string;
  name: string;
  photo: Asset | null;
  mandate: string;
  bio: string;
  quote: string;
  isCurrent: boolean;
  order: number;
  isPublished: boolean;
}

export interface PartnerItem {
  _id: string;
  name: string;
  logo: Asset | null;
  website: string;
  order: number;
  isPublished: boolean;
}

export interface BulletinItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  edition: string;
  year: number;
  coverImage: Asset | null;
  images: Asset[];
  pdf: Asset | null;
  videoUrl: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface BookItem {
  _id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  year: number;
  coverImage: Asset | null;
  pdf: Asset | null;
  externalLink: string;
  isPublished: boolean;
  createdAt: string;
}

export interface PodcastItem {
  _id: string;
  title: string;
  slug: string;
  episode: string;
  description: string;
  youtubeUrl: string;
  coverImage: Asset | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  image: Asset;
  caption: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
}

export interface DocumentItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  pdf: Asset | null;
  externalLink: string;
  order: number;
  isPublished: boolean;
}

export interface ArticleItem {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  authors: string;
  affiliation: string;
  category: string;
  abstract: string;
  content: string;
  keywords: string[];
  coverImage: Asset | null;
  pdf: Asset | null;
  externalLink: string;
  doi: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export interface StatItem {
  _id: string;
  value: string;
  label: string;
  icon: string;
  order: number;
  isPublished: boolean;
}

export interface SpecialtyItem {
  _id: string;
  name: string;
  order: number;
  isPublished: boolean;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isPublished: boolean;
}

export interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  location: string;
  text: string;
  avatar: Asset | null;
  order: number;
  isPublished: boolean;
}

export interface MilestoneItem {
  _id: string;
  year: string;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}
