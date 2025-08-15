import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  FileText,
  Calendar,
  Heart,
  Activity,
  Pill,
  AlertTriangle,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  Stethoscope,
  TestTube,
  Camera,
  Upload,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import FileUploadComponent from "@/components/file-upload/FileUploadComponent";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  bloodType: string;
  height: number; // cm
  weight: number; // kg
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  type: "consultation" | "procedure" | "surgery" | "emergency" | "follow_up";
  doctorId: string;
  doctorName: string;
  specialty: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  physicalExamination: string;
  assessment: string;
  plan: string;
  prescriptions: Prescription[];
  labResults: LabResult[];
  images: MedicalImage[];
  notes: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: "active" | "resolved" | "chronic";
  severity: "low" | "moderate" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "discontinued";
}

interface LabResult {
  id: string;
  testName: string;
  category: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "abnormal" | "critical";
  date: string;
  notes?: string;
}

interface MedicalImage {
  id: string;
  type: "xray" | "ct" | "mri" | "ultrasound" | "photo" | "other";
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  date: string;
  reportUrl?: string;
}

interface VitalSigns {
  id: string;
  patientId: string;
  date: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  weight?: number;
  height?: number;
  bmi?: number;
  pain?: number; // 0-10 scale
  notes?: string;
}

export default function MedicalRecordsManager() {
  const { user } = useAuthStore();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data
  const [patients] = useState<Patient[]>([
    {
      id: "pat-1",
      name: "Carlos Mendes",
      email: "carlos@email.com",
      phone: "+244 923 456 789",
      birthDate: "1985-06-15",
      gender: "male",
      bloodType: "O+",
      height: 175,
      weight: 75,
      allergies: ["Penicilina", "Frutos do mar"],
      chronicConditions: ["Hipertensão"],
      emergencyContact: {
        name: "Maria Mendes",
        phone: "+244 934 567 890",
        relationship: "Esposa",
      },
      insurance: {
        provider: "SAÚDE ANGOLA",
        policyNumber: "SA123456789",
        validUntil: "2025-12-31",
      },
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2024-12-20T15:30:00Z",
    },
    {
      id: "pat-2",
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "+244 934 567 890",
      birthDate: "1992-03-22",
      gender: "female",
      bloodType: "A+",
      height: 165,
      weight: 60,
      allergies: ["Aspirina"],
      chronicConditions: [],
      emergencyContact: {
        name: "João Costa",
        phone: "+244 945 678 901",
        relationship: "Pai",
      },
      insurance: {
        provider: "MEDICLÍNICA",
        policyNumber: "MC987654321",
        validUntil: "2025-06-30",
      },
      createdAt: "2023-03-10T14:20:00Z",
      updatedAt: "2024-12-19T09:15:00Z",
    },
  ]);

  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: "rec-1",
      patientId: "pat-1",
      date: "2024-12-20",
      type: "consultation",
      doctorId: "doc-1",
      doctorName: "Dr. António Silva",
      specialty: "Cardiologia",
      chiefComplaint: "Dor no peito e falta de ar",
      historyOfPresentIllness:
        "Paciente relata dor torácica iniciada há 3 dias, tipo aperto, que piora com esforço físico. Associada a dispneia aos pequenos esforços.",
      physicalExamination:
        "PA: 150/95 mmHg, FC: 85 bpm, FR: 18 irpm. Ausculta cardíaca: bulhas hipofonéticas, sem sopros. Ausculta pulmonar: murmúrio vesicular presente bilateralmente.",
      assessment:
        "Síndrome coronariana aguda a esclarecer. Hipertensão arterial descompensada.",
      plan: "Solicitado ECG, troponinas, ecocardiograma. Ajuste medicação anti-hipertensiva. Retorno em 1 semana.",
      prescriptions: [
        {
          id: "pres-1",
          medication: "Losartana",
          dosage: "50mg",
          frequency: "1x ao dia",
          duration: "30 dias",
          instructions: "Tomar pela manhã, em jejum",
          startDate: "2024-12-20",
          status: "active",
        },
        {
          id: "pres-2",
          medication: "AAS",
          dosage: "100mg",
          frequency: "1x ao dia",
          duration: "Uso contínuo",
          instructions: "Tomar após o almoço",
          startDate: "2024-12-20",
          status: "active",
        },
      ],
      labResults: [
        {
          id: "lab-1",
          testName: "Troponina I",
          category: "Cardiologia",
          value: "0.02",
          unit: "ng/mL",
          referenceRange: "< 0.04",
          status: "normal",
          date: "2024-12-20",
        },
        {
          id: "lab-2",
          testName: "Colesterol Total",
          category: "Bioquímica",
          value: "220",
          unit: "mg/dL",
          referenceRange: "< 200",
          status: "abnormal",
          date: "2024-12-20",
          notes: "Indicar dieta e exercícios",
        },
      ],
      images: [
        {
          id: "img-1",
          type: "xray",
          title: "Raio-X de Tórax PA",
          description: "Área cardíaca ligeiramente aumentada",
          url: "/api/medical-images/img-1",
          date: "2024-12-20",
        },
      ],
      notes:
        "Paciente colaborativo, orientado quanto aos fatores de risco cardiovascular.",
      followUpRequired: true,
      followUpDate: "2024-12-27",
      status: "active",
      severity: "moderate",
      createdAt: "2024-12-20T14:30:00Z",
      updatedAt: "2024-12-20T14:30:00Z",
    },
  ]);

  const [vitalSigns] = useState<VitalSigns[]>([
    {
      id: "vital-1",
      patientId: "pat-1",
      date: "2024-12-20",
      bloodPressureSystolic: 150,
      bloodPressureDiastolic: 95,
      heartRate: 85,
      temperature: 36.8,
      respiratoryRate: 18,
      oxygenSaturation: 98,
      weight: 75,
      height: 175,
      bmi: 24.5,
      pain: 3,
    },
    {
      id: "vital-2",
      patientId: "pat-1",
      date: "2024-12-15",
      bloodPressureSystolic: 145,
      bloodPressureDiastolic: 90,
      heartRate: 82,
      temperature: 36.6,
      respiratoryRate: 16,
      oxygenSaturation: 99,
      weight: 76,
      height: 175,
      bmi: 24.8,
      pain: 2,
    },
  ]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  );

  const getPatientMedicalRecords = (patientId: string) => {
    return medicalRecords
      .filter((record) => record.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getPatientVitalSigns = (patientId: string) => {
    return vitalSigns
      .filter((vital) => vital.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-600" };
    if (bmi < 25) return { label: "Peso normal", color: "text-green-600" };
    if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-600" };
    return { label: "Obeso", color: "text-red-600" };
  };

  const getBloodPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 140 || diastolic >= 90) {
      return { label: "Hipertensão", color: "text-red-600", icon: TrendingUp };
    }
    if (systolic >= 130 || diastolic >= 80) {
      return {
        label: "Pré-hipertensão",
        color: "text-yellow-600",
        icon: TrendingUp,
      };
    }
    return { label: "Normal", color: "text-green-600", icon: Heart };
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Prontuários Médicos</h2>
            <p className="text-muted-foreground">
              Gerencie registros médicos completos dos pacientes
            </p>
          </div>
          <Button onClick={() => setShowPatientForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar paciente por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{patient.name}</CardTitle>
                  <Badge variant="outline">
                    {patient.gender === "male" ? "M" : "F"},{" "}
                    {calculateAge(patient.birthDate)} anos
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(patient.birthDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Heart className="w-4 h-4 mr-2" />
                    Tipo sanguíneo: {patient.bloodType}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    {getPatientMedicalRecords(patient.id).length} registro(s)
                    médico(s)
                  </div>

                  {patient.allergies.length > 0 && (
                    <div className="flex items-start text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
                      <div>
                        <span className="text-red-600 font-medium">
                          Alergias:
                        </span>
                        <span className="text-muted-foreground ml-1">
                          {patient.allergies.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Tente ajustar os termos de busca"
                : "Comece adicionando um novo paciente"}
            </p>
            <Button onClick={() => setShowPatientForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Paciente
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            ← Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{selectedPatient.name}</h2>
            <p className="text-muted-foreground">
              {selectedPatient.gender === "male" ? "Masculino" : "Feminino"},{" "}
              {calculateAge(selectedPatient.birthDate)} anos •{" "}
              {selectedPatient.bloodType}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button onClick={() => setShowNewRecord(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Registro
          </Button>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">IMC</p>
                <p className="text-xl font-bold">
                  {(
                    (selectedPatient.weight / (selectedPatient.height / 100)) **
                    2
                  ).toFixed(1)}
                </p>
                <p
                  className={`text-xs ${getBMIStatus(selectedPatient.weight / (selectedPatient.height / 100) ** 2).color}`}
                >
                  {
                    getBMIStatus(
                      selectedPatient.weight /
                        (selectedPatient.height / 100) ** 2,
                    ).label
                  }
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Registros</p>
                <p className="text-xl font-bold">
                  {getPatientMedicalRecords(selectedPatient.id).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Total de consultas
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alergias</p>
                <p className="text-xl font-bold">
                  {selectedPatient.allergies.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedPatient.allergies.length > 0
                    ? selectedPatient.allergies.join(", ")
                    : "Nenhuma"}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Última Consulta</p>
                <p className="text-xl font-bold">
                  {getPatientMedicalRecords(selectedPatient.id).length > 0
                    ? format(
                        new Date(
                          getPatientMedicalRecords(selectedPatient.id)[0].date,
                        ),
                        "dd/MM",
                      )
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getPatientMedicalRecords(selectedPatient.id).length > 0
                    ? getPatientMedicalRecords(selectedPatient.id)[0].specialty
                    : "Sem registros"}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="records">Registros Médicos</TabsTrigger>
          <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
          <TabsTrigger value="labs">Exames</TabsTrigger>
          <TabsTrigger value="medications">Medicações</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Telefone</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.phone}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Altura</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.height} cm
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Peso</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.weight} kg
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium">
                    Contato de Emergência
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.emergencyContact.name} (
                    {selectedPatient.emergencyContact.relationship})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.emergencyContact.phone}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Seguro de Saúde</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.insurance.provider} -{" "}
                    {selectedPatient.insurance.policyNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Válido até:{" "}
                    {format(
                      new Date(selectedPatient.insurance.validUntil),
                      "dd/MM/yyyy",
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Latest Vital Signs */}
            <Card>
              <CardHeader>
                <CardTitle>Últimos Sinais Vitais</CardTitle>
              </CardHeader>
              <CardContent>
                {getPatientVitalSigns(selectedPatient.id).length > 0 ? (
                  <div className="space-y-4">
                    {(() => {
                      const latest = getPatientVitalSigns(
                        selectedPatient.id,
                      )[0];
                      const bpStatus = getBloodPressureStatus(
                        latest.bloodPressureSystolic,
                        latest.bloodPressureDiastolic,
                      );
                      const StatusIcon = bpStatus.icon;

                      return (
                        <>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(latest.date), "dd/MM/yyyy HH:mm", {
                              locale: ptBR,
                            })}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Pressão Arterial
                                </span>
                                <div className="flex items-center space-x-1">
                                  <StatusIcon
                                    className={`w-4 h-4 ${bpStatus.color}`}
                                  />
                                  <span className="font-medium">
                                    {latest.bloodPressureSystolic}/
                                    {latest.bloodPressureDiastolic}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Frequência Cardíaca
                                </span>
                                <span className="font-medium">
                                  {latest.heartRate} bpm
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm">Temperatura</span>
                                <span className="font-medium">
                                  {latest.temperature}°C
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Saturação O₂</span>
                                <span className="font-medium">
                                  {latest.oxygenSaturation}%
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Freq. Respiratória
                                </span>
                                <span className="font-medium">
                                  {latest.respiratoryRate} irpm
                                </span>
                              </div>

                              {latest.pain !== undefined && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Dor (0-10)</span>
                                  <span className="font-medium">
                                    {latest.pain}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum sinal vital registrado
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Medical Records */}
          <Card>
            <CardHeader>
              <CardTitle>Registros Médicos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {getPatientMedicalRecords(selectedPatient.id)
                .slice(0, 3)
                .map((record) => (
                  <div
                    key={record.id}
                    className="border-l-4 border-blue-500 pl-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{record.specialty}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(record.date), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <Badge
                        className={
                          record.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : record.severity === "high"
                              ? "bg-orange-100 text-orange-800"
                              : record.severity === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {record.severity}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{record.chiefComplaint}</h4>
                    <p className="text-sm text-muted-foreground">
                      {record.doctorName}
                    </p>
                    <p className="text-sm mt-1">{record.assessment}</p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-6">
          <div className="space-y-4">
            {getPatientMedicalRecords(selectedPatient.id).map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {record.chiefComplaint}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{record.specialty}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(record.date), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          • {record.doctorName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          record.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : record.severity === "high"
                              ? "bg-orange-100 text-orange-800"
                              : record.severity === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                        }
                      >
                        {record.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="details">
                      <AccordionTrigger>Detalhes da Consulta</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <Label className="font-medium">
                            História da Doença Atual
                          </Label>
                          <p className="text-sm mt-1">
                            {record.historyOfPresentIllness}
                          </p>
                        </div>

                        <div>
                          <Label className="font-medium">Exame Físico</Label>
                          <p className="text-sm mt-1">
                            {record.physicalExamination}
                          </p>
                        </div>

                        <div>
                          <Label className="font-medium">Avaliação</Label>
                          <p className="text-sm mt-1">{record.assessment}</p>
                        </div>

                        <div>
                          <Label className="font-medium">
                            Plano de Tratamento
                          </Label>
                          <p className="text-sm mt-1">{record.plan}</p>
                        </div>

                        {record.prescriptions.length > 0 && (
                          <div>
                            <Label className="font-medium">Prescrições</Label>
                            <div className="mt-2 space-y-2">
                              {record.prescriptions.map((prescription) => (
                                <div
                                  key={prescription.id}
                                  className="bg-gray-50 p-3 rounded"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      {prescription.medication}
                                    </span>
                                    <Badge
                                      variant={
                                        prescription.status === "active"
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {prescription.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {prescription.dosage} -{" "}
                                    {prescription.frequency} -{" "}
                                    {prescription.duration}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {prescription.instructions}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {record.notes && (
                          <div>
                            <Label className="font-medium">Observações</Label>
                            <p className="text-sm mt-1">{record.notes}</p>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <FileUploadComponent
            category="exam_result"
            showFileList={true}
            onUploadComplete={(files) => {
              console.log("Files uploaded:", files);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
