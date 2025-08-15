import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Menu,
  X,
  Heart,
  Calendar,
  Phone,
  Globe,
  ChevronDown,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
  badge?: string;
}

const navigation: NavigationItem[] = [
  { name: "Início", href: "#inicio" },
  {
    name: "Especialidades",
    href: "#especialidades",
    description: "Conheça os nossos especialistas",
  },
  {
    name: "Exames",
    href: "/exames",
    description: "Exames complementares de diagnóstico",
  },
  {
    name: "Equipa",
    href: "/equipa",
    description: "Profissionais qualificados",
  },
  {
    name: "Contacto",
    href: "#contacto",
    description: "Entre em contacto connosco",
  },
];

interface GlassHeaderProps {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export default function GlassHeader({
  isSearchOpen,
  setIsSearchOpen,
}: GlassHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPWAInstallable, setIsPWAInstallable] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setIsPWAInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const headerVariants = {
    top: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    scrolled: {
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(121, 203, 203, 0.2)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const installPWA = async () => {
    if ("serviceWorker" in navigator && "BeforeInstallPromptEvent" in window) {
      const event = (window as any).deferredPrompt;
      if (event) {
        event.prompt();
        const result = await event.userChoice;
        if (result.outcome === "accepted") {
          setIsPWAInstallable(false);
        }
      }
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300"
        initial="top"
        animate={scrolled ? "scrolled" : "top"}
        variants={headerVariants}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3 min-w-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-clinic-gradient rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-clinic-gradient rounded-xl opacity-30 blur animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-xl font-bold text-foreground truncate">
                    Clínica Bem Cuidar
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Cuidar é Amar • Angola
                  </p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  className="relative group"
                >
                  <Link
                    to={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-white/10 backdrop-blur-sm group-hover:shadow-lg"
                  >
                    {item.name}
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-2 text-xs bg-primary text-primary-foreground"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    <motion.div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary"
                      whileHover={{ width: "80%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>

                  {/* Tooltip */}
                  {item.description && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm">
                      {item.description}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-black/90" />
                    </div>
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-white/10 backdrop-blur-sm"
                  aria-label="Pesquisar"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Language Selector */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex items-center gap-1 px-3 py-2 hover:bg-white/10 backdrop-blur-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs">PT</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </motion.div>

              {/* Emergency Call */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 backdrop-blur-sm"
                >
                  <a href="tel:+244945344650">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs">Urgência</span>
                  </a>
                </Button>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="clinic"
                  size="sm"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Link to="#contacto">
                    <Calendar className="w-4 h-4" />
                    Agendar
                  </Link>
                </Button>
              </motion.div>

              {/* PWA Install Button */}
              {isPWAInstallable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={installPWA}
                    className="hidden lg:flex items-center gap-2 px-3 py-2 border-primary/20 hover:bg-primary/10 backdrop-blur-sm"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">Instalar App</span>
                  </Button>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                >
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="w-5 h-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.nav
                initial="closed"
                animate="open"
                exit="closed"
                variants={mobileMenuVariants}
                className="lg:hidden border-t border-white/10 backdrop-blur-xl bg-white/5 overflow-hidden"
              >
                <div className="py-4 space-y-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className="flex items-center justify-between px-4 py-3 text-foreground hover:bg-white/10 transition-colors rounded-lg mx-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="bg-primary text-primary-foreground"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </motion.div>
                  ))}

                  {/* Mobile Actions */}
                  <div className="px-2 pt-4 space-y-2">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start gap-2 bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      <a href="tel:+244945344650">
                        <Phone className="w-4 h-4" />
                        Chamada de Urgência
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="clinic"
                      className="w-full justify-center gap-2 shadow-lg"
                    >
                      <Link to="#contacto" onClick={() => setIsMenuOpen(false)}>
                        <Calendar className="w-4 h-4" />
                        Agendar Consulta
                      </Link>
                    </Button>

                    {isPWAInstallable && (
                      <Button
                        variant="secondary"
                        onClick={installPWA}
                        className="w-full justify-center gap-2 bg-primary/10 text-primary border-primary/20"
                      >
                        <Heart className="w-4 h-4" />
                        Instalar Aplicação
                      </Button>
                    )}
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
