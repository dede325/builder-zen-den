import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
import Footer from "@/components/Footer";
import FloatingActionButtons from "@/components/FloatingActionButtons";
import SearchDialog from "@/components/SearchDialog";
import Testimonials from "@/components/Testimonials";
import Certifications from "@/components/Certifications";
import ContactFormAngola from "@/components/ContactFormAngola";
import ConsentManager from "@/components/legal/ConsentManager";
import {
  GlassmorphismCard,
  ParallaxBackground,
  FadeInScroll,
  StaggerChildren,
  FloatingElement,
  ScaleOnHover,
  MagneticButton,
  TextReveal,
  GradientOrb,
  AnimatedCounter,
  RippleEffect,
} from "@/components/premium/AnimatedComponents";
import { pwaManager } from "@/lib/pwa-utils";
import { angolaFormatter } from "@/lib/locale-angola";
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
  Star,
  ArrowRight,
  Sparkles,
  MousePointer,
} from "lucide-react";

export default function EnhancedIndex() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState<SpecialtyInfo | null>(null);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  // Enhanced hero images with better quality and clinic focus
  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Tecnologia Médica Avançada",
      subtitle: "Equipamentos modernos para diagnósticos precisos",
      cta: "Ver Equipamentos",
    },
    {
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      title: "Atendimento Humanizado",
      subtitle: "Cuidado personalizado e acolhedor",
      cta: "Conhecer Equipa",
    },
    {
      url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80",
      title: "Especialistas Qualificados",
      subtitle: "Equipe médica experiente e dedicada",
      cta: "Ver Especialidades",
    },
    {
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Ambiente Moderno",
      subtitle: "Instalações confortáveis e seguras",
      cta: "Tour Virtual",
    },
  ];

  // Parallax transforms
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.3], [0.7, 0.3]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Slower transition for better user experience

    return () => clearInterval(interval);
  }, [isPlaying, heroImages.length]);

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
    // Add more specialties...
  ];

  const handleSpecialtyClick = (specialty: SpecialtyInfo) => {
    setSelectedSpecialty(specialty);
    setIsSpecialtyModalOpen(true);
  };

  const closeSpecialtyModal = () => {
    setIsSpecialtyModalOpen(false);
    setSelectedSpecialty(null);
  };

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-clinic-gradient z-50 origin-left"
        style={{ scaleX: scrollProgress }}
      />

      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GradientOrb
          size={600}
          color1="rgba(121, 203, 203, 0.1)"
          color2="rgba(86, 98, 100, 0.1)"
          className="top-10 -left-40"
          duration={12}
        />
        <GradientOrb
          size={400}
          color1="rgba(86, 98, 100, 0.1)"
          color2="rgba(121, 203, 203, 0.1)"
          className="bottom-20 -right-32"
          duration={15}
        />
      </div>

      {/* Enhanced Header with Glassmorphism */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <GlassmorphismCard
          intensity="heavy"
          className="mx-4 mt-4 border-white/20 shadow-2xl"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo with floating animation */}
              <FloatingElement duration={4} intensity={5}>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-clinic-gradient rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Clínica Bem Cuidar
                    </h1>
                    <p className="text-xs text-white/80 hidden sm:block">
                      Cuidar é Amar
                    </p>
                  </div>
                </div>
              </FloatingElement>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {["Início", "Especialidades", "Exames", "Sobre", "Contato"].map(
                  (item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-white/90 hover:text-white font-medium transition-colors relative"
                      whileHover={{ y: -2 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {item}
                    </motion.a>
                  ),
                )}

                <MagneticButton>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="border-white/50 text-white hover:bg-white hover:text-clinic-primary backdrop-blur-sm"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </MagneticButton>

                <MagneticButton>
                  <Button
                    asChild
                    className="bg-white text-clinic-primary hover:bg-white/90 font-medium"
                  >
                    <Link to="/portal">Portal do Paciente</Link>
                  </Button>
                </MagneticButton>
              </nav>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <motion.nav
              className="lg:hidden mt-4"
              initial={false}
              animate={{
                height: isMenuOpen ? "auto" : 0,
                opacity: isMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden" }}
            >
              <div className="space-y-3 pb-4">
                {["Início", "Especialidades", "Exames", "Sobre", "Contato"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="block text-white/90 hover:text-white py-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ),
                )}
                <div className="flex flex-col space-y-3 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSearchOpen(true)}
                    className="border-white/50 text-white hover:bg-white hover:text-clinic-primary"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                  <Button
                    asChild
                    className="bg-white text-clinic-primary hover:bg-white/90"
                  >
                    <Link to="/portal">Portal do Paciente</Link>
                  </Button>
                </div>
              </div>
            </motion.nav>
          </div>
        </GlassmorphismCard>
      </motion.header>

      {/* Enhanced Hero Section with Parallax */}
      <section id="inicio" className="relative h-screen overflow-hidden">
        <ParallaxBackground speed={0.5}>
          <div className="absolute inset-0">
            {heroImages.map((image, index) => (
              <motion.div
                key={index}
                className="absolute inset-0"
                variants={slideVariants}
                initial="enter"
                animate={index === currentSlide ? "center" : "exit"}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30"
              style={{ opacity: gradientOpacity }}
            />
          </div>
        </ParallaxBackground>

        {/* Enhanced Slider Controls */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <MagneticButton>
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="bg-black/40 border-white/50 text-white backdrop-blur-md hover:bg-white/20 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </MagneticButton>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <MagneticButton>
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-black/40 border-white/50 text-white backdrop-blur-md hover:bg-white/20 min-h-[44px]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </MagneticButton>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute bottom-6 right-4 z-20">
          <MagneticButton>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-black/40 border-white/50 text-white backdrop-blur-md hover:bg-white/20 min-h-[44px]"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </MagneticButton>
        </div>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-12 h-3" : "w-3 h-3"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`w-full h-full rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
              {index === currentSlide && (
                <motion.div
                  className="absolute inset-0 bg-clinic-gradient rounded-full"
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Enhanced Hero Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-6">
            <motion.div
              className="max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div className="text-white space-y-8">
                {/* Dynamic slide content */}
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <Badge
                    variant="outline"
                    className="border-white/50 text-white bg-white/10 backdrop-blur-sm"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {heroImages[currentSlide].title}
                  </Badge>

                  <p className="text-lg opacity-90">
                    {heroImages[currentSlide].subtitle}
                  </p>
                </motion.div>

                {/* Main headline with text reveal */}
                <TextReveal
                  text="Cuidamos da sua saúde com humanização e excelência"
                  className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight"
                />

                <motion.p
                  className="text-lg lg:text-xl xl:text-2xl opacity-90 max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  Diagnóstico rápido, atendimento humanizado e foco no seu
                  bem-estar. Na Clínica Bem Cuidar, sua saúde é nossa
                  prioridade.
                </motion.p>

                {/* Enhanced CTAs */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <MagneticButton>
                    <RippleEffect>
                      <Button
                        asChild
                        size="lg"
                        className="bg-clinic-gradient hover:opacity-90 text-white border-0 font-medium px-8 py-3 text-lg"
                      >
                        <Link to="/contato">
                          <Calendar className="w-5 h-5 mr-2" />
                          Agendar Consulta
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </RippleEffect>
                  </MagneticButton>

                  <MagneticButton>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-white/50 text-white hover:bg-white hover:text-clinic-primary backdrop-blur-sm font-medium px-8 py-3 text-lg"
                    >
                      <Link to="/portal">
                        <MousePointer className="w-5 h-5 mr-2" />
                        Portal do Paciente
                      </Link>
                    </Button>
                  </MagneticButton>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  className="flex flex-wrap items-center gap-6 pt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 2 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="opacity-90">4.9/5 · 1000+ pacientes</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Shield className="w-4 h-4" />
                    <span>Certificado ISO 9001</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Clock className="w-4 h-4" />
                    <span>15+ anos de experiência</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-clinic-light/30 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative">
          <FadeInScroll>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Heart className="w-3 h-3 mr-1" />
                Por que nos escolher
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Compromisso com a Excelência
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Combinamos tecnologia avançada com atendimento humanizado para
                proporcionar a melhor experiência de cuidado à saúde.
              </p>
            </div>
          </FadeInScroll>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Diagnóstico Rápido",
                description:
                  "Tecnologia avançada e profissionais experientes para diagnósticos precisos e ágeis",
                color: "from-blue-400 to-blue-600",
              },
              {
                icon: Heart,
                title: "Atendimento Humanizado",
                description:
                  "Cuidado personalizado com foco no conforto e bem-estar de cada paciente",
                color: "from-red-400 to-red-600",
              },
              {
                icon: Award,
                title: "Excelência Médica",
                description:
                  "Equipe de especialistas qualificados com anos de experiência e dedicação",
                color: "from-amber-400 to-amber-600",
              },
            ].map((item, index) => (
              <ScaleOnHover key={index}>
                <GlassmorphismCard
                  intensity="light"
                  className="text-center border-0 shadow-xl bg-white/80 backdrop-blur-lg p-8 h-full"
                >
                  <FloatingElement
                    duration={3 + index}
                    intensity={8}
                    delay={index * 0.5}
                  >
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </FloatingElement>

                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </GlassmorphismCard>
              </ScaleOnHover>
            ))}
          </StaggerChildren>

          {/* Stats Section */}
          <FadeInScroll>
            <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: 1000, suffix: "+", label: "Pacientes Atendidos" },
                { number: 15, suffix: "+", label: "Anos de Experiência" },
                { number: 12, suffix: "", label: "Especialidades" },
                { number: 99, suffix: "%", label: "Satisfação" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <AnimatedCounter
                    from={0}
                    to={stat.number}
                    duration={2}
                    suffix={stat.suffix}
                    className="text-3xl lg:text-4xl font-bold text-clinic-primary"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeInScroll>
        </div>
      </section>

      {/* Enhanced Specialties Section */}
      <section id="especialidades" className="py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <FadeInScroll>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Stethoscope className="w-3 h-3 mr-1" />
                Especialidades
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Cobertura Médica Completa
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Especialistas qualificados em diversas áreas para cuidar da sua
                saúde de forma integral.
              </p>
            </div>
          </FadeInScroll>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <ScaleOnHover key={index}>
                <GlassmorphismCard
                  intensity="light"
                  className="cursor-pointer group bg-white/60 backdrop-blur-md border-clinic-accent/20 hover:border-clinic-accent/40 transition-all duration-300 h-full"
                  onClick={() => handleSpecialtyClick(specialty)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <FloatingElement duration={3 + index * 0.5} intensity={6}>
                        <div className="w-12 h-12 bg-clinic-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                          <specialty.icon className="w-6 h-6 text-white" />
                        </div>
                      </FloatingElement>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-clinic-primary transition-colors">
                          {specialty.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      {specialty.description}
                    </p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-clinic-accent font-medium flex items-center">
                        Clique para mais informações
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </p>
                    </div>
                  </CardContent>
                </GlassmorphismCard>
              </ScaleOnHover>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Enhanced Contact Section with Angola Form */}
      <section
        id="contato"
        className="py-20 lg:py-32 bg-gradient-to-br from-clinic-light/30 to-white"
      >
        <div className="container mx-auto px-6">
          <FadeInScroll>
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                <Mail className="w-3 h-3 mr-1" />
                Contacto
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Entre em Contacto Connosco
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Estamos prontos para cuidar da sua saúde. Contacte-nos através
                do formulário ou pelos nossos contactos diretos.
              </p>
            </div>
          </FadeInScroll>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <FadeInScroll direction="left">
              <div className="space-y-8">
                <GlassmorphismCard
                  intensity="light"
                  className="p-6 bg-white/60"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-clinic-gradient rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Localização</h3>
                      <p className="text-muted-foreground">
                        Avenida 21 de Janeiro, Nº 351
                        <br />
                        Benfica, Luanda (próx. Talatona)
                        <br />
                        Angola
                      </p>
                    </div>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard
                  intensity="light"
                  className="p-6 bg-white/60"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-clinic-gradient rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Telefone</h3>
                      <p className="text-muted-foreground">
                        {angolaFormatter.formatPhone("+244945344650")}
                      </p>
                    </div>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard
                  intensity="light"
                  className="p-6 bg-white/60"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-clinic-gradient rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Horário</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Segunda a Sexta: 07:00 - 19:00</p>
                        <p>Sábado: 07:00 - 13:00</p>
                        <p>Domingo: Fechado</p>
                        <p className="text-xs mt-2 text-clinic-accent">
                          <Shield className="w-3 h-3 inline mr-1" />
                          Urgências 24h
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassmorphismCard>
              </div>
            </FadeInScroll>

            {/* Enhanced Contact Form */}
            <FadeInScroll direction="right">
              <ContactFormAngola />
            </FadeInScroll>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials and Certifications */}
      <Testimonials />
      <Certifications />

      {/* Footer */}
      <Footer />

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

      {/* Consent Manager */}
      <ConsentManager />
    </div>
  );
}
