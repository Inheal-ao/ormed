"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactosPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mensagem enviada com sucesso!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: siteConfig.address,
      color: "bg-angola-cream text-angola-gold",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: siteConfig.phone,
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: Mail,
      title: "Email",
      content: siteConfig.email,
      color: "bg-angola-cream text-angola-gold",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda a Sexta: 08:00 - 17:00",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook", color: "hover:bg-blue-600" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter", color: "hover:bg-sky-500" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn", color: "hover:bg-blue-700" },
    { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube", color: "hover:bg-angola-navy" },
  ];

  return (
    <div className="pt-28 pb-16">
      {/* Hero */}
      <section className="bg-angola-navy text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
              Contacto
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contactos
            </h1>
            <p className="text-gray-300 text-lg">
              Estamos aqui para ajudar. Entre em contacto connosco.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item) => (
              <Card key={item.title} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Envie-nos uma mensagem
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Preencha o formulário abaixo e responderemos o mais breve
                possível.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nome completo
                    </label>
                    <Input
                      placeholder="O seu nome"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="o.seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Assunto
                  </label>
                  <Input
                    placeholder="Assunto da mensagem"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mensagem
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Escreva a sua mensagem..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-angola-navy hover:bg-angola-blue w-full sm:w-auto"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>

            {/* Map Placeholder & Social */}
            <div className="space-y-8">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Rua Amílcar Cabral, 151/153
                  </p>
                  <p className="text-sm text-gray-400">Maíanga, Luanda</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Siga-nos nas redes sociais
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 ${link.color} hover:text-white transition-all`}
                      aria-label={link.label}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <Card className="border-0 shadow-sm bg-angola-cream">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-angola-cream flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-angola-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Atendimento prioritário
                      </h4>
                      <p className="text-sm text-gray-600">
                        Membros da ORMED têm acesso a atendimento prioritário
                        através da Área do Membro.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
