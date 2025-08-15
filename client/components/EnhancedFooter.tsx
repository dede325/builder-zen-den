import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Send,
  Shield,
  Award,
  Stethoscope,
  Users,
  CheckCircle,
  ExternalLink,
  ArrowUp,
  Star,
  Calendar,
  FileText,
  BookOpen,
  HelpCircle,
  Settings,
  Globe,
  Smartphone,
  Download,
  QrCode,
  Wifi
} from "lucide-react";
import { angolaFormatter } from "@/lib/locale-angola";
import { pwaManager } from "@/lib/pwa-utils";
import { GlassmorphismCard, FloatingElement, ScaleOnHover } from "@/components/premium/AnimatedComponents";

interface EnhancedFooterProps {
  variant?: "default" | "minimal" | "medical";
  className?: string;
}

export default function EnhancedFooter({
  variant = "default",
  className = "",
}: EnhancedFooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<"idle" | "success" | "error">("idle");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [businessStatus, setBusinessStatus] = useState("");

  // Business hours status
  useEffect(() => {
    const updateStatus = () => {
      setBusinessStatus(angolaFormatter.getBusinessStatus());
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newsletterEmail,
          source: 'footer',
          locale: 'pt-AO'
        })
      });

      if (response.ok) {
        setSubscriptionStatus("success");
        setNewsletterEmail("");
      } else {
        setSubscriptionStatus("error");
      }
    } catch (error) {
      setSubscriptionStatus("error");
    } finally {
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionStatus("idle"), 3000);
    }
  };

  const socialLinks = [
    { icon: Facebook, url: "https://facebook.com/clinicabemcuidar", label: "Facebook" },
    { icon: Instagram, url: "https://instagram.com/clinicabemcuidar", label: "Instagram" },
    { icon: Linkedin, url: "https://linkedin.com/company/clinica-bem-cuidar", label: "LinkedIn" },
    { icon: Youtube, url: "https://youtube.com/@clinicabemcuidar", label: "YouTube" },
    { icon: Twitter, url: "https://twitter.com/clinicabemcuidar", label: "Twitter" }
  ];

  const quickLinks = [
    { title: "Portal do Paciente", href: "/portal", icon: Users },
    { title: "Agendar Consulta", href: "/agendar", icon: Calendar },
    { title: "Especialidades", href: "#especialidades", icon: Stethoscope },
    { title: "Exames", href: "/exames", icon: FileText },
    { title: "Sobre Nós", href: "/sobre", icon: Heart },
    { title: "Blog de Saúde", href: "/blog", icon: BookOpen },
    { title: "FAQ", href: "/faq", icon: HelpCircle },
    { title: "Contacto", href: "/contato", icon: Mail }
  ];

  const legalLinks = [
    { title: "Política de Privacidade", href: "/privacidade" },
    { title: "Termos de Uso", href: "/termos" },
    { title: "Lei n.º 22/11 Compliance", href: "/compliance" },
    { title: "Código de Ética Médica", href: "/etica" },
    { title: "Direitos do Paciente", href: "/direitos" }
  ];

  const specialties = [
    "Cardiologia", "Pediatria", "Cirurgia Geral", "Dermatologia", 
    "Neurologia", "Ginecologia", "Ortopedia", "Urologia"
  ];

  if (variant === "minimal") {
    return (
      <footer className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 ${className}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <FloatingElement duration={4} intensity={5}>
                <div className="w-10 h-10 bg-clinic-gradient rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </FloatingElement>
              <div>
                <h3 className="font-bold text-lg">Clínica Bem Cuidar</h3>
                <p className="text-sm text-gray-300">Cuidar é Amar</p>
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-300">
              © {currentYear} Clínica Bem Cuidar, Lda. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <FloatingElement duration={4} intensity={8}>
                    <div className="w-14 h-14 bg-clinic-gradient rounded-2xl flex items-center justify-center shadow-xl">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                  </FloatingElement>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Clínica Bem Cuidar
                    </h3>
                    <p className="text-clinic-accent font-medium">Cuidar é Amar</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed">
                  Cuidamos da sua saúde com humanização, tecnologia de ponta e excelência médica. 
                  Mais de 15 anos ao serviço da comunidade angolana.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Licenciado
                  </Badge>
                  <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50 text-blue-300">
                    <Shield className="w-3 h-3 mr-1" />
                    ISO 9001
                  </Badge>
                  <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                    <Award className="w-3 h-3 mr-1" />
                    5 Estrelas
                  </Badge>
                </div>

                {/* Business Status */}
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    businessStatus === 'Aberto' ? 'bg-green-400' : 'bg-red-400'
                  } animate-pulse`} />
                  <span className="text-sm font-medium">{businessStatus}</span>
                  <Clock className="w-4 h-4 ml-auto text-gray-400" />
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-clinic-accent" />
                  Links Rápidos
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {quickLinks.map((link, index) => (
                    <ScaleOnHover key={index}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                      >
                        <link.icon className="w-4 h-4 text-clinic-accent group-hover:scale-110 transition-transform" />
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {link.title}
                        </span>
                      </Link>
                    </ScaleOnHover>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact & Hours */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-clinic-accent" />
                  Contacto & Horários
                </h4>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-5 h-5 text-clinic-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">Endereço</p>
                      <p className="text-sm text-gray-300">
                        Avenida 21 de Janeiro, Nº 351<br />
                        Benfica, Luanda, Angola
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <Phone className="w-5 h-5 text-clinic-accent" />
                    <div>
                      <p className="font-medium text-white">Telefone</p>
                      <p className="text-sm text-gray-300">
                        {angolaFormatter.formatPhone("+244945344650")}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                    <Mail className="w-5 h-5 text-clinic-accent" />
                    <div>
                      <p className="font-medium text-white">E-mail</p>
                      <p className="text-sm text-gray-300">recepcao@bemcuidar.co.ao</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="p-4 bg-gradient-to-r from-clinic-primary/20 to-clinic-secondary/20 rounded-lg border border-clinic-accent/30">
                    <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Horário de Funcionamento
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Segunda - Sexta:</span>
                        <span className="text-clinic-accent font-medium">07:00 - 19:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Sábado:</span>
                        <span className="text-clinic-accent font-medium">07:00 - 13:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Domingo:</span>
                        <span className="text-red-400">Fechado</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center gap-2 text-green-400">
                        <Shield className="w-3 h-3" />
                        <span className="text-xs">Atendimento de urgência 24h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Newsletter & App */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-6"
              >
                <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-clinic-accent" />
                  Newsletter & App
                </h4>

                {/* Newsletter Signup */}
                <div className="p-4 bg-gradient-to-br from-clinic-primary/20 to-clinic-secondary/20 rounded-xl border border-clinic-accent/30">
                  <h5 className="font-semibold text-white mb-3">Newsletter de Saúde</h5>
                  <p className="text-sm text-gray-300 mb-4">
                    Receba dicas de saúde e novidades da clínica
                  </p>
                  
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                    <Button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full bg-clinic-gradient hover:opacity-90"
                    >
                      {isSubscribing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Subscrevendo...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Subscrever
                        </>
                      )}
                    </Button>
                    
                    {subscriptionStatus === "success" && (
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Subscrito com sucesso!
                      </p>
                    )}
                    
                    {subscriptionStatus === "error" && (
                      <p className="text-red-400 text-sm">
                        Erro ao subscrever. Tente novamente.
                      </p>
                    )}
                  </form>
                </div>

                {/* PWA Download */}
                <GlassmorphismCard intensity="light" className="p-4 bg-white/5">
                  <h5 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    App Móvel
                  </h5>
                  <p className="text-sm text-gray-300 mb-4">
                    Instale nosso app para acesso rápido e offline
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => pwaManager.install()}
                      className="flex-1 border-white/30 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Instalar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <Wifi className="w-3 h-3" />
                    <span>Funciona offline</span>
                  </div>
                </GlassmorphismCard>

                {/* Social Media */}
                <div>
                  <h5 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Redes Sociais
                  </h5>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <ScaleOnHover key={index}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/10 hover:bg-clinic-gradient rounded-full flex items-center justify-center transition-all duration-300 group"
                          aria-label={social.label}
                        >
                          <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        </a>
                      </ScaleOnHover>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Specialties Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <h4 className="text-lg font-semibold mb-6 text-center">Especialidades Médicas</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {specialties.map((specialty, index) => (
                <ScaleOnHover key={index}>
                  <Link
                    to={`/especialidades/${specialty.toLowerCase()}`}
                    className="px-4 py-2 bg-white/10 hover:bg-clinic-gradient rounded-full text-sm transition-all duration-300 hover:text-white"
                  >
                    {specialty}
                  </Link>
                </ScaleOnHover>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="text-center lg:text-left">
                <p className="text-gray-300 text-sm">
                  © {currentYear} Clínica Bem Cuidar, Lda. Todos os direitos reservados.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  NIF: 5000XXXXXX | Licença Médica: OM-AO-XXXX
                </p>
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                {legalLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="text-gray-400 hover:text-clinic-accent transition-colors flex items-center gap-1"
                  >
                    {link.title}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>

              {/* Developer Credit */}
              <div className="text-center lg:text-right">
                <p className="text-xs text-gray-400">
                  Desenvolvido por{" "}
                  <a
                    href="https://bestservices.ao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-clinic-accent hover:text-white font-medium transition-colors"
                  >
                    Kaijhe Morose
                  </a>
                </p>
                <div className="flex items-center justify-center lg:justify-end gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-400">Best Services AO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-clinic-gradient rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-5 h-5 text-white group-hover:animate-bounce" />
        </motion.button>
      )}
    </footer>
  );
}
