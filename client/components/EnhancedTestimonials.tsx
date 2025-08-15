import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  CheckCircle,
  Shield,
  Award,
  Users,
  Calendar,
  MessageCircle,
  ThumbsUp,
  Verified
} from "lucide-react";
import { GlassmorphismCard, ScaleOnHover, FloatingElement } from "@/components/premium/AnimatedComponents";
import { angolaFormatter } from "@/lib/locale-angola";

interface Testimonial {
  id: string;
  name: string;
  age?: number;
  location: string;
  avatar?: string;
  rating: number;
  specialty: string;
  doctor: string;
  date: string;
  title: string;
  content: string;
  treatment: string;
  verified: boolean;
  helpful: number;
  tags: string[];
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria Santos",
    age: 45,
    location: "Luanda, Benfica",
    rating: 5,
    specialty: "Cardiologia",
    doctor: "Dr. João Silva",
    date: "2024-01-15",
    title: "Excelente atendimento cardiovascular",
    content: "A Clínica Bem Cuidar salvou minha vida. O Dr. João Silva foi muito atencioso e profissional. Os exames foram realizados rapidamente e o diagnóstico foi preciso. Recomendo fortemente!",
    treatment: "Consulta + ECG + Ecocardiograma",
    verified: true,
    helpful: 24,
    tags: ["Profissionalismo", "Rapidez", "Tecnologia"]
  },
  {
    id: "2", 
    name: "António Ferreira",
    age: 38,
    location: "Luanda, Talatona",
    rating: 5,
    specialty: "Ortopedia",
    doctor: "Dr. Ricardo Pereira",
    date: "2024-01-10",
    title: "Recuperação completa da lesão",
    content: "Após meses de dor no joelho, finalmente encontrei alívio na Bem Cuidar. O Dr. Ricardo foi excepcional, explicou tudo detalhadamente e o tratamento foi muito eficaz.",
    treatment: "Consulta + Fisioterapia + Infiltração",
    verified: true,
    helpful: 18,
    tags: ["Explicação clara", "Tratamento eficaz", "Cuidado"]
  },
  {
    id: "3",
    name: "Beatriz Lopes",
    age: 29,
    location: "Luanda, Maianga",
    rating: 5,
    specialty: "Pediatria",
    doctor: "Dra. Lucia Fernandes",
    date: "2024-01-08",
    title: "Cuidado excepcional com minha filha",
    content: "A Dra. Lucia é maravilhosa com crianças. Minha filha sempre tinha medo de médicos, mas aqui ela se sente confortável. O atendimento é humanizado e profissional.",
    treatment: "Consulta pediátrica + Vacinação",
    verified: true,
    helpful: 31,
    tags: ["Pediatria", "Humanização", "Confiança"]
  },
  {
    id: "4",
    name: "Carlos Mendes",
    age: 52,
    location: "Luanda, Rangel",
    rating: 5,
    specialty: "Gastroenterologia",
    doctor: "Dr. Vítor Almeida",
    date: "2024-01-05",
    title: "Diagnóstico preciso e tratamento eficaz",
    content: "Sofria de problemas digestivos há anos. O Dr. Vítor não só identificou o problema rapidamente como também me orientou sobre mudanças no estilo de vida. Estou muito melhor!",
    treatment: "Endoscopia + Consulta + Medicação",
    verified: true,
    helpful: 15,
    tags: ["Diagnóstico", "Orientação", "Resultados"]
  },
  {
    id: "5",
    name: "Isabel Carvalho",
    age: 34,
    location: "Luanda, Cazenga",
    rating: 5,
    specialty: "Ginecologia",
    doctor: "Dra. Mariana Lopes",
    date: "2024-01-03",
    title: "Atendimento ginecológico de qualidade",
    content: "A Dra. Mariana é muito profissional e atenciosa. Senti-me muito à vontade durante a consulta. As instalações são modernas e o atendimento é de primeira classe.",
    treatment: "Consulta ginecológica + Exames preventivos",
    verified: true,
    helpful: 22,
    tags: ["Profissionalismo", "Conforto", "Modernidade"]
  },
  {
    id: "6",
    name: "Paulo Santos",
    age: 41,
    location: "Luanda, Viana",
    rating: 5,
    specialty: "Dermatologia",
    doctor: "Dra. Sandra Ribeiro",
    date: "2024-01-01",
    title: "Tratamento dermatológico excelente",
    content: "A Dra. Sandra resolveu um problema de pele que me incomodava há muito tempo. O tratamento foi rápido e eficaz. A clínica tem equipamentos de última geração.",
    treatment: "Consulta + Laser terapêutico + Medicação",
    verified: true,
    helpful: 19,
    tags: ["Tecnologia", "Eficácia", "Rapidez"]
  }
];

export default function EnhancedTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    if (!autoPlay) return;
    
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Calculate average rating
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-clinic-light/20 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2379cbcb' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <MessageCircle className="w-3 h-3 mr-1" />
            Depoimentos
          </Badge>
          
          <h2 className="heading-medical text-3xl lg:text-4xl font-bold text-foreground mb-6">
            O que dizem nossos pacientes
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Histórias reais de pessoas que confiaram na Clínica Bem Cuidar 
            para cuidar da sua saúde e bem-estar.
          </p>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            <motion.div variants={staggerItem} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-clinic-primary">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avaliação média</p>
            </motion.div>

            <motion.div variants={staggerItem} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-clinic-accent" />
              </div>
              <p className="text-2xl font-bold text-clinic-primary">{totalReviews}+</p>
              <p className="text-sm text-muted-foreground">Depoimentos</p>
            </div>

            <motion.div variants={staggerItem} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Verified className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-clinic-primary">100%</p>
              <p className="text-sm text-muted-foreground">Verificados</p>
            </div>

            <motion.div variants={staggerItem} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ThumbsUp className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-clinic-primary">98%</p>
              <p className="text-sm text-muted-foreground">Recomendação</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <ScaleOnHover>
                <Button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-xl border border-clinic-accent/20"
                  onMouseEnter={() => setAutoPlay(false)}
                  onMouseLeave={() => setAutoPlay(true)}
                >
                  <ChevronLeft className="w-5 h-5 text-clinic-primary" />
                </Button>
              </ScaleOnHover>
            </div>

            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
              <ScaleOnHover>
                <Button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-xl border border-clinic-accent/20"
                  onMouseEnter={() => setAutoPlay(false)}
                  onMouseLeave={() => setAutoPlay(true)}
                >
                  <ChevronRight className="w-5 h-5 text-clinic-primary" />
                </Button>
              </ScaleOnHover>
            </div>

            {/* Testimonial Card */}
            <div className="px-16 py-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 }
                  }}
                >
                  <GlassmorphismCard 
                    intensity="light" 
                    className="testimonial-premium bg-white/95 shadow-premium-xl"
                  >
                    <CardContent className="p-8 lg:p-12">
                      {/* Quote Icon */}
                      <FloatingElement duration={4} intensity={5}>
                        <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                          <Quote className="w-8 h-8 text-white" />
                        </div>
                      </FloatingElement>

                      {/* Title */}
                      <h3 className="text-xl lg:text-2xl font-bold text-center text-clinic-primary mb-4">
                        {currentTestimonial.title}
                      </h3>

                      {/* Rating */}
                      <div className="flex justify-center mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-6 h-6 ${i < currentTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <blockquote className="text-lg lg:text-xl text-gray-700 text-center leading-relaxed mb-8 italic">
                        "{currentTestimonial.content}"
                      </blockquote>

                      {/* Treatment Info */}
                      <div className="bg-clinic-light/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-clinic-accent" />
                          <span className="text-sm font-semibold text-clinic-primary">Tratamento:</span>
                        </div>
                        <p className="text-sm text-gray-600">{currentTestimonial.treatment}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {currentTestimonial.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="bg-clinic-accent/10 text-clinic-primary border-clinic-accent/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Patient Info */}
                      <div className="flex items-center justify-center gap-4 pt-6 border-t border-clinic-accent/20">
                        <div className="w-12 h-12 bg-clinic-gradient rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {currentTestimonial.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">
                              {currentTestimonial.name}
                              {currentTestimonial.age && `, ${currentTestimonial.age} anos`}
                            </p>
                            {currentTestimonial.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{currentTestimonial.location}</p>
                          <p className="text-xs text-clinic-accent font-medium">
                            {currentTestimonial.specialty} • {currentTestimonial.doctor}
                          </p>
                          <p className="text-xs text-gray-500">
                            {angolaFormatter.formatDate(new Date(currentTestimonial.date))}
                          </p>
                        </div>
                      </div>

                      {/* Helpful Counter */}
                      <div className="text-center mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {currentTestimonial.helpful} pessoas acharam isto útil
                        </p>
                      </div>
                    </CardContent>
                  </GlassmorphismCard>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-clinic-gradient scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ver depoimento ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Control */}
          <div className="text-center mt-6">
            <Button
              onClick={() => setAutoPlay(!autoPlay)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {autoPlay ? 'Pausar' : 'Reproduzir'} slideshow
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <ScaleOnHover>
            <GlassmorphismCard intensity="light" className="text-center p-6 bg-white/80">
              <Shield className="w-8 h-8 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Depoimentos Verificados</h4>
              <p className="text-sm text-gray-600">
                Todos os depoimentos são de pacientes reais e verificados
              </p>
            </GlassmorphismCard>
          </ScaleOnHover>

          <ScaleOnHover>
            <GlassmorphismCard intensity="light" className="text-center p-6 bg-white/80">
              <Award className="w-8 h-8 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Qualidade Reconhecida</h4>
              <p className="text-sm text-gray-600">
                Prémios e reconhecimentos pela excelência no atendimento
              </p>
            </GlassmorphismCard>
          </ScaleOnHover>

          <ScaleOnHover>
            <GlassmorphismCard intensity="light" className="text-center p-6 bg-white/80">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Cuidado Humanizado</h4>
              <p className="text-sm text-gray-600">
                Tratamento personalizado com foco no bem-estar do paciente
              </p>
            </GlassmorphismCard>
          </ScaleOnHover>
        </motion.div>
      </div>
    </section>
  );
}