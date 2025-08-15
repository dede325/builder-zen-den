import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import {
  Menu,
  X,
  CreditCard,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Star,
  Users,
  Building2,
  Heart,
  Clock,
  Award,
  FileText,
} from "lucide-react";

interface InsurancePlan {
  id: string;
  name: string;
  logo: string;
  category: string;
  coverage: string[];
  specialties: string[];
  status: "accepted" | "partner" | "negotiating";
  description: string;
  benefits: string[];
}

export default function Planos() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const insurancePlans: InsurancePlan[] = [
    {
      id: "1",
      name: "SAÚDE ANGOLA",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "nacional",
      coverage: ["Consultas", "Exames", "Cirurgias", "Urgência"],
      specialties: ["Todas as especialidades"],
      status: "partner",
      description: "Plano de saúde nacional com ampla cobertura e rede credenciada em todo o país.",
      benefits: [
        "Cobertura nacional completa",
        "Atendimento 24h",
        "Todas as especialidades",
        "Exames laboratoriais inclusos",
        "Cirurgias sem carência"
      ]
    },
    {
      id: "2",
      name: "MEDICLÍNICA",
      logo: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "privado",
      coverage: ["Consultas", "Exames", "Internamento"],
      specialties: ["Cardiologia", "Pediatria", "Cirurgia Geral", "Dermatologia"],
      status: "accepted",
      description: "Plano médico privado com foco em qualidade e atendimento personalizado.",
      benefits: [
        "Atendimento personalizado",
        "Médicos especializados",
        "Exames de última geração",
        "Sem filas de espera",
        "Telemedicina incluída"
      ]
    },
    {
      id: "3",
      name: "GLOBAL SAÚDE",
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "internacional",
      coverage: ["Consultas", "Exames", "Cirurgias", "Medicina Preventiva"],
      specialties: ["Todas as especialidades", "Medicina do Trabalho"],
      status: "partner",
      description: "Cobertura internacional com foco em medicina preventiva e corporativa.",
      benefits: [
        "Cobertura internacional",
        "Medicina preventiva",
        "Check-ups regulares",
        "Vacinação incluída",
        "Assistência no exterior"
      ]
    },
    {
      id: "4",
      name: "SANITAS",
      logo: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "privado",
      coverage: ["Consultas", "Exames", "Urgência"],
      specialties: ["Pediatria", "Ginecologia", "Cardiologia", "Neurologia"],
      status: "accepted",
      description: "Plano de saúde focado em especialidades médicas essenciais com atendimento rápido.",
      benefits: [
        "Agendamento rápido",
        "Especialistas qualificados",
        "Urgência 24h",
        "Exames no mesmo dia",
        "App móvel próprio"
      ]
    },
    {
      id: "5",
      name: "SAÚDE PLUS",
      logo: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "corporativo",
      coverage: ["Consultas", "Exames", "Medicina do Trabalho"],
      specialties: ["Medicina do Trabalho", "Cardiologia", "Ortopedia"],
      status: "partner",
      description: "Plano corporativo com foco em saúde ocupacional e bem-estar empresarial.",
      benefits: [
        "Medicina do trabalho",
        "Exames ocupacionais",
        "Consultas no local",
        "Relatórios corporativos",
        "Campanhas de prevenção"
      ]
    },
    {
      id: "6",
      name: "VIDA SEGURA",
      logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "familiar",
      coverage: ["Consultas", "Exames", "Pediatria", "Ginecologia"],
      specialties: ["Pediatria", "Ginecologia", "Clínica Geral"],
      status: "accepted",
      description: "Plano familiar com cobertura especial para crianças, gestantes e idosos.",
      benefits: [
        "Plano familiar completo",
        "Pediatria especializada",
        "Acompanhamento gestacional",
        "Cuidados geriátricos",
        "Vacinação infantil"
      ]
    },
    {
      id: "7",
      name: "UNIMED ANGOLA",
      logo: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "cooperativa",
      coverage: ["Consultas", "Exames", "Cirurgias", "Internamento"],
      specialties: ["Todas as especialidades"],
      status: "negotiating",
      description: "Cooperativa médica com ampla rede e foco na qualidade do atendimento.",
      benefits: [
        "Rede cooperativa",
        "Médicos cooperados",
        "Qualidade garantida",
        "Preços acessíveis",
        "Atendimento humanizado"
      ]
    },
    {
      id: "8",
      name: "HOSPITAL GIRASSOL",
      logo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      category: "hospitalar",
      coverage: ["Consultas", "Exames", "Cirurgias", "Internamento", "UTI"],
      specialties: ["Todas as especialidades", "Cirurgia Cardíaca"],
      status: "partner",
      description: "Plano hospitalar com cobertura completa e atendimento de alta complexidade.",
      benefits: [
        "Hospital próprio",
        "UTI especializada",
        "Cirurgias complexas",
        "Atendimento 24h",
        "Medicina de urgência"
      ]
    }
  ];

  const categories = [
    { id: "all", name: "Todos os Planos", icon: CreditCard },
    { id: "nacional", name: "Nacional", icon: Shield },
    { id: "privado", name: "Privado", icon: Star },
    { id: "internacional", name: "Internacional", icon: Building2 },
    { id: "corporativo", name: "Corporativo", icon: Users },
    { id: "familiar", name: "Familiar", icon: Heart },
    { id: "cooperativa", name: "Cooperativa", icon: Users },
    { id: "hospitalar", name: "Hospitalar", icon: Building2 },
  ];

  const statusColors = {
    accepted: "bg-green-100 text-green-800",
    partner: "bg-blue-100 text-blue-800",
    negotiating: "bg-orange-100 text-orange-800"
  };

  const statusLabels = {
    accepted: "Aceito",
    partner: "Parceiro",
    negotiating: "Em Negociação"
  };

  const filteredPlans = selectedCategory === "all" 
    ? insurancePlans 
    : insurancePlans.filter(plan => plan.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">
                  Clínica Bem Cuidar
                </h1>
                <p className="text-xs text-muted-foreground">Cuidar é Amar</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Início
              </Link>
              <Link
                to="/planos"
                className="text-primary font-medium transition-colors"
              >
                Planos e Convênios
              </Link>
              <Link
                to="/faq"
                className="text-foreground hover:text-primary transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/equipe"
                className="text-foreground hover:text-primary transition-colors"
              >
                Equipe
              </Link>
              <Link
                to="/contato"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contato
              </Link>
              <Link
                to="/portal"
                className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Portal do Paciente
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  to="/planos"
                  className="text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Planos e Convênios
                </Link>
                <Link
                  to="/faq"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  to="/equipe"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipe
                </Link>
                <Link
                  to="/contato"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
                <Link
                  to="/portal"
                  className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portal do Paciente
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-clinic-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <CreditCard className="w-12 h-12 text-clinic-primary mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Planos e <span className="text-clinic-primary">Convênios</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Aceitamos os principais planos de saúde de Angola. Verifique se seu
              convênio está em nossa rede credenciada e desfrute de atendimento
              médico de qualidade.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Cobertura Ampla</h3>
                <p className="text-sm text-muted-foreground">
                  Atendemos diversos planos de saúde
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sem Filas</h3>
                <p className="text-sm text-muted-foreground">
                  Agendamento rápido e eficiente
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Qualidade</h3>
                <p className="text-sm text-muted-foreground">
                  Atendimento médico de excelência
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Autorização</h3>
                <p className="text-sm text-muted-foreground">
                  Processo simplificado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.id ? "bg-clinic-gradient" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Insurance Plans Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={plan.logo}
                      alt={plan.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <Badge className={statusColors[plan.status]}>
                      {statusLabels[plan.status]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">
                      Cobertura:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plan.coverage.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">
                      Especialidades:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plan.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {plan.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plan.specialties.length - 3} mais
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">
                      Benefícios:
                    </h4>
                    <ul className="space-y-1">
                      {plan.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center text-xs text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full bg-clinic-gradient hover:opacity-90"
                      asChild
                    >
                      <Link to="/contato">
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar Consulta
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-clinic-primary hover:bg-clinic-light"
                      asChild
                    >
                      <a href="tel:+244945344650">
                        <Phone className="w-4 h-4 mr-2" />
                        Verificar Cobertura
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Informações Importantes
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 text-clinic-accent mr-2" />
                    Documentos Necessários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Cartão do plano de saúde
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Documento de identidade
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Guia médica (quando necessário)
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Relatórios médicos anteriores
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 text-clinic-accent mr-2" />
                    Processo de Atendimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Agendamento por telefone
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Verificação de cobertura
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Autorização automática
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Atendimento sem complicações
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Não encontrou seu plano?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Entre em contato conosco! Estamos sempre expandindo nossa rede
            credenciada e podemos verificar a possibilidade de atendimento
            para seu plano de saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-clinic-gradient hover:opacity-90" asChild>
              <Link to="/contato">
                <Mail className="w-5 h-5 mr-2" />
                Entrar em Contato
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+244945344650">
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
