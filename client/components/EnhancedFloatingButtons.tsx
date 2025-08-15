import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageCircle,
  Calendar,
  ArrowUp,
  Heart,
  Stethoscope,
  Clock,
  MapPin,
  Mail,
  Headphones,
  Download,
  Share2,
  Star,
  Menu,
  X,
  Wifi,
  WifiOff,
} from "lucide-react";
import { angolaFormatter } from "@/lib/locale-angola";
import { pwaManager } from "@/lib/pwa-utils";
import {
  GlassmorphismCard,
  ScaleOnHover,
  FloatingElement,
} from "@/components/premium/AnimatedComponents";

interface FloatingAction {
  id: string;
  icon: React.ElementType;
  label: string;
  action: () => void;
  color: string;
  badge?: string;
  urgent?: boolean;
}

export default function EnhancedFloatingButtons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [businessStatus, setBusinessStatus] = useState("");
  const [isBusinessOpen, setIsBusinessOpen] = useState(false);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Monitor online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Monitor business hours
  useEffect(() => {
    const updateBusinessStatus = () => {
      const status = angolaFormatter.getBusinessStatus();
      setBusinessStatus(status);
      setIsBusinessOpen(status === "Aberto");
    };

    updateBusinessStatus();
    const interval = setInterval(updateBusinessStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const makePhoneCall = () => {
    window.open("tel:+244945344650", "_self");
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de agendar uma consulta na Clínica Bem Cuidar.",
    );
    window.open(`https://wa.me/244945344650?text=${message}`, "_blank");
  };

  const scheduleAppointment = () => {
    window.location.href = "/contato#agendamento";
  };

  const openPortal = () => {
    window.location.href = "/portal";
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Clínica Bem Cuidar",
          text: "Cuidados de saúde premium em Luanda, Angola",
          url: window.location.origin,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      // Could show a toast notification here
    }
  };

  const installPWA = () => {
    pwaManager.install();
  };

  const emergencyCall = () => {
    const confirmCall = window.confirm(
      "Ligar para o número de emergência? Esta é uma situação de urgência médica?",
    );
    if (confirmCall) {
      window.open("tel:112", "_self");
    }
  };

  const floatingActions: FloatingAction[] = [
    {
      id: "call",
      icon: Phone,
      label: "Ligar Agora",
      action: makePhoneCall,
      color: "bg-green-500",
      urgent: !isBusinessOpen,
    },
    {
      id: "whatsapp",
      icon: MessageCircle,
      label: "WhatsApp",
      action: openWhatsApp,
      color: "bg-green-600",
    },
    {
      id: "appointment",
      icon: Calendar,
      label: "Agendar",
      action: scheduleAppointment,
      color: "bg-clinic-gradient",
      badge: "Rápido",
    },
    {
      id: "portal",
      icon: Stethoscope,
      label: "Portal",
      action: openPortal,
      color: "bg-blue-500",
    },
    {
      id: "emergency",
      icon: Heart,
      label: "Emergência",
      action: emergencyCall,
      color: "bg-red-500",
      urgent: true,
    },
    {
      id: "share",
      icon: Share2,
      label: "Partilhar",
      action: shareApp,
      color: "bg-purple-500",
    },
  ];

  // Add PWA install button if available
  const pwaStatus = pwaManager.getInstallationStatus();
  if (pwaStatus.canInstall) {
    floatingActions.push({
      id: "install",
      icon: Download,
      label: "Instalar App",
      action: installPWA,
      color: "bg-indigo-500",
      badge: "PWA",
    });
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="mb-4"
          >
            <ScaleOnHover>
              <Button
                onClick={scrollToTop}
                className="w-12 h-12 rounded-full bg-gray-800/90 hover:bg-gray-700 text-white shadow-xl backdrop-blur-md border border-white/20"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </ScaleOnHover>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Menu */}
      <div className="relative">
        {/* Connection Status Indicator */}
        <div className="absolute -top-2 -left-2 z-10">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-4 h-4 rounded-full ${
              isOnline ? "bg-green-400" : "bg-red-400"
            } shadow-lg`}
          />
        </div>

        {/* Business Status Badge */}
        {!isBusinessOpen && (
          <div className="absolute -top-3 left-8 z-10">
            <Badge
              variant="destructive"
              className="text-xs px-2 py-1 bg-red-500/90 backdrop-blur-sm"
            >
              Fechado
            </Badge>
          </div>
        )}

        {/* Action Items */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-16 right-0 space-y-3"
            >
              {floatingActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <ScaleOnHover>
                    <GlassmorphismCard
                      intensity="medium"
                      className="flex items-center gap-3 p-3 bg-white/95 hover:bg-white shadow-xl border-white/50"
                    >
                      <Button
                        onClick={action.action}
                        className={`w-12 h-12 rounded-full ${action.color} hover:opacity-90 shadow-lg flex-shrink-0 ${
                          action.urgent ? "animate-pulse" : ""
                        }`}
                        aria-label={action.label}
                      >
                        <action.icon className="w-5 h-5 text-white" />
                      </Button>

                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-800 truncate">
                          {action.label}
                        </span>
                        {action.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs w-fit mt-1"
                          >
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                    </GlassmorphismCard>
                  </ScaleOnHover>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <ScaleOnHover>
          <motion.div
            whileHover={{ rotate: isExpanded ? 45 : 0 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-16 h-16 rounded-full bg-clinic-gradient hover:opacity-90 shadow-2xl border-2 border-white/20"
              aria-label={isExpanded ? "Fechar menu" : "Abrir menu de ações"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isExpanded ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isExpanded ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Heart className="w-6 h-6 text-white" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>

            {/* Pulse Effect for Urgent Actions */}
            {(!isBusinessOpen || !isOnline) && (
              <div className="absolute inset-0 rounded-full bg-clinic-gradient animate-ping opacity-30" />
            )}

            {/* Action Count Badge */}
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                {floatingActions.length}
              </Badge>
            </div>
          </motion.div>
        </ScaleOnHover>

        {/* Business Hours Tooltip */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute bottom-0 right-20 mb-2"
          >
            <GlassmorphismCard
              intensity="light"
              className="p-3 bg-white/95 shadow-xl border-white/50 min-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-clinic-accent" />
                <span className="text-sm font-medium">{businessStatus}</span>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Seg-Sex:</span>
                  <span className="font-medium">07:00-19:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado:</span>
                  <span className="font-medium">07:00-13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <span className="text-red-500">Fechado</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Heart className="w-3 h-3" />
                  <span>Urgências 24h</span>
                </div>
              </div>
            </GlassmorphismCard>
          </motion.div>
        )}
      </div>

      {/* Quick Actions Bar (Emergency Situations) */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-4 right-4 z-40"
        >
          <GlassmorphismCard
            intensity="heavy"
            className="p-4 bg-red-50/95 border-red-200 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">
                  Sem conexão à internet
                </p>
                <p className="text-xs text-red-600">
                  Ligue directamente para emergências: 112
                </p>
              </div>
              <Button
                onClick={emergencyCall}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0"
              >
                <Phone className="w-4 h-4 mr-1" />
                112
              </Button>
            </div>
          </GlassmorphismCard>
        </motion.div>
      )}
    </div>
  );
}
