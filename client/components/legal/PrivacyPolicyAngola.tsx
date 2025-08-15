import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  FileText,
  Clock,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
} from "lucide-react";
import { angolaFormatter } from "@/lib/locale-angola";

interface PrivacyRights {
  access: boolean;
  rectification: boolean;
  erasure: boolean;
  restriction: boolean;
  portability: boolean;
  objection: boolean;
}

interface DataController {
  name: string;
  address: string;
  phone: string;
  email: string;
  dpoEmail: string;
  registrationNumber?: string;
}

interface DataProcessingPurpose {
  purpose: string;
  legalBasis: string;
  dataTypes: string[];
  retentionPeriod: string;
  recipients?: string[];
}

const DATA_CONTROLLER: DataController = {
  name: "Clínica Bem Cuidar, Lda.",
  address: "Avenida 21 de Janeiro, Nº 351, Benfica, Luanda, Angola",
  phone: "+244 945 344 650",
  email: "recepcao@bemcuidar.co.ao",
  dpoEmail: "dpo@bemcuidar.co.ao",
  registrationNumber: "NIF: 5000XXXXXX", // To be updated with real NIF
};

const PROCESSING_PURPOSES: DataProcessingPurpose[] = [
  {
    purpose: "Prestação de cuidados de saúde",
    legalBasis: "Execução de contrato e interesses vitais do titular dos dados",
    dataTypes: [
      "Dados de identificação",
      "Dados de saúde",
      "Dados de contacto",
    ],
    retentionPeriod:
      "20 anos após a última consulta (conforme legislação sanitária)",
    recipients: [
      "Médicos especialistas",
      "Laboratórios parceiros",
      "Seguradoras (com consentimento)",
    ],
  },
  {
    purpose: "Agendamento e gestão de consultas",
    legalBasis: "Execução de contrato",
    dataTypes: ["Nome", "Telefone", "E-mail", "Preferências de horário"],
    retentionPeriod: "5 anos após a última interação",
  },
  {
    purpose: "Faturação e pagamento",
    legalBasis: "Obrigação legal e execução de contrato",
    dataTypes: [
      "Dados de identificação",
      "Dados financeiros",
      "Seguro de saúde",
    ],
    retentionPeriod: "10 anos (conforme legislação fiscal e contabilística)",
  },
  {
    purpose: "Comunicações de marketing",
    legalBasis: "Consentimento explícito",
    dataTypes: ["Nome", "E-mail", "Telefone", "Preferências"],
    retentionPeriod: "Até retirada do consentimento ou 3 anos de inatividade",
  },
  {
    purpose: "Melhoria dos serviços",
    legalBasis: "Interesses legítimos",
    dataTypes: [
      "Dados anonimizados de utilização",
      "Estatísticas de satisfação",
    ],
    retentionPeriod: "5 anos em formato anonimizado",
  },
];

const USER_RIGHTS: PrivacyRights = {
  access: true,
  rectification: true,
  erasure: true,
  restriction: true,
  portability: true,
  objection: true,
};

export default function PrivacyPolicyAngola() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentSection, setCurrentSection] = useState<string>("overview");

  useEffect(() => {
    // In a real implementation, this would fetch the last update date from the server
    setLastUpdated(new Date("2024-01-15")); // Example date
  }, []);

  const sections = [
    { id: "overview", title: "Resumo Executivo", icon: Info },
    { id: "controller", title: "Responsável pelo Tratamento", icon: User },
    { id: "purposes", title: "Finalidades do Tratamento", icon: FileText },
    { id: "legal-basis", title: "Base Legal", icon: Shield },
    { id: "rights", title: "Direitos dos Titulares", icon: Eye },
    { id: "retention", title: "Período de Conservação", icon: Clock },
    { id: "security", title: "Segurança dos Dados", icon: Shield },
    { id: "transfers", title: "Transferências de Dados", icon: ExternalLink },
    { id: "contact", title: "Contactos", icon: Mail },
  ];

  const formatLastUpdated = () => {
    return angolaFormatter.formatDateTime(lastUpdated);
  };

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="bg-clinic-light/30 p-6 rounded-lg border border-clinic-accent/20">
              <h3 className="text-lg font-semibold mb-4 text-clinic-primary">
                Resumo da Política de Privacidade
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                A Clínica Bem Cuidar está comprometida com a proteção dos seus
                dados pessoais, em conformidade com a Lei n.º 22/11 de 17 de
                Junho (Lei de Proteção de Dados Pessoais de Angola).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    Tratamento lícito e transparente
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">
                    Finalidades específicas e legítimas
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Minimização de dados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Segurança e confidencialidade</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Dados Sensíveis de Saúde
                  </h4>
                  <p className="text-sm text-yellow-700">
                    O tratamento de dados de saúde requer consentimento
                    explícito ou justificação por interesses vitais, conforme
                    previsto na legislação angolana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "controller":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Responsável pelo Tratamento de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Entidade</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Nome:</strong> {DATA_CONTROLLER.name}
                      </p>
                      <p className="text-sm">
                        <strong>NIF:</strong>{" "}
                        {DATA_CONTROLLER.registrationNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Contactos</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-clinic-accent" />
                        <span className="text-sm">{DATA_CONTROLLER.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-clinic-accent" />
                        <span className="text-sm">{DATA_CONTROLLER.email}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-clinic-accent mt-0.5" />
                        <span className="text-sm">
                          {DATA_CONTROLLER.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">
                    Encarregado de Proteção de Dados (DPO)
                  </h4>
                  <div className="bg-clinic-light/30 p-4 rounded-lg">
                    <p className="text-sm mb-2">
                      Para questões relacionadas com a proteção de dados
                      pessoais, pode contactar o nosso Encarregado de Proteção
                      de Dados:
                    </p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-clinic-accent" />
                      <span className="text-sm font-medium">
                        {DATA_CONTROLLER.dpoEmail}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "purposes":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Os seus dados pessoais são tratados para as seguintes finalidades:
            </p>

            {PROCESSING_PURPOSES.map((purpose, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{purpose.purpose}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {purpose.legalBasis}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2">Tipos de Dados</h5>
                    <div className="flex flex-wrap gap-2">
                      {purpose.dataTypes.map((dataType, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {dataType}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Período de Conservação</h5>
                    <p className="text-sm text-muted-foreground">
                      {purpose.retentionPeriod}
                    </p>
                  </div>

                  {purpose.recipients && (
                    <div>
                      <h5 className="font-medium mb-2">Destinatários</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {purpose.recipients.map((recipient, idx) => (
                          <li key={idx}>• {recipient}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "legal-basis":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              O tratamento dos seus dados pessoais baseia-se nas seguintes bases
              legais previstas na Lei n.º 22/11:
            </p>

            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Consentimento
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Para dados sensíveis de saúde e comunicações de marketing,
                    solicitamos o seu consentimento explícito e informado.
                  </p>
                  <Badge variant="outline">Artigo 7º da Lei n.º 22/11</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Execuç��o de Contrato
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tratamento necessário para a prestação de cuidados de saúde
                    e cumprimento das obrigações contratuais.
                  </p>
                  <Badge variant="outline">Artigo 6º da Lei n.º 22/11</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Interesses Vitais
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Em situações de emergência médica onde é necessário proteger
                    a vida ou integridade física do titular dos dados.
                  </p>
                  <Badge variant="outline">Artigo 6º, n.º 1, alínea d)</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    Obrigação Legal
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Cumprimento de obrigações legais em matéria fiscal,
                    contabilística e sanitária impostas pela legislação
                    angolana.
                  </p>
                  <Badge variant="outline">Artigo 6º, n.º 1, alínea c)</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "rights":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Enquanto titular dos dados, tem os seguintes direitos garantidos
              pela Lei n.º 22/11:
            </p>

            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    Direito de Acesso
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pode solicitar informações sobre os dados pessoais que
                    tratamos, as finalidades e os destinatários.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Solicitar Dados
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Edit className="w-4 h-4 text-green-600" />
                    Direito de Retificação
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pode solicitar a correção de dados pessoais inexatos ou o
                    completamento de dados incompletos.
                  </p>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Corrigir Dados
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    Direito ao Apagamento
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pode solicitar o apagamento dos seus dados pessoais, sujeito
                    a limitações legais e médicas.
                  </p>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Dados
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-600" />
                    Direito à Portabilidade
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pode solicitar os seus dados em formato estruturado e
                    legível por máquina.
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                Como Exercer os Seus Direitos
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                Para exercer qualquer dos seus direitos, contacte-nos através
                de:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {DATA_CONTROLLER.dpoEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    {DATA_CONTROLLER.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Implementamos medidas técnicas e organizativas adequadas para
              proteger os seus dados pessoais:
            </p>

            <div className="grid gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Medidas Técnicas</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Encriptação de dados em trânsito e em repouso</li>
                    <li>• Sistemas de autenticação e autorização</li>
                    <li>• Firewalls e sistemas de deteção de intrusão</li>
                    <li>• Backups regulares e seguros</li>
                    <li>• Atualizações de segurança regulares</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Medidas Organizativas</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • Políticas de acesso baseadas no princípio da necessidade
                    </li>
                    <li>• Formação regular em proteção de dados</li>
                    <li>• Contratos de confidencialidade com funcionários</li>
                    <li>• Auditorias de segurança periódicas</li>
                    <li>• Planos de resposta a incidentes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">
                    Comunicação de Violações
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Em caso de violação de dados que apresente riscos para os
                    seus direitos e liberdades, ser-lhe-á comunicado no prazo de
                    72 horas, conforme previsto na legislação.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contactos para Questões de Privacidade</CardTitle>
                <CardDescription>
                  Para dúvidas sobre esta política ou exercício dos seus
                  direitos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">
                      Encarregado de Proteção de Dados
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-clinic-accent" />
                        <span className="text-sm">
                          {DATA_CONTROLLER.dpoEmail}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Resposta em até 30 dias úteis
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Atendimento Geral</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-clinic-accent" />
                        <span className="text-sm">{DATA_CONTROLLER.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-clinic-accent" />
                        <span className="text-sm">{DATA_CONTROLLER.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Autoridade de Controlo</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tem o direito de apresentar reclamação junto da autoridade
                    de controlo competente em Angola, caso considere que o
                    tratamento dos seus dados viola a Lei n.º 22/11.
                  </p>
                  <Badge variant="outline">
                    Ministério das Telecomunicações e Tecnologias de Informação
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-clinic-primary mb-4">
          Política de Privacidade
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: {formatLastUpdated()}</span>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Shield className="w-3 h-3 mr-1" />
            Conforme Lei n.º 22/11
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Índice</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      currentSection === section.id
                        ? "bg-clinic-gradient text-white"
                        : "hover:bg-clinic-light/30 text-muted-foreground"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[600px] pr-4">
                {renderSection()}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
