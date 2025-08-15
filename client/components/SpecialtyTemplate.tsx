import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle,
  Users,
  Award,
  Stethoscope
} from 'lucide-react';

interface Doctor {
  name: string;
  credentials: string;
  experience: string;
  specialization?: string;
}

interface Procedure {
  name: string;
  description: string;
  duration?: string;
  preparation?: string;
}

interface SpecialtyInfo {
  name: string;
  description: string;
  icon: any;
  fullDescription: string;
  benefits: string[];
  doctors: Doctor[];
  procedures: Procedure[];
  commonConditions: string[];
  preventiveCare?: string[];
}

interface SpecialtyTemplateProps {
  specialty: SpecialtyInfo;
}

export default function SpecialtyTemplate({ specialty }: SpecialtyTemplateProps) {
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
            <div className="w-20 h-20 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <specialty.icon className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {specialty.name}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              {specialty.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-clinic-gradient hover:opacity-90 text-white">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button variant="outline" size="lg">
                <Phone className="w-5 h-5 mr-2" />
                Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Specialty */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Sobre {specialty.name}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {specialty.fullDescription}
              </p>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-clinic-accent mr-2" />
                    Benefícios do Tratamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {specialty.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-clinic-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-6 h-6 text-clinic-accent mr-2" />
                    Condições Tratadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {specialty.commonConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="mb-2">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Team */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nossa Equipe Médica
              </h2>
              <p className="text-muted-foreground">
                Profissionais especializados e experientes em {specialty.name}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialty.doctors.map((doctor, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-20 h-20 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                    <p className="text-clinic-accent font-medium mb-2">{doctor.credentials}</p>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.experience}</p>
                    {doctor.specialization && (
                      <p className="text-xs text-muted-foreground">{doctor.specialization}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Procedimentos e Exames
              </h2>
              <p className="text-muted-foreground">
                Principais procedimentos realizados em nossa clínica
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {specialty.procedures.map((procedure, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{procedure.name}</CardTitle>
                    {procedure.duration && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {procedure.duration}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{procedure.description}</p>
                    {procedure.preparation && (
                      <div className="bg-clinic-light/50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Preparação:</h4>
                        <p className="text-sm text-muted-foreground">{procedure.preparation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preventive Care */}
      {specialty.preventiveCare && (
        <section className="py-20 bg-clinic-light/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Cuidados Preventivos
                </h2>
                <p className="text-muted-foreground">
                  Recomendações para manter sua saúde em dia
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {specialty.preventiveCare.map((care, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-clinic-accent mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">{care}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-clinic-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para cuidar da sua saúde?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Agende sua consulta em {specialty.name} e tenha o melhor atendimento médico
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
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
                <p><Clock className="w-4 h-4 inline mr-2" />recepcao@bemcuidar.co.ao</p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link to="/portal" className="block text-gray-300 hover:text-white transition-colors">
                  Portal do Paciente
                </Link>
                <Link to="/sobre" className="block text-gray-300 hover:text-white transition-colors">
                  Sobre a Clínica
                </Link>
                <Link to="/contato" className="block text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>
              &copy; 2024 Clínica Bem Cuidar. Desenvolvido por{' '}
              <a
                href="https://bestservices.ao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-100 font-semibold underline transition-colors"
              >
                Kaijhe
              </a>
              {' '}- Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
