"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AreaMembroPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-28 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-angola-navy flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Área do Membro
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Aceda à sua conta ORMED
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Número de Membro / Email
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="pl-10"
                      placeholder="ex: ORM-12345"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Palavra-passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600 dark:text-gray-400">Lembrar-me</span>
                  </label>
                  <a
                    href="#"
                    className="text-angola-gold hover:text-red-800 font-medium"
                  >
                    Recuperar palavra-passe
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-angola-navy hover:bg-angola-blue py-6"
                >
                  Entrar
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-500">
                  Ainda não é membro?{" "}
                  <a
                    href="/inscricao/"
                    className="text-angola-gold font-medium hover:underline"
                  >
                    Inscreva-se
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bem-vindo, Dr. Silva
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Membro ORMED · Nº ORM-12345 · Medicina Interna
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              Inscrição Ativa
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Definições
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoggedIn(false)}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </Button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-1">
                {[
                  { icon: FileText, label: "Documentos", active: true },
                  { icon: CreditCard, label: "Pagamentos", active: false },
                  { icon: Bell, label: "Notificações", active: false, badge: 3 },
                  { icon: Shield, label: "Certificações", active: false },
                  { icon: Settings, label: "Definições", active: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-angola-cream text-angola-gold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && (
                      <span className="ml-auto bg-angola-navy text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Resumo da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Quota Anual</span>
                    <span className="font-medium">Paga</span>
                  </div>
                  <Progress value={100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Formação</span>
                    <span className="font-medium">32/50h</span>
                  </div>
                  <Progress value={64} className="h-1.5" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Validade</span>
                    <span className="font-medium text-green-600">Até Dez/2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="documentos" className="space-y-6">
              <TabsList className="bg-white dark:bg-gray-900 border">
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="eventos">Meus Eventos</TabsTrigger>
                <TabsTrigger value="certificados">Certificados</TabsTrigger>
              </TabsList>

              <TabsContent value="documentos" className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Documentos do Membro</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: "Carteira Profissional", status: "Válida", date: "12/2024" },
                      { name: "Certificado de Inscrição", status: "Válido", date: "12/2024" },
                      { name: "Comprovativo de Quotas 2025", status: "Pago", date: "01/2025" },
                      { name: "Certificado de Especialidade", status: "Válido", date: "06/2023" },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              Atualizado em {doc.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              doc.status === "Pago" || doc.status === "Válida" || doc.status === "Válido"
                                ? "default"
                                : "secondary"
                            }
                            className="bg-green-100 text-green-700 hover:bg-green-100"
                          >
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="eventos" className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Eventos Inscritos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Nenhum evento registado
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Explore os próximos eventos e inscreva-se
                      </p>
                      <Button className="bg-angola-navy hover:bg-angola-blue">
                        Ver Eventos
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificados" className="space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Certificados de Formação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Certificados
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Os seus certificados de formação aparecerão aqui
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
