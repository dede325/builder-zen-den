import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Phone,
  Heart,
  Stethoscope,
  Shield,
  Award,
  ChevronDown,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Star,
  Users,
  MapPin,
  Clock,
} from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  overlay: string;
  cta: {
    primary: string;
    secondary: string;
  };
}

const heroSlides: Slide[] = [
  {
    id: "tecnologia",
    title: "Tecnologia Médica Avançada",
    subtitle: "Diagnósticos precisos com equipamentos de última geração",
    description:
      "Na Clínica Bem Cuidar, investimos continuamente em tecnologia médica de ponta para garantir diagnósticos rápidos e precisos, proporcionando o melhor cuidado de saúde em Angola.",
    image:
      "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    overlay:
      "linear-gradient(135deg, rgba(121, 203, 203, 0.8) 0%, rgba(86, 98, 100, 0.6) 100%)",
    cta: {
      primary: "Agendar Consulta",
      secondary: "Conhecer Tecnologias",
    },
  },
  {
    id: "humanizado",
    title: "Atendimento Humanizado",
    subtitle: "Cuidado personalizado focado no seu bem-estar",
    description:
      "Cada paciente é único. Por isso, oferecemos um atendimento personalizado e humanizado, onde o seu conforto e bem-estar são sempre a nossa prioridade máxima.",
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    overlay:
      "linear-gradient(135deg, rgba(86, 98, 100, 0.7) 0%, rgba(121, 203, 203, 0.5) 100%)",
    cta: {
      primary: "Marcar Consulta",
      secondary: "Nossa Filosofia",
    },
  },
  {
    id: "especialistas",
    title: "Especialistas Qualificados",
    subtitle: "Equipa médica experiente e dedicada",
    description:
      "Contamos com uma equipa multidisciplinar de especialistas altamente qualificados, com formação nacional e internacional, dedicados a proporcionar cuidados de excelência.",
    image:
      "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80",
    overlay:
      "linear-gradient(135deg, rgba(121, 203, 203, 0.6) 0%, rgba(86, 98, 100, 0.8) 100%)",
    cta: {
      primary: "Conhecer Equipa",
      secondary: "Especialidades",
    },
  },
  {
    id: "instalacoes",
    title: "Instalações Modernas",
    subtitle: "Ambiente confortável e seguro para todos",
    description:
      "Nossas instalações foram projetadas pensando no seu conforto e segurança, com ambientes modernos, climatizados e equipados com os mais altos padrões de qualidade e higiene.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    overlay:
      "linear-gradient(135deg, rgba(86, 98, 100, 0.6) 0%, rgba(121, 203, 203, 0.7) 100%)",
    cta: {
      primary: "Tour Virtual",
      secondary: "Localização",
    },
  },
];

const stats = [
  { icon: Users, value: "1000+", label: "Pacientes Atendidos" },
  { icon: Stethoscope, value: "15+", label: "Especialidades" },
  { icon: Award, value: "15+", label: "Anos de Experiência" },
  { icon: Star, value: "100%", label: "Satisfação dos Pacientes" },
];

export default function FullscreenHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const scrollToContent = () => {
    const element = document.getElementById("especialidades");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const currentSlideData = heroSlides[currentSlide];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.1,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.8,
        ease: "easeIn",
      },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background Slides */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
            style={{ y }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${currentSlideData.image})`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: currentSlideData.overlay }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controls */}
      <div className="absolute top-1/2 left-4 lg:left-8 transform -translate-y-1/2 z-30">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="absolute top-1/2 right-4 lg:right-8 transform -translate-y-1/2 z-30">
        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Play/Pause Control */}
      <div className="absolute bottom-6 right-4 lg:right-8 z-30">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
          aria-label={
            isPlaying ? "Pausar apresentação" : "Reproduzir apresentação"
          }
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentSlide(index)}
            className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white shadow-lg"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1.5 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
        style={{ opacity }}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <Badge
              variant="outline"
              className="bg-white/10 backdrop-blur-md border-white/20 text-white px-4 py-2 text-sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              Angola • Luanda • Benfica
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="block"
              >
                {currentSlideData.title}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl lg:text-3xl mb-6 font-light opacity-90"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`${currentSlide}-subtitle`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {currentSlideData.subtitle}
              </motion.span>
            </AnimatePresence>
          </motion.p>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto opacity-80 leading-relaxed"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`${currentSlide}-description`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {currentSlideData.description}
              </motion.span>
            </AnimatePresence>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="clinic"
                size="xl"
                className="px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white text-primary hover:bg-white/90"
              >
                <Link to="#contacto">
                  <Calendar className="w-5 h-5 mr-2" />
                  {currentSlideData.cta.primary}
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="xl"
                className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
              >
                {currentSlideData.cta.secondary}
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-4 bg-red-500/90 backdrop-blur-md rounded-full px-6 py-3 border border-red-400/30 shadow-lg"
          >
            <Phone className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="text-sm text-white/90">Urgências 24h</div>
              <a
                href="tel:+244945344650"
                className="text-white font-semibold hover:underline"
              >
                +244 945 344 650
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        style={{ opacity }}
      >
        <motion.button
          onClick={scrollToContent}
          className="flex flex-col items-center text-white/80 hover:text-white transition-colors group"
          whileHover={{ y: -2 }}
          aria-label="Deslizar para baixo"
        >
          <span className="text-sm mb-2 hidden lg:block">Explorar</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 group-hover:border-white/60"
          >
            <div className="w-1 h-3 bg-white/60 rounded-full group-hover:bg-white/80" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Glass Overlay for modern effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
    </section>
  );
}
