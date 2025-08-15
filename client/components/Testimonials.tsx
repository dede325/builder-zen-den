import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Play,
  Pause,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  rating: number;
  specialty: string;
  doctor: string;
  testimonial: string;
  date: string;
}

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Maria João Santos",
      age: 45,
      location: "Luanda",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b15ad0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Cardiologia",
      doctor: "Dr. António Silva",
      testimonial: "Excelente atendimento! O Dr. António foi muito atencioso e explicou tudo sobre meu problema cardíaco de forma clara. A equipe da recepção também é muito profissional. Recomendo a todos!",
      date: "Dezembro 2024"
    },
    {
      id: "2",
      name: "Carlos Mendes",
      age: 52,
      location: "Benfica",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Cirurgia Geral",
      doctor: "Dr. João Mendes",
      testimonial: "Fui operado pelo Dr. João e não poderia estar mais satisfeito. A cirurgia foi um sucesso e a recuperação foi muito melhor do que esperava. Instalações modernas e equipe excepcional.",
      date: "Novembro 2024"
    },
    {
      id: "3",
      name: "Ana Paula Costa",
      age: 34,
      location: "Talatona",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Dermatologia",
      doctor: "Dra. Ana Costa",
      testimonial: "A Dra. Ana é fantástica! Tratou meu problema de pele com muito cuidado e profissionalismo. O ambiente da clínica é muito limpo e organizado. Voltarei sempre!",
      date: "Dezembro 2024"
    },
    {
      id: "4",
      name: "José Fernando",
      age: 38,
      location: "Maianga",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Medicina do Trabalho",
      doctor: "Dr. Luís Tavares",
      testimonial: "Atendimento rápido e eficiente para os exames ocupacionais da minha empresa. Processo muito bem organizado e resultados entregues no prazo. Recomendo para outras empresas.",
      date: "Outubro 2024"
    },
    {
      id: "5",
      name: "Luísa Pereira",
      age: 29,
      location: "Viana",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Pediatria",
      doctor: "Dra. Maria Santos",
      testimonial: "A Dra. Maria é maravilhosa com crianças! Meu filho de 3 anos adorou a consulta. Ela tem uma paciência incrível e o consultório pediátrico é muito acolhedor. Muito obrigada!",
      date: "Novembro 2024"
    },
    {
      id: "6",
      name: "Roberto Silva",
      age: 41,
      location: "Kilamba",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      specialty: "Neurologia",
      doctor: "Dr. Fernando Dias",
      testimonial: "Estava com problemas de enxaqueca há meses. O Dr. Fernando fez um diagnóstico preciso e o tratamento está funcionando perfeitamente. Profissional muito competente!",
      date: "Setembro 2024"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPlaying, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-clinic-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            O que nossos pacientes dizem
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Depoimentos reais de pacientes que confiaram na Clínica Bem Cuidar
            para cuidar de sua saúde
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <Card className="overflow-hidden shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar and Info */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <Avatar className="w-20 h-20 mx-auto md:mx-0 mb-4">
                    <AvatarImage
                      src={testimonials[currentSlide].photo}
                      alt={testimonials[currentSlide].name}
                    />
                    <AvatarFallback>
                      {testimonials[currentSlide].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {testimonials[currentSlide].name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentSlide].age} anos, {testimonials[currentSlide].location}
                    </p>
                    <div className="flex justify-center md:justify-start">
                      {renderStars(testimonials[currentSlide].rating)}
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1">
                  <Quote className="w-8 h-8 text-clinic-accent mb-4 mx-auto md:mx-0" />
                  
                  <blockquote className="text-foreground leading-relaxed mb-6 text-center md:text-left text-lg">
                    "{testimonials[currentSlide].testimonial}"
                  </blockquote>
                  
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-clinic-primary">
                        {testimonials[currentSlide].specialty}
                      </span>
                      {" "} • {testimonials[currentSlide].doctor}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {testimonials[currentSlide].date}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="bg-white hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-clinic-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-white hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white hover:bg-gray-50"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentSlide + 1} de {testimonials.length}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-clinic-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">Satisfação dos Pacientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-clinic-primary mb-1">4.9</div>
            <div className="text-sm text-muted-foreground">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-clinic-primary mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Avaliações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-clinic-primary mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Recomendações</div>
          </div>
        </div>
      </div>
    </section>
  );
}
