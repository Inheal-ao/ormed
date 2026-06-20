import {
  Users,
  Building,
  Building2,
  GraduationCap,
  Globe,
  Calendar,
  FileCheck,
  Heart,
  MapPin,
  Award,
  Activity,
  Stethoscope,
  ShieldCheck,
  Shield,
  LucideIcon,
} from "lucide-react";

/** Mapa de nomes de ícone (definidos no painel) para componentes lucide-react. */
export const STAT_ICONS: Record<string, LucideIcon> = {
  Users,
  Building,
  Building2,
  GraduationCap,
  Globe,
  Calendar,
  FileCheck,
  Heart,
  MapPin,
  Award,
  Activity,
  Stethoscope,
  ShieldCheck,
  Shield,
};

export function getStatIcon(name: string): LucideIcon {
  return STAT_ICONS[name] ?? Activity;
}
