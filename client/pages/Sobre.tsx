import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Heart, 
  Users, 
  Award, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Star,
  Building,
  Stethoscope
} from 'lucide-react';

export default function Sobre() {
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
                <p className="text-xs text-muted-foreground">Cuidar é Amar</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
              <Link to="/portal">
                <Button className="bg-clinic-gradient text-white hover:opacity-90">
                  Portal do Paciente
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-clinic-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Sobre a Clínica <span className="text-clinic-accent">Bem Cuidar</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Há mais de uma década dedicados ao cuidado da sua saúde com humanização, 
              tecnologia e excelência médica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-clinic-gradient hover:opacity-90 text-white">
                <Heart className="w-5 h-5 mr-2" />
                Nossa Missão
              </Button>
              <Button variant="outline" size="lg">
                <Users className="w-5 h-5 mr-2" />
                Conheça Nossa Equipe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Nossa Missão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Promover saúde e bem-estar através de atendimento médico humanizado, 
                    utilizando tecnologia de ponta e profissionais altamente qualificados, 
                    sempre priorizando o conforto e a confiança dos nossos pacientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Nossa Visão</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser reconhecida como referência em excelência médica em Angola, 
                    destacando-nos pela inovação, qualidade dos serviços e pelo 
                    cuidado humanizado que transforma vidas.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Nossos Valores</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Humanização, ética, excelência, inovação, respeito, 
                    comprometimento e responsabilidade social. Valores que 
                    norteiam cada atendimento e cada decisão em nossa clínica.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Nossa História</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    A Clínica Bem Cuidar nasceu em 2010 com o sonho de oferecer 
                    atendimento médico de qualidade internacional em Angola. 
                    Fundada por um grupo de médicos especializados, nossa clínica 
                    começou com apenas 3 especialidades e hoje conta com mais de 
                    12 áreas médicas.
                  </p>
                  <p className="leading-relaxed">
                    Ao longo dos anos, investimos continuamente em tecnologia, 
                    capacitação da equipe e infraestrutura, sempre mantendo nosso 
                    compromisso com o atendimento humanizado e personalizado.
                  </p>
                  <p className="leading-relaxed">
                    Hoje, somos orgulhosos de ter atendido mais de 50.000 pacientes, 
                    realizado milhares de procedimentos e contribuído significativamente 
                    para a melhoria da saúde da comunidade angolana.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-clinic-accent mb-2">15+</div>
                    <p className="text-sm text-muted-foreground">Anos de Experiência</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-clinic-accent mb-2">50k+</div>
                    <p className="text-sm text-muted-foreground">Pacientes Atendidos</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-clinic-accent mb-2">12</div>
                    <p className="text-sm text-muted-foreground">Especialidades</p>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-clinic-accent mb-2">98%</div>
                    <p className="text-sm text-muted-foreground">Satisfação</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nossas Instalações
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ambiente moderno, seguro e confortável para proporcionar a melhor experiência médica
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Building className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Consultórios Modernos</h3>
                  <p className="text-sm text-muted-foreground">
                    Ambientes climatizados e equipados com tecnologia de ponta
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Stethoscope className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Laboratório Próprio</h3>
                  <p className="text-sm text-muted-foreground">
                    Exames rápidos e precisos realizados em nossa estrutura
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Sala de Emergência</h3>
                  <p className="text-sm text-muted-foreground">
                    Atendimento de urgência 24 horas com equipe especializada
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <Heart className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Área de Repouso</h3>
                  <p className="text-sm text-muted-foreground">
                    Espaços confortáveis para recuperação pós-procedimentos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quality and Certifications */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Qualidade e Certificações
              </h2>
              <p className="text-muted-foreground">
                Comprometidos com os mais altos padrões de qualidade e segurança
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Nossos Compromissos</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Atendimento baseado em evidências científicas</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Protocolos de segurança rigorosos</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Educação médica continuada da equipe</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Equipamentos calibrados e certificados</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Reconhecimentos</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Certificação ISO 9001:2015</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Acreditação Hospitalar Nacional</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Prêmio Excelência em Atendimento 2023</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Selo de Responsabilidade Social</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-clinic-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para conhecer nossa clínica?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Venha nos visitar e conheça de perto nossa estrutura e equipe médica
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <MapPin className="w-5 h-5 mr-2" />
                Como Chegar
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-clinic-primary">
                <Phone className="w-5 h-5 mr-2" />
                (244) 945 344 650
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm opacity-80">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Av. 21 de Janeiro, 351, Benfica
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Seg-Sex: 07:00-19:00
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
                  <p className="text-gray-300">Cuidar é Amar</p>
                </div>
              </div>
              <p className="text-gray-300">
                Cuidamos da sua saúde com humanização, tecnologia e excelência médica.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <div className="space-y-2 text-gray-300">
                <p><MapPin className="w-4 h-4 inline mr-2" />Av. 21 de Janeiro, 351, Benfica</p>
                <p><Phone className="w-4 h-4 inline mr-2" />+244 945 344 650</p>
                <p><Mail className="w-4 h-4 inline mr-2" />recepcao@bemcuidar.co.ao</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link to="/portal" className="block text-gray-300 hover:text-white transition-colors">
                  Portal do Paciente
                </Link>
                <Link to="/especialidades" className="block text-gray-300 hover:text-white transition-colors">
                  Especialidades
                </Link>
                <Link to="/contato" className="block text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Clínica Bem Cuidar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
