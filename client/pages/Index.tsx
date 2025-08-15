import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SpecialtyModal, { SpecialtyInfo } from "@/components/SpecialtyModal";
import EnhancedFooter from "@/components/EnhancedFooter";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import SearchDialog from "@/components/SearchDialog";
import Testimonials from "@/components/Testimonials";
import Certifications from "@/components/Certifications";
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
  ChevronRight,
  Menu,
  X,
  ChevronLeft,
  Play,
  Pause,
  Search,
} from "lucide-react";

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "consulta",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialtyInfo | null>(null);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Tecnologia Médica Avançada",
      subtitle: "Equipamentos modernos para diagnósticos precisos",
    },
    {
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      title: "Atendimento Humanizado",
      subtitle: "Cuidado personalizado e acolhedor",
    },
    {
      url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80",
      title: "Especialistas Qualificados",
      subtitle: "Equipe médica experiente e dedicada",
    },
    {
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Ambiente Moderno",
      subtitle: "Instalações confortáveis e seguras",
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, heroImages.length]);

  // Fetch current year from server
  useEffect(() => {
    const fetchServerDate = async () => {
      try {
        const response = await fetch("/api/server-date");
        const data = await response.json();
        setCurrentYear(data.year);
      } catch (error) {
        console.warn("Failed to fetch server date, using client date:", error);
        setCurrentYear(new Date().getFullYear());
      }
    };

    fetchServerDate();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroImages.length) % heroImages.length,
    );
  };

  const specialties: SpecialtyInfo[] = [
    {
      name: "Cardiologia",
      icon: Heart,
      description: "Cuidados especializados do coração",
      detailedDescription:
        "A cardiologia é a especialidade médica que se dedica ao diagnóstico e tratamento das doenças que acometem o coração e o sistema cardiovascular. Nossa equipe de cardiologistas está preparada para oferecer cuidados completos desde a prevenção até o tratamento de condições cardíacas complexas.",
      conditions: [
        "Hipertensão arterial",
        "Insuficiência cardíaca",
        "Arritmias cardíacas",
        "Infarto do miocárdio",
        "Angina",
        "Doenças das válvulas cardíacas",
      ],
      procedures: [
        "Eletrocardiograma",
        "Ecocardiograma",
        "Holter 24h",
        "Teste ergométrico",
        "Cateterismo cardíaco",
        "Angioplastia",
      ],
      imageUrl:
        "https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg",
      specialists: ["Maria Silva", "João Santos", "Ana Costa"],
    },
    {
      name: "Pediatria",
      icon: Baby,
      description: "Atendimento dedicado às crianças",
      detailedDescription:
        "A pediatria é a especialidade médica dedicada à assistência de crianças, adolescentes e jovens até os 18 anos. Nossos pediatras oferecem cuidados preventivos e curativos, acompanhando o crescimento e desenvolvimento saudável desde o nascimento.",
      conditions: [
        "Infecções respiratórias",
        "Diarreias e gastroenterites",
        "Alergias",
        "Distúrbios do crescimento",
        "Vacinação",
        "Desenvolvimento neuropsicomotor",
      ],
      procedures: [
        "Consultas de rotina",
        "Vacinação",
        "Testes de desenvolvimento",
        "Orientação nutricional",
        "Puericultura",
        "Nebulização",
      ],
      imageUrl:
        "https://images.pexels.com/photos/695954/pexels-photo-695954.jpeg",
      specialists: ["Pedro Oliveira", "Lucia Fernandes", "Carlos Mendes"],
    },
    {
      name: "Cirurgia Geral",
      icon: Activity,
      description: "Procedimentos cirúrgicos seguros",
      detailedDescription:
        "A cirurgia geral abrange procedimentos cirúrgicos em diversas partes do corpo. Nossa equipe cirúrgica utiliza técnicas modernas e minimamente invasivas para garantir os melhores resultados e uma recuperação mais rápida para nossos pacientes.",
      conditions: [
        "Hérnias",
        "Cálculos biliares",
        "Apendicite",
        "Tumores benignos",
        "Feridas complexas",
        "Doenças da tireoide",
      ],
      procedures: [
        "Herniorrafia",
        "Colecistectomia",
        "Apendicectomia",
        "Biópsias",
        "Cirurgia de tireoide",
        "Cirurgia laparoscópica",
      ],
      imageUrl:
        "https://images.pexels.com/photos/25205116/pexels-photo-25205116.jpeg",
      specialists: ["Roberto Lima", "Fernanda Alves", "Miguel Torres"],
    },
    {
      name: "Dermatologia",
      icon: Shield,
      description: "Saúde e beleza da pele",
      detailedDescription:
        "A dermatologia é a especialidade que cuida da saúde da pele, cabelos e unhas. Oferecemos tratamentos para doenças dermatológicas, procedimentos estéticos e orientações para manutenção da saúde da pele.",
      conditions: [
        "Acne",
        "Dermatite",
        "Psoríase",
        "Câncer de pele",
        "Alopecia",
        "Micoses",
      ],
      procedures: [
        "Consulta dermatológica",
        "Mapeamento de pintas",
        "Biópsias de pele",
        "Crioterapia",
        "Procedimentos estéticos",
        "Laser terapêutico",
      ],
      imageUrl:
        "https://images.pexels.com/photos/8528645/pexels-photo-8528645.jpeg",
      specialists: ["Sandra Ribeiro", "Paulo Martins", "Clara Sousa"],
    },
    {
      name: "Neurologia",
      icon: Brain,
      description: "Cuidados do sistema nervoso",
      detailedDescription:
        "A neurologia trata das doenças do sistema nervoso central e periférico. Nossa equipe neurológica está preparada para diagnosticar e tratar condições que afetam o cérebro, medula espinhal, nervos e músculos.",
      conditions: [
        "Enxaqueca",
        "Epilepsia",
        "AVC",
        "Doença de Parkinson",
        "Alzheimer",
        "Esclerose múltipla",
      ],
      procedures: [
        "Eletroencefalograma",
        "Eletroneuromiografia",
        "Punção lombar",
        "Doppler transcraniano",
        "Consulta neurológica",
        "Testes cognitivos",
      ],
      imageUrl:
        "https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg",
      specialists: [
        "Dr. Antonio Gomes",
        "Dra. Beatriz Rocha",
        "Dr. Fernando Dias",
      ],
    },
    {
      name: "Ginecologia-Obstetrícia",
      icon: UserCheck,
      description: "Saúde da mulher",
      detailedDescription:
        "A ginecologia e obstetrícia é a especialidade que cuida da sa��de da mulher em todas as fases da vida. Oferecemos acompanhamento ginecológico, pré-natal, parto e cuidados pós-parto.",
      conditions: [
        "Infecções ginecológicas",
        "Distúrbios menstruais",
        "Menopausa",
        "Gravidez",
        "Câncer ginecológico",
        "Planejamento familiar",
      ],
      procedures: [
        "Papanicolaou",
        "Ultrassom pélvico",
        "Colposcopia",
        "Pré-natal",
        "Parto normal",
        "Cesariana",
      ],
      imageUrl:
        "https://images.pexels.com/photos/8528645/pexels-photo-8528645.jpeg",
      specialists: [
        "Dra. Mariana Lopes",
        "Dra. Isabel Carvalho",
        "Dra. Teresa Nunes",
      ],
    },
    {
      name: "Ortopedia",
      icon: Activity,
      description: "Saúde dos ossos e articulações",
      detailedDescription:
        "A ortopedia é a especialidade médica que cuida do sistema musculoesquelético. Tratamos fraturas, lesões esportivas, doenças degenerativas e deformidades dos ossos, articulações, músculos, tendões e ligamentos.",
      conditions: [
        "Fraturas",
        "Artrose",
        "Lesões esportivas",
        "Hérnia de disco",
        "Tendinites",
        "Escoliose",
      ],
      procedures: [
        "Radiografias",
        "Infiltrações",
        "Artroscopia",
        "Cirurgia de coluna",
        "Próteses articulares",
        "Fisioterapia",
      ],
      imageUrl:
        "https://images.pexels.com/photos/20860586/pexels-photo-20860586.jpeg",
      specialists: [
        "Dr. Ricardo Pereira",
        "Dr. José Ferreira",
        "Dra. Sónia Ramos",
      ],
    },
    {
      name: "Otorrinolaringologia",
      icon: Eye,
      description: "Ouvido, nariz e garganta",
      detailedDescription:
        "A otorrinolaringologia trata das doenças do ouvido, nariz, seios paranasais, faringe e laringe. Nossa equipe oferece cuidados completos para problemas auditivos, respiratórios e de deglutição.",
      conditions: [
        "Otite",
        "Sinusite",
        "Amigdalite",
        "Perda auditiva",
        "Ronco e apneia",
        "Vertigem",
      ],
      procedures: [
        "Audiometria",
        "Endoscopia nasal",
        "Timpanometria",
        "Cirurgia de amígdalas",
        "Septoplastia",
        "Implante coclear",
      ],
      imageUrl:
        "https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg",
      specialists: [
        "Dr. Manuel Castro",
        "Dra. Patrícia Moreira",
        "Dr. André Silva",
      ],
    },
    {
      name: "Urologia",
      icon: Stethoscope,
      description: "Sistema urinário e reprodutor",
      detailedDescription:
        "A urologia é a especialidade que trata das doenças do sistema urinário masculino e feminino, e do sistema reprodutor masculino. Oferecemos cuidados desde a prevenção até tratamentos cirúrgicos complexos.",
      conditions: [
        "Infecção urinária",
        "Cálculos renais",
        "Próstata aumentada",
        "Incontinência urinária",
        "Disfunção erétil",
        "Câncer urológico",
      ],
      procedures: [
        "Ultrassom urológico",
        "Cistoscopia",
        "Biópsia de próstata",
        "Litotripsia",
        "Cirurgia de próstata",
        "Vasectomia",
      ],
      imageUrl:
        "https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg",
      specialists: [
        "Dr. Henrique Viana",
        "Dr. Gabriel Monteiro",
        "Dra. Raquel Teixeira",
      ],
    },
    {
      name: "Endocrinologia",
      icon: Zap,
      description: "Hormônios e metabolismo",
      detailedDescription:
        "A endocrinologia é a especialidade que cuida dos distúrbios hormonais e metabólicos. Tratamos diabetes, doenças da tireoide, obesidade e outros desequilíbrios hormonais que afetam o funcionamento do organismo.",
      conditions: [
        "Diabetes",
        "Hipotireoidismo",
        "Hipertireoidismo",
        "Obesidade",
        "Osteoporose",
        "Síndrome metabólica",
      ],
      procedures: [
        "Consulta endócrina",
        "Testes hormonais",
        "Curva glicêmica",
        "Densitometria óssea",
        "Orientação nutricional",
        "Monitorização contínua",
      ],
      imageUrl:
        "https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg",
      specialists: [
        "Dra. Cristina Rodrigues",
        "Dr. Rui Barbosa",
        "Dra. Helena Correia",
      ],
    },
    {
      name: "Gastroenterologia",
      icon: Activity,
      description: "Sistema digestivo",
      detailedDescription:
        "A gastroenterologia trata das doenças do sistema digestivo, incluindo esôfago, estômago, intestinos, f��gado, vesícula e pâncreas. Oferecemos diagnóstico e tratamento de diversas condições digestivas.",
      conditions: [
        "Gastrite",
        "Úlcera péptica",
        "Refluxo gastroesofágico",
        "Síndrome do intestino irritável",
        "Hepatite",
        "Doença de Crohn",
      ],
      procedures: [
        "Endoscopia digestiva",
        "Colonoscopia",
        "Retossigmoidoscopia",
        "Teste respiratório",
        "Biópsia hepática",
        "Polipectomia",
      ],
      imageUrl:
        "https://images.pexels.com/photos/6320167/pexels-photo-6320167.jpeg",
      specialists: [
        "Dr. Vítor Almeida",
        "Dra. Susana Pinto",
        "Dr. Nuno Araújo",
      ],
    },
    {
      name: "Medicina do Trabalho",
      icon: Users,
      description: "Saúde ocupacional",
      detailedDescription:
        "A medicina do trabalho foca na prevenção, diagnóstico e tratamento de doenças relacionadas ao trabalho. Oferecemos exames ocupacionais e programas de saúde para empresas e trabalhadores.",
      conditions: [
        "LER/DORT",
        "Perda auditiva ocupacional",
        "Doenças respiratórias ocupacionais",
        "Stress ocupacional",
        "Acidentes de trabalho",
        "Exposição a agentes químicos",
      ],
      procedures: [
        "Exames admissionais",
        "Exames periódicos",
        "Audiometria ocupacional",
        "Espirometria",
        "Acuidade visual",
        "Avaliação ergonômica",
      ],
      imageUrl:
        "https://images.pexels.com/photos/9951388/pexels-photo-9951388.jpeg",
      specialists: [
        "Dr. Luís Tavares",
        "Dra. Mónica Bastos",
        "Dr. Sérgio Costa",
      ],
    },
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de e-mail inválido";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telefone é obrigatório";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Formato de telefone inválido (mínimo 9 dígitos)";
    }

    if (!formData.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            result.message ||
            "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        });

        // Reset form on success
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "consulta",
          message: "",
        });
        setFormErrors({});
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Erro ao enviar mensagem. Tente novamente.",
        });

        // Handle field-specific errors
        if (result.errors) {
          setFormErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSpecialtyClick = (specialty: SpecialtyInfo) => {
    setSelectedSpecialty(specialty);
    setIsSpecialtyModalOpen(true);
  };

  const closeSpecialtyModal = () => {
    setIsSpecialtyModalOpen(false);
    setSelectedSpecialty(null);
  };

  return (
    <div className="min-h-screen bg-background pt-16 sm:pt-20">
      {/* Header */}
      <header className="nav-premium fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">
                  Clínica Bem Cuidar
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Cuidar é Amar
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
              <a
                href="#inicio"
                className="link-hover nav-item-hover font-medium"
              >
                Início
              </a>
              <a
                href="#especialidades"
                className="link-hover nav-item-hover font-medium"
              >
                Especialidades
              </a>
              <Link
                to="/exames"
                className="link-hover nav-item-hover font-medium"
              >
                Exames
              </Link>
              <Link
                to="/sobre"
                className="link-hover nav-item-hover font-medium"
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="link-hover nav-item-hover font-medium"
              >
                Contato
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="mr-2 xl:mr-4 hidden xl:flex btn-hover-lift"
              >
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="mr-2 xl:hidden p-2 btn-hover-lift"
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button
                asChild
                variant="clinic"
                size="sm"
                className="px-3 xl:px-4 btn-hover-lift"
              >
                <Link to="/portal">Portal</Link>
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-3">
                <a
                  href="#inicio"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </a>
                <a
                  href="#especialidades"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Especialidades
                </a>
                <Link
                  to="/galeria"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galeria
                </Link>
                <Link
                  to="/equipe"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipe
                </Link>
                <Link
                  to="/exames"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Exames
                </Link>
                <Link
                  to="/sobre"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  to="/contato"
                  className="text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full sm:w-auto justify-center min-h-[44px]"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                  <Button
                    asChild
                    className="bg-clinic-gradient hover:opacity-90 text-white border-0 w-full sm:w-auto justify-center min-h-[44px]"
                  >
                    <Link to="/portal" onClick={() => setIsMenuOpen(false)}>
                      Portal do Paciente
                    </Link>
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section
        id="inicio"
        className="relative h-screen overflow-hidden -mt-16 sm:-mt-20"
      >
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="bg-black/40 border-white/50 text-white backdrop-blur-sm min-h-[44px] w-10 sm:w-auto slide-control-hover focus-ring-enhanced"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="bg-black/40 border-white/50 text-white backdrop-blur-sm min-h-[44px] w-10 sm:w-auto slide-control-hover focus-ring-enhanced"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute bottom-16 sm:bottom-4 right-2 sm:right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/40 border-white/50 text-white backdrop-blur-sm min-h-[44px] w-10 sm:w-auto slide-control-hover focus-ring-enhanced"
            aria-label={isPlaying ? "Pausar slideshow" : "Reproduzir slideshow"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center slide-indicator-hover ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            >
              <span
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="text-white">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-medium mb-2 opacity-90">
                    {heroImages[currentSlide].title}
                  </h3>
                  <p className="text-base sm:text-lg opacity-75">
                    {heroImages[currentSlide].subtitle}
                  </p>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
                  Cuidamos da sua <span className="text-[#79cbcb]">saúde</span>
                  <br />
                  com humanização
                  <br className="hidden sm:block" /> e excelência
                </h1>

                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 max-w-2xl opacity-90 leading-relaxed">
                  Diagnóstico rápido, atendimento humanizado e foco no seu
                  bem-estar. Na Clínica Bem Cuidar, sua saúde é nossa
                  prioridade.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link to="/contato" className="w-full sm:w-auto">
                    <Button
                      variant="clinic"
                      size="xl"
                      className="w-full sm:w-auto btn-hover-lift text-on-dark"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Agendar Consulta
                    </Button>
                  </Link>
                  <Link to="/contato" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="xl"
                      className="border-white/50 text-white hover:bg-white hover:text-primary backdrop-blur-sm w-full sm:w-auto btn-hover-lift focus-ring-enhanced"
                    >
                      Entrar em Contato
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Por que escolher a Bem Cuidar?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compromisso com a excelência no atendimento médico e cuidado
              humanizado
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="card-medical-premium text-center">
              <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4 equipment-hover">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-2">
                  Diagnóstico Rápido
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Tecnologia avançada e profissionais experientes para
                  diagnósticos precisos e ágeis
                </p>
              </CardContent>
            </Card>

            <Card className="card-medical-premium text-center">
              <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4 equipment-hover">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-2">
                  Atendimento Humanizado
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Cuidado personalizado com foco no conforto e bem-estar de cada
                  paciente
                </p>
              </CardContent>
            </Card>

            <Card className="card-medical-premium text-center sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-6 sm:pt-8 p-4 sm:p-6">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4 equipment-hover">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold mb-2">
                  Excelência Médica
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Equipe de especialistas qualificados com anos de experiência e
                  dedicação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Nossas Especialidades
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cobertura médica completa com especialistas qualificados em
              diversas áreas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {specialties.map((specialty, index) => (
              <Card
                key={index}
                className="specialty-card-hover cursor-pointer group focus-ring-enhanced"
                onClick={() => handleSpecialtyClick(specialty)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSpecialtyClick(specialty);
                  }
                }}
                role="button"
                aria-label={`Ver detalhes da especialidade ${specialty.name}`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="specialty-icon w-10 h-10 bg-clinic-accent/10 rounded-lg flex items-center justify-center">
                      <specialty.icon className="w-5 h-5 text-clinic-accent icon-hover" />
                    </div>
                    <h4 className="font-semibold text-foreground group-hover:text-clinic-primary transition-colors text-sm sm:text-base">
                      {specialty.name}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {specialty.description}
                  </p>
                  <div className="mt-3 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity">
                    <p className="text-xs text-clinic-accent font-medium">
                      Clique para mais informações →
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section
        id="exames"
        className="py-12 sm:py-16 lg:py-20 bg-clinic-light/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Exames Disponíveis
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnologia moderna para exames precisos e confiáveis
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <Card className="text-center">
              <CardContent className="p-4 sm:p-6">
                <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">
                  Eletrocardiograma
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Avaliação da atividade elétrica do coração
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4 sm:p-6">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Ecocardiograma</h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Ultrassom do coração para diagnóstico detalhado
                </p>
              </CardContent>
            </Card>

            <Card className="text-center sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">
                  Análises Clínicas
                </h4>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Exames laboratoriais completos e precisos
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Certifications Section */}
      <Certifications />

      {/* About Section */}
      <section id="sobre" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Sobre a Clínica Bem Cuidar
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Há mais de uma década cuidando da sua saúde com dedicação e
              humanização
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h4 className="text-xl sm:text-2xl font-semibold mb-4 text-clinic-primary">
                  Nossa História
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  A Clínica Bem Cuidar nasceu com o propósito de oferecer
                  atendimento médico de qualidade, combinando tecnologia
                  avançada com cuidado humanizado. Nossa equipe multidisciplinar
                  trabalha incansavelmente para proporcionar a melhor
                  experiência de cuidado à saúde.
                </p>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-semibold mb-4 text-clinic-primary">
                  Nossa Missão
                </h4>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Promover saúde e bem-estar através de atendimento médico
                  humanizado, utilizando tecnologia de ponta e profissionais
                  altamente qualificados, sempre priorizando o conforto e a
                  confiança dos nossos pacientes.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Card className="text-center">
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 text-sm sm:text-base">
                    1000+
                  </h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Pacientes Atendidos
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 text-sm sm:text-base">
                    15+
                  </h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Anos de Experiência
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 text-sm sm:text-base">
                    12
                  </h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Especialidades
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h5 className="font-semibold mb-2 text-sm sm:text-base">
                    100%
                  </h5>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Satisfação
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Horário de Funcionamento
            </h3>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm sm:text-base">
                      Segunda a Sexta
                    </span>
                    <span className="text-clinic-accent font-semibold text-sm sm:text-base">
                      07:00 - 19:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm sm:text-base">
                      Sábado
                    </span>
                    <span className="text-clinic-accent font-semibold text-sm sm:text-base">
                      07:00 - 13:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm sm:text-base">
                      Domingo
                    </span>
                    <span className="text-muted-foreground text-sm sm:text-base">
                      Fechado
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground text-center">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Atendimento de urgência 24 horas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        id="contato"
        className="py-12 sm:py-16 lg:py-20 bg-clinic-light/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Entre em Contato
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos prontos para cuidar da sua saúde. Entre em contato
              conosco!
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6 lg:space-y-8">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-clinic-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Localização
                      </h4>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Avenida 21 de Janeiro, Nº 351
                        <br />
                        Benfica, Luanda (próx. Talatona)
                        <br />
                        Angola
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-clinic-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        Telefone
                      </h4>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        +244 945 344 650
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-clinic-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">
                        E-mail
                      </h4>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        recepcao@bemcuidar.co.ao
                        <br />
                        coordenacao@bemcuidar.co.ao
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Envie sua Mensagem
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Preencha o formulário e entraremos em contato em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`mb-4 p-4 rounded-lg ${
                      submitStatus.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <X className="w-5 h-5 mr-2" />
                      )}
                      {submitStatus.message}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm sm:text-base">
                      Nome Completo *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`min-h-[44px] ${formErrors.name ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm sm:text-base">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`min-h-[44px] ${formErrors.email ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                      placeholder="exemplo@email.com"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm sm:text-base">
                      Telefone *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={`min-h-[44px] ${formErrors.phone ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                      placeholder="+244 XXX XXX XXX"
                    />
                    {formErrors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm sm:text-base">
                      Assunto *
                    </Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className="w-full p-3 border border-input rounded-md bg-background disabled:opacity-50 min-h-[44px]"
                      disabled={isSubmitting}
                    >
                      <option value="consulta">Consulta</option>
                      <option value="duvida">Dúvida</option>
                      <option value="sugestao">Sugestão</option>
                    </select>
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm sm:text-base">
                      Mensagem *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      rows={4}
                      className={`min-h-[120px] ${formErrors.message ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                      placeholder="Descreva sua dúvida ou necessidade..."
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-clinic-gradient hover:opacity-90 disabled:opacity-50 min-h-[48px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    * Campos obrigatórios
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <EnhancedFooter />

      {/* Floating Action Buttons */}
      <FloatingActionButtons />

      {/* Search Dialog */}
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Specialty Modal */}
      <SpecialtyModal
        specialty={selectedSpecialty}
        isOpen={isSpecialtyModalOpen}
        onClose={closeSpecialtyModal}
      />
    </div>
  );
}
