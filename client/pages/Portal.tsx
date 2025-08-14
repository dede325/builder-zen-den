import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ArrowLeft, Calendar, FileText, User, Settings } from 'lucide-react';

export default function Portal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-clinic-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Portal do Paciente</h1>
                <p className="text-xs text-muted-foreground">Clínica Bem Cuidar</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Portal do Paciente em Desenvolvimento
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Estamos trabalhando para trazer a você uma experiência digital completa. 
            Em breve você poderá acessar suas consultas, exames e muito mais!
          </p>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Consultas</h3>
                <p className="text-sm text-muted-foreground">Agende e gerencie suas consultas</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Exames</h3>
                <p className="text-sm text-muted-foreground">Acesse resultados e histórico</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Perfil</h3>
                <p className="text-sm text-muted-foreground">Mantenha seus dados atualizados</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Settings className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">Personalize sua experiência</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-clinic-light/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Enquanto isso, entre em contato conosco
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está disponível para agendamentos e informações
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-clinic-gradient hover:opacity-90">
                <Calendar className="w-5 h-5 mr-2" />
                Agendar por Telefone
              </Button>
              <Link to="/#contato">
                <Button variant="outline">
                  Formulário de Contato
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
