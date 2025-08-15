import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Award,
  CheckCircle,
  Star,
  Building2,
  Heart,
  UserCheck,
  Globe,
} from "lucide-react";

interface Certification {
  id: string;
  name: string;
  organization: string;
  description: string;
  icon: React.ComponentType<any>;
  status: "certified" | "member" | "accredited" | "partner";
  year: string;
}

export default function Certifications() {
  const certifications: Certification[] = [
    {
      id: "1",
      name: "Certificação de Qualidade em Saúde",
      organization: "Ministério da Saúde de Angola",
      description: "Certificação oficial que garante nossos padrões de qualidade e segurança no atendimento médico.",
      icon: Shield,
      status: "certified",
      year: "2024"
    },
    {
      id: "2",
      name: "Membro do Colégio Médico de Angola",
      organization: "CMA - Colégio Médico de Angola",
      description: "Todos os nossos médicos são registrados e reconhecidos pelo órgão regulador da medicina em Angola.",
      icon: UserCheck,
      status: "member",
      year: "2020"
    },
    {
      id: "3",
      name: "Acreditação Hospitalar",
      organization: "Sistema Nacional de Saúde",
      description: "Reconhecimento da excelência em gestão hospitalar e qualidade dos serviços médicos.",
      icon: Building2,
      status: "accredited",
      year: "2023"
    },
    {
      id: "4",
      name: "Certificação ISO 9001",
      organization: "International Organization for Standardization",
      description: "Padrão internacional de gestão da qualidade aplicado aos nossos processos e atendimento.",
      icon: Award,
      status: "certified",
      year: "2024"
    },
    {
      id: "5",
      name: "Selo de Excelência em Cardiologia",
      organization: "Sociedade Angolana de Cardiologia",
      description: "Reconhecimento da qualidade excepcional dos nossos serviços cardiológicos.",
      icon: Heart,
      status: "certified",
      year: "2023"
    },
    {
      id: "6",
      name: "Parceiro Oficial OMS",
      organization: "Organização Mundial da Saúde",
      description: "Colaboração em programas de saúde pública e implementação de melhores práticas médicas.",
      icon: Globe,
      status: "partner",
      year: "2022"
    },
    {
      id: "7",
      name: "Centro de Referência em Medicina Preventiva",
      organization: "Instituto Nacional de Saúde Pública",
      description: "Designação como centro de referência para programas de medicina preventiva e promoção da saúde.",
      icon: CheckCircle,
      status: "accredited",
      year: "2024"
    },
    {
      id: "8",
      name: "Certificação em Segurança do Paciente",
      organization: "Agência Nacional de Segurança Sanitária",
      description: "Certificação que atesta nosso compromisso com a segurança e bem-estar dos pacientes.",
      icon: Shield,
      status: "certified",
      year: "2024"
    }
  ];

  const statusColors = {
    certified: "bg-green-100 text-green-800 border-green-200",
    member: "bg-blue-100 text-blue-800 border-blue-200",
    accredited: "bg-purple-100 text-purple-800 border-purple-200",
    partner: "bg-orange-100 text-orange-800 border-orange-200",
  };

  const statusLabels = {
    certified: "Certificado",
    member: "Membro",
    accredited: "Acreditado",
    partner: "Parceiro",
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Certificações e Acreditações
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nosso compromisso com a excelência é reconhecido por importantes
            organizações de saúde nacionais e internacionais
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {certifications.map((cert) => {
            const Icon = cert.icon;
            return (
              <Card
                key={cert.id}
                className="hover:shadow-lg transition-all duration-300 group hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        statusColors[cert.status]
                      }`}
                    >
                      {statusLabels[cert.status]} • {cert.year}
                    </div>
                  </div>

                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-clinic-primary transition-colors">
                    {cert.name}
                  </h4>
                  
                  <p className="text-sm font-medium text-clinic-accent mb-2">
                    {cert.organization}
                  </p>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cert.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quality Metrics */}
        <div className="bg-clinic-light/30 rounded-2xl p-8">
          <h4 className="text-2xl font-bold text-center text-foreground mb-8">
            Indicadores de Qualidade
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-clinic-primary mb-1">99.5%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso Cirúrgico</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-clinic-primary mb-1">0%</div>
              <div className="text-sm text-muted-foreground">Infecções Hospitalares</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-clinic-primary mb-1">15min</div>
              <div className="text-sm text-muted-foreground">Tempo Médio de Atendimento</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl font-bold text-clinic-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Satisfação do Paciente</div>
            </div>
          </div>
        </div>

        {/* Trust Statement */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto">
            <h4 className="text-xl font-semibold text-foreground mb-4">
              Compromisso com a Excelência
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Na Clínica Bem Cuidar, nosso compromisso com a qualidade vai além
              das certificações. Trabalhamos continuamente para manter os mais
              altos padrões de atendimento médico, investindo em tecnologia,
              capacitação profissional e processos que garantam sua segurança
              e satisfação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
