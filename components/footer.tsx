"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
  Heart,
} from "lucide-react";
import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    institucional: [
      { label: "Sobre Nós", href: "/sobre/" },
      { label: "História", href: "/historia/" },
      { label: "Estatutos", href: "/estatutos/" },
      { label: "Órgãos Sociais", href: "/orgaos-sociais/" },
      { label: "Comissões", href: "/comissoes/" },
    ],
    servicos: [
      { label: "Inscrição", href: "/inscricao/" },
      { label: "Renovação", href: "/renovacao/" },
      { label: "Consulta de Médicos", href: "/consulta-medicos/" },
      { label: "Validação de Documentos", href: "/validacao/" },
      { label: "Área do Membro", href: "/area-membro/" },
    ],
    etica: [
      { label: "Código Deontológico", href: "/codigo-deontologico/" },
      { label: "Código Disciplinar", href: "/codigo-disciplinar/" },
      { label: "Regulamento Geral", href: "/regulamento-geral/" },
      { label: "Denúncias", href: "/denuncias/" },
      { label: "Processo Ético", href: "/processo-etico/" },
    ],
    comunicacao: [
      { label: "Notícias", href: "/noticias/" },
      { label: "Eventos", href: "/eventos/" },
      { label: "Revista ORMED", href: "/revista/" },
      { label: "Podcast", href: "/podcast/" },
      { label: "Boletins", href: "/boletins/" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  ];

  return (
    <footer className="bg-angola-navy text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Subscreva a nossa Newsletter
              </h3>
              <p className="text-gray-400 text-sm">
                Receba as últimas notícias, eventos e atualizações da ORMED
                diretamente no seu email.
              </p>
            </div>
            <div className="flex w-full lg:w-auto gap-2">
              <input
                type="email"
                placeholder="O seu email"
                className="flex-1 lg:w-80 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-angola-gold"
              />
              <Button className="bg-angola-gold text-angola-navy hover:bg-angola-gold/90 font-semibold px-6">
                Subscrever
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand - Logo only */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.svg"
                alt="ORMED"
                className="w-12 h-12 object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Instituição de utilidade pública que regula o exercício da
              profissão médica em Angola desde 1991. Pela Dignidade Médica Rumo
              à Excelência.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-angola-gold mt-0.5 shrink-0" />
                <span className="text-gray-300">{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-angola-gold shrink-0" />
                <span className="text-gray-300">{siteConfig.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-angola-gold shrink-0" />
                <span className="text-gray-300">{siteConfig.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-angola-gold shrink-0" />
                <span className="text-gray-300">
                  Seg - Sex: 08:00 - 17:00
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-angola-gold">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} ORMED. Todos os direitos reservados.</span>
            <span className="hidden md:inline">·</span>
            <Link href="/privacidade/" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <span className="hidden md:inline">·</span>
            <Link href="/termos/" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-angola-gold hover:text-angola-navy transition-all"
                  aria-label={link.label}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 hover:bg-angola-gold hover:text-angola-navy hover:border-angola-gold"
              onClick={scrollToTop}
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          desenvolvido pela Nano Digital One
        </div>
      </div>
    </footer>
  );
}
