import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Send,
  Calendar,
  FileText,
  BookOpen,
  HelpCircle,
  Settings,
  Users,
  ExternalLink,
  ArrowUp
} from "lucide-react";
import { GlassmorphismCard, ScaleOnHover } from "@/components/premium/AnimatedComponents";

interface SimplifiedFooterProps {
  className?: string;
}

export default function SimplifiedFooter({
  className = "",
}: SimplifiedFooterProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [businessStatus, setBusinessStatus] = useState<'Aberto' | 'Fechado'>('Fechado');

  // Check business hours
  useEffect(() => {
    const checkBusinessHours = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Monday to Friday: 7:00 - 18:00, Saturday: 8:00 - 14:00, Sunday: Closed
      if (day === 0) { // Sunday
        setBusinessStatus('Fechado');
      } else if (day === 6) { // Saturday
        setBusinessStatus((hour >= 8 && hour < 14) ? 'Aberto' : 'Fechado');
      } else { // Monday to Friday
        setBusinessStatus((hour >= 7 && hour < 18) ? 'Aberto' : 'Fechado');
      }
    };

    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Newsletter subscription
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setEmail("");
      // Show success toast would go here
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { title: "Sobre Nós", href: "/equipe", icon: Users },
    { title: "Especialidades", href: "/#especialidades", icon: FileText },
    { title: "Exames", href: "/exames", icon: Calendar },
    { title: "Blog", href: "/blog", icon: BookOpen },
    { title: "FAQ", href: "/faq", icon: HelpCircle },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/clinicabemcuidar", color: "hover:text-blue-500" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/clinicabemcuidar", color: "hover:text-pink-500" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/clinicabemcuidar", color: "hover:text-blue-700" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@clinicabemcuidar", color: "hover:text-red-500" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/clinicabemcuidar", color: "hover:text-blue-400" },
  ];

  return (
    <footer className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-clinic-primary/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-clinic-secondary/20 via-transparent to-transparent" />
      
      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Contact & Hours */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
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
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <Phone className="w-5 h-5 text-clinic-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">Telefones</p>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>+244 222 123 456</p>
                      <p>+244 923 456 789</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-clinic-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-white">E-mail</p>
                    <p className="text-sm text-gray-300">info@clinicabemcuidar.ao</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-clinic-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-white">Horários</p>
                      <div className={`w-2 h-2 rounded-full ${
                        businessStatus === 'Aberto' ? 'bg-green-400' : 'bg-red-400'
                      } animate-pulse`} />
                      <span className="text-xs font-medium">{businessStatus}</span>
                    </div>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>Seg - Sex: 07:00 - 18:00</p>
                      <p>Sábado: 08:00 - 14:00</p>
                      <p>Domingo: Fechado</p>
                    </div>
                  </div>
                </div>
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
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <link.icon className="w-4 h-4 text-clinic-accent group-hover:scale-110 transition-transform" />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {link.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </ScaleOnHover>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-clinic-accent" />
                Newsletter
              </h4>

              <GlassmorphismCard intensity="light" className="p-6 bg-white/5">
                <p className="text-gray-300 mb-4">
                  Receba dicas de saúde, novidades e promoções exclusivas da nossa clínica.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-clinic-accent"
                    required
                  />
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-clinic-gradient hover:shadow-lg transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Subscrever
                      </>
                    )}
                  </Button>
                </form>
              </GlassmorphismCard>

              {/* Social Media */}
              <div>
                <h5 className="font-semibold mb-4">Siga-nos</h5>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <ScaleOnHover key={index}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${social.color} hover:bg-white/20`}
                        aria-label={social.name}
                      >
                        <social.icon className="w-4 h-4" />
                      </a>
                    </ScaleOnHover>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Bottom */}
        <Separator className="my-8 bg-white/20" />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div className="text-center sm:text-left">
            <p className="text-gray-300 text-sm">
              © {currentYear} Clínica Bem Cuidar, Lda. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Licenciado pelo Ministério da Saúde de Angola
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/politica-privacidade" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Política de Privacidade
            </Link>
            <span className="text-gray-600">•</span>
            <Link 
              to="/termos" 
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Termos de Uso
            </Link>
            
            {/* Back to Top */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="border-white/30 text-white hover:bg-white/10 ml-4"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
