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
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { navItems, siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (!q) return;
    setIsSearchOpen(false);
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
            : "border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo ONLY - no text */}
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-angola-gold dark:hover:text-angola-gold transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    onSubmit={submitSearch}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden px-0.5 py-0.5"
                  >
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Pesquisar e Enter..."
                      className="h-9 text-sm rounded-full border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-angola-gold"
                      autoFocus
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Pesquisar"
                className="dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsSearchOpen((v) => !v)}
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              )}

              {/* Entrar (portal admin) */}
              <Link href="/admin/login" className="hidden md:block">
                <Button variant="angola" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Entrar</span>
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden dark:text-gray-300"
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
                <div className="pt-4 border-t dark:border-gray-800">
                  <Link href="/admin/login" className="block">
                    <Button variant="angola" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Entrar
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
