"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Search,
  User,
  IdCard,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { navItems, siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    setIsMobileMenuOpen(false);
    setSearchTerm("");
    router.push(`/procurar?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueia o scroll da página por trás enquanto o menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const topBarLinks = [
    { icon: Phone, label: siteConfig.phone, href: `tel:${siteConfig.phone}` },
    { icon: Mail, label: siteConfig.email, href: `mailto:${siteConfig.email}` },
  ];

  const socialLinks = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  ];

  // Barra de pesquisa em destaque (estilo "pesquisa gigante").
  // Chamada inline (não como <Componente/>) para o input não perder o foco a cada tecla.
  const searchBar = (className = "") => (
    <form onSubmit={submitSearch} className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Pesquisar no portal da Ordem…"
        aria-label="Pesquisar"
        className="w-full h-11 pl-11 pr-4 rounded-full bg-gray-100 dark:bg-white/10 border border-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-colors focus:bg-white dark:focus:bg-white/15 focus:border-angola-gold focus:ring-2 focus:ring-angola-gold/20"
      />
    </form>
  );

  // Menu de acesso (avatar + nome), à direita.
  const accessMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 border border-gray-200 dark:border-white/15 hover:border-angola-gold/60 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
          <span className="w-8 h-8 rounded-full bg-angola-navy text-white flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </span>
          <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
            Entrar
          </span>
          <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/60 dark:border-gray-700"
      >
        <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          Aceder à plataforma
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/area-membro/" className="cursor-pointer gap-2">
            <IdCard className="w-4 h-4 text-angola-gold" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Área do Membro</span>
              <span className="text-xs text-gray-500">Portal do médico</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/admin/login" className="cursor-pointer gap-2">
            <Shield className="w-4 h-4 text-angola-navy dark:text-gray-300" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Painel Administrativo</span>
              <span className="text-xs text-gray-500">Equipa da Ordem</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/consultar/" className="cursor-pointer gap-2 text-sm">
            <Search className="w-4 h-4 text-gray-400" />
            Consultar um pedido
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div
        className={`bg-angola-navy text-white text-xs transition-all duration-300 ${
          isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            {topBarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 hover:text-angola-gold transition-colors"
              >
                <link.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{link.label}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-angola-gold transition-colors"
                aria-label={link.label}
              >
                <link.icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className={`transition-all duration-300 bg-white dark:bg-angola-navy ${
          isScrolled
            ? "shadow-lg border-b border-gray-200 dark:border-gray-800"
            : "border-b border-gray-100 dark:border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12">
                <img
                  src="/images/logo.svg"
                  alt="ORMED - Ordem dos Médicos de Angola"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </div>
            </Link>

            {/* Pesquisa em destaque (centro) */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              {searchBar("w-full max-w-xl")}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex dark:text-gray-300 dark:hover:text-white"
                  aria-label="Alternar tema"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* Acesso (avatar + nome) */}
              <div className="hidden md:block">
                {accessMenu()}
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden dark:text-gray-300"
                aria-label="Menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Navegação (linha inferior, limpa e alinhada) */}
          <nav className="hidden lg:flex items-center gap-1 h-12 -mt-1">
            {navItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-angola-gold dark:hover:text-angola-gold transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      {item.label}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200/60 dark:border-gray-700"
                  >
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.label} asChild>
                        <Link
                          href={child.href}
                          className="cursor-pointer text-sm dark:text-gray-300 dark:hover:text-white"
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-angola-gold dark:hover:text-angola-gold transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop - fecha o menu ao tocar fora */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40"
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {/* Pesquisa no mobile */}
                {searchBar("mb-3")}
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div className="space-y-1">
                        <p className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-6 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-angola-gold dark:hover:text-angola-gold hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-angola-gold dark:hover:text-angola-gold hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t dark:border-gray-800 space-y-2">
                  <Link href="/area-membro/" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="angola" className="w-full">
                      <IdCard className="w-4 h-4 mr-2" />
                      Área do Membro
                    </Button>
                  </Link>
                  <Link href="/admin/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Administrativo
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
