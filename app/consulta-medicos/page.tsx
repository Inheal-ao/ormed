"use client";

import { useState } from "react";
import {
  Search,
  User,
  MapPin,
  GraduationCap,
  Shield,
  Filter,
  CheckCircle,
  XCircle,
  Stethoscope,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { provinces, specialties } from "@/lib/data";

const mockDoctors = [
  {
    id: 1,
    name: "Dr. António Manuel Silva",
    specialty: "Medicina Interna",
    province: "Luanda",
    registration: "ORM-001234",
    status: "active",
    year: 2010,
  },
  {
    id: 2,
    name: "Dra. Maria Fernandes Costa",
    specialty: "Pediatria",
    province: "Benguela",
    registration: "ORM-005678",
    status: "active",
    year: 2015,
  },
  {
    id: 3,
    name: "Dr. Pedro Kiala",
    specialty: "Cirurgia Geral",
    province: "Huambo",
    registration: "ORM-009012",
    status: "active",
    year: 2008,
  },
  {
    id: 4,
    name: "Dra. Ana Beatriz Costa",
    specialty: "Ginecologia e Obstetrícia",
    province: "Luanda",
    registration: "ORM-003456",
    status: "suspended",
    year: 2012,
  },
  {
    id: 5,
    name: "Dr. José Eduardo Santos",
    specialty: "Cardiologia",
    province: "Lubango",
    registration: "ORM-007890",
    status: "active",
    year: 2005,
  },
  {
    id: 6,
    name: "Dra. Luísa Mendes",
    specialty: "Dermatologia",
    province: "Luanda",
    registration: "ORM-011234",
    status: "active",
    year: 2018,
  },
];

export default function ConsultaMedicosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Todas");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince =
      selectedProvince === "Todas" || doctor.province === selectedProvince;
    const matchesSpecialty =
      selectedSpecialty === "Todas" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesProvince && matchesSpecialty;
  });

  return (
    <div className="pt-28 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Stethoscope className="w-4 h-4" />
            Serviço Público
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Consulta de Médicos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Verifique a regularidade do registo de qualquer médico em Angola.
            Este serviço é público e gratuito.
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Nome ou número de registo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="Todas">Todas as Províncias</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                <option value="Todas">Todas as Especialidades</option>
                {specialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredDoctors.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum médico encontrado
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Tente ajustar os filtros ou termos de pesquisa
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shrink-0">
                        <User className="w-7 h-7 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {doctor.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {doctor.specialty}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {doctor.province}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            {doctor.registration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          doctor.status === "active" ? "default" : "destructive"
                        }
                        className={
                          doctor.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : ""
                        }
                      >
                        {doctor.status === "active" ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Inscrição Ativa
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Suspenso
                          </>
                        )}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        Desde {doctor.year}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-angola-navy">
            <strong>Nota:</strong> A informação apresentada tem caráter
            meramente indicativo. Para confirmação oficial do estado de
            inscrição, contacte a ORMED diretamente.
          </p>
        </div>
      </div>
    </div>
  );
}
