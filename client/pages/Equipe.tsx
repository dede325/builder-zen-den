import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import {
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Users,
  Award,
  Stethoscope,
  Brain,
  Baby,
  Eye,
  Zap,
  Activity,
  UserCheck,
  CheckCircle,
  Menu,
  X,
  Star,
  GraduationCap,
  Building,
  Calendar as CalendarIcon,
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  experience: string;
  education: string[];
  certifications: string[];
  languages: string[];
  photo: string;
  consultationDays: string[];
  rating: number;
  reviews: number;
}

export default function Equipe() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. António Silva",
      title: "Cardiologista Sênior",
      specialties: ["Cardiologia", "Medicina Preventiva"],
      bio: "Especialista em cardiologia com mais de 15 anos de experiência em diagnóstico e tratamento de doenças cardiovasculares. Foco especial em medicina preventiva e cardiologia intervencionista.",
      experience: "15+ anos",
      education: [
        "Medicina - Universidade Agostinho Neto",
        "Especialização em Cardiologia - Hospital de Santa Marta (Portugal)",
        "Fellowship em Cardiologia Intervencionista - Instituto do Coração (Brasil)",
      ],
      certifications: [
        "Certificação Europeia de Cardiologia",
        "Membro da Sociedade Angolana de Cardiologia",
        "Certificação em Ecocardiografia",
      ],
      languages: ["Português", "Inglês", "Francês"],
      photo:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Segunda", "Terça", "Quinta", "Sexta"],
      rating: 4.9,
      reviews: 127,
    },
    {
      id: "2",
      name: "Dra. Maria Santos",
      title: "Pediatra",
      specialties: ["Pediatria", "Neonatologia"],
      bio: "Pediatra dedicada ao cuidado integral de crianças e adolescentes. Experiência em neonatologia e desenvolvimento infantil, com abordagem humanizada e preventiva.",
      experience: "12+ anos",
      education: [
        "Medicina - Universidade Católica de Angola",
        "Residência em Pediatria - Hospital Pediátrico de Luanda",
        "Especialização em Neonatologia - Hospital Dona Estefânia (Portugal)",
      ],
      certifications: [
        "Especialista em Pediatria (CMA)",
        "Certificação em Reanimação Pediátrica",
        "Membro da Sociedade Angolana de Pediatria",
      ],
      languages: ["Português", "Inglês"],
      photo:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Segunda", "Quarta", "Quinta", "Sábado"],
      rating: 4.8,
      reviews: 94,
    },
    {
      id: "3",
      name: "Dr. João Mendes",
      title: "Cirurgião Geral",
      specialties: ["Cirurgia Geral", "Cirurgia Laparoscópica"],
      bio: "Cirurgião experiente em procedimentos convencionais e minimamente invasivos. Especialista em cirurgia laparoscópica com foco em resultados precisos e recuperação rápida.",
      experience: "18+ anos",
      education: [
        "Medicina - Universidade Agostinho Neto",
        "Residência em Cirurgia Geral - Hospital Central de Luanda",
        "Fellowship em Cirurgia Laparoscópica - Hospital das Clínicas (Brasil)",
      ],
      certifications: [
        "Especialista em Cirurgia Geral (CMA)",
        "Certificação em Cirurgia Laparoscópica",
        "Membro do Colégio Brasileiro de Cirurgiões",
      ],
      languages: ["Português", "Inglês", "Espanhol"],
      photo:
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Terça", "Quarta", "Quinta", "Sexta"],
      rating: 4.7,
      reviews: 156,
    },
    {
      id: "4",
      name: "Dra. Ana Costa",
      title: "Dermatologista",
      specialties: ["Dermatologia", "Dermatologia Estética"],
      bio: "Dermatologista especializada em doenças da pele, procedimentos estéticos e dermatologia preventiva. Combina técnicas avançadas com cuidado personalizado.",
      experience: "10+ anos",
      education: [
        "Medicina - Universidade Católica de Angola",
        "Residência em Dermatologia - Hospital Curry Cabral (Portugal)",
        "Curso de Dermatologia Estética - Academia Europeia de Dermatologia",
      ],
      certifications: [
        "Especialista em Dermatologia (CMA)",
        "Certificação em Dermatoscopia",
        "Membro da Sociedade Portuguesa de Dermatologia",
      ],
      languages: ["Português", "Inglês", "Francês"],
      photo:
        "https://images.unsplash.com/photo-1594824532983-3b31ed80b04c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Segunda", "Terça", "Quarta", "Sexta"],
      rating: 4.9,
      reviews: 89,
    },
    {
      id: "5",
      name: "Dr. Fernando Dias",
      title: "Neurologista",
      specialties: ["Neurologia", "Neurofisiologia"],
      bio: "Neurologista com vasta experiência em diagnóstico e tratamento de doenças neurológicas. Especialista em eletroencefalografia e medicina do sono.",
      experience: "14+ anos",
      education: [
        "Medicina - Universidade Agostinho Neto",
        "Residência em Neurologia - Hospital Júlio de Matos (Portugal)",
        "Fellowship em Neurofisiologia - Hospital São João (Portugal)",
      ],
      certifications: [
        "Especialista em Neurologia (CMA)",
        "Certificação em Eletroencefalografia",
        "Membro da Liga Portuguesa Contra a Epilepsia",
      ],
      languages: ["Português", "Inglês"],
      photo:
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Segunda", "Quarta", "Quinta", "Sexta"],
      rating: 4.8,
      reviews: 112,
    },
    {
      id: "6",
      name: "Dra. Isabel Carvalho",
      title: "Ginecologista-Obstetra",
      specialties: ["Ginecologia", "Obstetrícia"],
      bio: "Ginecologista-obstetra dedicada à saúde da mulher em todas as fases da vida. Experiência em pré-natal de alto risco e cirurgia ginecológica.",
      experience: "16+ anos",
      education: [
        "Medicina - Universidade Católica de Angola",
        "Residência em Ginecologia-Obstetrícia - Maternidade Alfredo da Costa (Portugal)",
        "Curso de Medicina Materno-Fetal - King's College London",
      ],
      certifications: [
        "Especialista em Ginecologia-Obstetrícia (CMA)",
        "Certificação em Medicina Materno-Fetal",
        "Membro da Federação das Sociedades Portuguesas de Obstetrícia",
      ],
      languages: ["Português", "Inglês", "Francês"],
      photo:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      consultationDays: ["Segunda", "Terça", "Quinta", "Sábado"],
      rating: 4.9,
      reviews: 143,
    },
  ];

  const specialties = [
    "all",
    ...Array.from(new Set(doctors.flatMap((doc) => doc.specialties))),
  ];

  const filteredDoctors =
    selectedSpecialty === "all"
      ? doctors
      : doctors.filter((doc) => doc.specialties.includes(selectedSpecialty));

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
                to="/equipe"
                className="text-primary font-medium transition-colors"
              >
                Equipe Médica
              </Link>
              <Link
                to="/exames"
                className="text-foreground hover:text-primary transition-colors"
              >
                Exames
              </Link>
              <Link
                to="/sobre"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sobre
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
                  to="/equipe"
                  className="text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipe Médica
                </Link>
                <Link
                  to="/exames"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Exames
                </Link>
                <Link
                  to="/sobre"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
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
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Nossa <span className="text-clinic-primary">Equipe Médica</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Profissionais altamente qualificados e experientes, dedicados a
              oferecer o melhor cuidado para sua saúde e bem-estar.
            </p>
          </div>
        </div>
      </section>

      {/* Specialty Filter */}
      <section className="py-8 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={
                  selectedSpecialty === specialty ? "default" : "outline"
                }
                onClick={() => setSelectedSpecialty(specialty)}
                className={
                  selectedSpecialty === specialty ? "bg-clinic-gradient" : ""
                }
              >
                {specialty === "all" ? "Todas as Especialidades" : specialty}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <img
                    src={doctor.photo}
                    alt={doctor.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-xs text-muted-foreground">
                      ({doctor.reviews})
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-clinic-primary font-medium mb-2">
                      {doctor.title}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {doctor.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {doctor.bio}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4 mr-2 text-clinic-accent" />
                      <span>{doctor.experience} de experiência</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2 text-clinic-accent" />
                      <span>{doctor.consultationDays.join(", ")}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="w-4 h-4 mr-2 text-clinic-accent" />
                      <span>{doctor.languages.join(", ")}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
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
                    >
                      Ver Perfil Completo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para cuidar da sua saúde?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Nossa equipe está preparada para oferecer o melhor atendimento
            médico. Agende sua consulta hoje mesmo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-clinic-gradient hover:opacity-90"
              asChild
            >
              <Link to="/contato">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/portal">
                <Users className="w-5 h-5 mr-2" />
                Portal do Paciente
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
