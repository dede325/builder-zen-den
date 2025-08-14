import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Pause
} from 'lucide-react';

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'consulta',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Tecnologia Médica Avançada",
      subtitle: "Equipamentos modernos para diagnósticos precisos"
    },
    {
      url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
      title: "Atendimento Humanizado",
      subtitle: "Cuidado personalizado e acolhedor"
    },
    {
      url: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2086&q=80",
      title: "Especialistas Qualificados",
      subtitle: "Equipe médica experiente e dedicada"
    },
    {
      url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: "Ambiente Moderno",
      subtitle: "Instalações confortáveis e seguras"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const specialties = [
    { name: 'Cardiologia', icon: Heart, description: 'Cuidados especializados do coração' },
    { name: 'Pediatria', icon: Baby, description: 'Atendimento dedicado às crianças' },
    { name: 'Cirurgia Geral', icon: Activity, description: 'Procedimentos cirúrgicos seguros' },
    { name: 'Dermatologia', icon: Shield, description: 'Saúde e beleza da pele' },
    { name: 'Neurologia', icon: Brain, description: 'Cuidados do sistema nervoso' },
    { name: 'Ginecologia-Obstetrícia', icon: UserCheck, description: 'Saúde da mulher' },
    { name: 'Ortopedia', icon: Activity, description: 'Saúde dos ossos e articulações' },
    { name: 'Otorrinolaringologia', icon: Eye, description: 'Ouvido, nariz e garganta' },
    { name: 'Urologia', icon: Stethoscope, description: 'Sistema urinário e reprodutor' },
    { name: 'Endocrinologia', icon: Zap, description: 'Hormônios e metabolismo' },
    { name: 'Gastroenterologia', icon: Activity, description: 'Sistema digestivo' },
    { name: 'Medicina do Trabalho', icon: Users, description: 'Saúde ocupacional' }
  ];

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      errors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Formato de e-mail inválido';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Formato de telefone inválido (mínimo 9 dígitos)';
    }

    if (!formData.message.trim()) {
      errors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous status
    setSubmitStatus({ type: null, message: '' });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
        });

        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'consulta',
          message: ''
        });
        setFormErrors({});
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Erro ao enviar mensagem. Tente novamente.'
        });

        // Handle field-specific errors
        if (result.errors) {
          setFormErrors(result.errors);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Erro de conexão. Verifique sua internet e tente novamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">Clínica Bem Cuidar</h1>
                <p className="text-xs text-muted-foreground">Centro Médico</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Início</a>
              <a href="#especialidades" className="text-foreground hover:text-primary transition-colors">Especialidades</a>
              <a href="#exames" className="text-foreground hover:text-primary transition-colors">Exames</a>
              <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
              <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
              <Link to="/portal" className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Portal do Paciente
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#inicio" className="text-foreground hover:text-primary transition-colors">Início</a>
                <a href="#especialidades" className="text-foreground hover:text-primary transition-colors">Especialidades</a>
                <a href="#exames" className="text-foreground hover:text-primary transition-colors">Exames</a>
                <a href="#sobre" className="text-foreground hover:text-primary transition-colors">Sobre</a>
                <a href="#contato" className="text-foreground hover:text-primary transition-colors">Contato</a>
                <Link to="/portal" className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-fit">
                  Portal do Paciente
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section id="inicio" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
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
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute bottom-4 right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="text-white">
                <div className="mb-4">
                  <h3 className="text-xl lg:text-2xl font-medium mb-2 opacity-90">
                    {heroImages[currentSlide].title}
                  </h3>
                  <p className="text-lg opacity-75">
                    {heroImages[currentSlide].subtitle}
                  </p>
                </div>

                <h1 className="text-4xl lg:text-7xl font-bold mb-6 leading-tight">
                  Cuidamos da sua <span className="text-[#79cbcb]">saúde</span><br />
                  com humanização<br />
                  e excelência
                </h1>

                <p className="text-xl lg:text-2xl mb-8 max-w-2xl opacity-90 leading-relaxed">
                  Diagnóstico rápido, atendimento humanizado e foco no seu bem-estar.
                  Na Clínica Bem Cuidar, sua saúde é nossa prioridade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-clinic-gradient hover:opacity-90 text-white border-0">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Consulta
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Entrar em Contato
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Por que escolher a Bem Cuidar?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compromisso com a excelência no atendimento médico e cuidado humanizado
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Diagnóstico Rápido</h4>
                <p className="text-muted-foreground">
                  Tecnologia avançada e profissionais experientes para diagnósticos precisos e ágeis
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Atendimento Humanizado</h4>
                <p className="text-muted-foreground">
                  Cuidado personalizado com foco no conforto e bem-estar de cada paciente
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Excelência Médica</h4>
                <p className="text-muted-foreground">
                  Equipe de especialistas qualificados com anos de experiência e dedicação
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="especialidades" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Nossas Especialidades</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cobertura médica completa com especialistas qualificados em diversas áreas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-clinic-accent/10 rounded-lg flex items-center justify-center group-hover:bg-clinic-accent/20 transition-colors">
                      <specialty.icon className="w-5 h-5 text-clinic-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground">{specialty.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{specialty.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section id="exames" className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Exames Disponíveis</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tecnologia moderna para exames precisos e confiáveis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Activity className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Eletrocardiograma</h4>
                <p className="text-muted-foreground">Avaliação da atividade elétrica do coração</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Ecocardiograma</h4>
                <p className="text-muted-foreground">Ultrassom do coração para diagnóstico detalhado</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Análises Clínicas</h4>
                <p className="text-muted-foreground">Exames laboratoriais completos e precisos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Horário de Funcionamento</h3>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Segunda a Sexta</span>
                    <span className="text-clinic-accent font-semibold">07:00 - 19:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sábado</span>
                    <span className="text-clinic-accent font-semibold">07:00 - 13:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Domingo</span>
                    <span className="text-muted-foreground">Fechado</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
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
      <section id="contato" className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Entre em Contato</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos prontos para cuidar da sua saúde. Entre em contato conosco!
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-clinic-accent mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Localização</h4>
                      <p className="text-muted-foreground">
                        Avenida 21 de Janeiro, Nº 351<br />
                        Benfica, Luanda (próx. Talatona)<br />
                        Angola
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-clinic-accent mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Telefone</h4>
                      <p className="text-muted-foreground">+244 945 344 650</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-clinic-accent mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">E-mail</h4>
                      <p className="text-muted-foreground">
                        recepcao@bemcuidar.co.ao<br />
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
                <CardTitle>Envie sua Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário e entraremos em contato em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="consulta">Consulta</option>
                      <option value="duvida">Dúvida</option>
                      <option value="sugestao">Sugestão</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-clinic-gradient hover:opacity-90">
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-clinic-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                  alt="Clínica Bem Cuidar Logo"
                  className="w-10 h-10 object-contain filter brightness-0 invert"
                />
                <div>
                  <h4 className="text-xl font-bold">Clínica Bem Cuidar</h4>
                  <p className="text-blue-100">Centro Médico</p>
                </div>
              </div>
              <p className="text-blue-100">
                Cuidamos da sua saúde com humanização, tecnologia e excelência médica.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <div className="space-y-2 text-blue-100">
                <p><MapPin className="w-4 h-4 inline mr-2" />Av. 21 de Janeiro, Nº 351, Benfica</p>
                <p><Phone className="w-4 h-4 inline mr-2" />+244 945 344 650</p>
                <p><Mail className="w-4 h-4 inline mr-2" />recepcao@bemcuidar.co.ao</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link to="/portal" className="block text-blue-100 hover:text-white transition-colors">
                  Portal do Paciente
                </Link>
                <a href="#especialidades" className="block text-blue-100 hover:text-white transition-colors">
                  Especialidades
                </a>
                <a href="#exames" className="block text-blue-100 hover:text-white transition-colors">
                  Exames
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-600 mt-8 pt-8 text-center text-blue-100">
            <p>&copy; 2024 Clínica Bem Cuidar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
