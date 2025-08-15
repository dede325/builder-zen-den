import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import InteractiveGallery from "@/components/InteractiveGallery";
import {
  Menu,
  X,
  Camera,
  Building2,
  Users,
  Stethoscope,
} from "lucide-react";

export default function Galeria() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">
                  Clínica Bem Cuidar
                </h1>
                <p className="text-xs text-muted-foreground">Cuidar é Amar</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors"
              >
                Início
              </Link>
              <Link
                to="/galeria"
                className="text-primary font-medium transition-colors"
              >
                Galeria
              </Link>
              <Link
                to="/equipe"
                className="text-foreground hover:text-primary transition-colors"
              >
                Equipe Médica
              </Link>
              <Link
                to="/exames"
                className="text-foreground hover:text-primary transition-colors"
              >
                Exames
              </Link>
              <Link
                to="/sobre"
                className="text-foreground hover:text-primary transition-colors"
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="text-foreground hover:text-primary transition-colors"
              >
                Contato
              </Link>
              <Link
                to="/portal"
                className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Portal do Paciente
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  to="/galeria"
                  className="text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galeria
                </Link>
                <Link
                  to="/equipe"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipe Médica
                </Link>
                <Link
                  to="/exames"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Exames
                </Link>
                <Link
                  to="/sobre"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  to="/contato"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </Link>
                <Link
                  to="/portal"
                  className="bg-clinic-gradient text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portal do Paciente
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-clinic-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Camera className="w-12 h-12 text-clinic-primary mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Nossa <span className="text-clinic-primary">Galeria</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conheça nossas instalações modernas, equipamentos de última geração
              e ambientes preparados para oferecer o melhor cuidado médico.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Features */}
      <section className="py-16 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instalações Modernas</h3>
              <p className="text-muted-foreground">
                Ambientes projetados para conforto e funcionalidade
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipamentos Avançados</h3>
              <p className="text-muted-foreground">
                Tecnologia de ponta para diagnósticos precisos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ambientes Acolhedores</h3>
              <p className="text-muted-foreground">
                Espaços pensados para seu bem-estar e tranquilidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Gallery */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Explore Nossas Instalações
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navegue por nossa galeria interativa e descubra todos os ambientes
              e equipamentos que tornam a Clínica Bem Cuidar um centro de
              excelência médica.
            </p>
          </div>
          
          <InteractiveGallery />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Venha nos conhecer pessoalmente
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Gostaria de uma visita guiada? Entre em contato conosco e agende
            uma visita para conhecer nossas instalações e equipe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-clinic-gradient hover:opacity-90" asChild>
              <Link to="/contato">
                <Building2 className="w-5 h-5 mr-2" />
                Agendar Visita
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/equipe">
                <Users className="w-5 h-5 mr-2" />
                Conhecer Equipe
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
