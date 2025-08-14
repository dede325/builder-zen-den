import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowLeft, BarChart3, Users, MessageSquare, Settings, FileText, Calendar } from 'lucide-react';

export default function Admin() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">Painel Administrativo</h1>
                <p className="text-xs text-muted-foreground">Cuidar é Amar</p>
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
          <div className="w-24 h-24 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-8 p-4">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
              alt="Clínica Bem Cuidar Logo"
              className="w-full h-full object-contain filter brightness-0 invert"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Painel Administrativo em Desenvolvimento
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Sistema de gestão completo para administrar a clínica, pacientes, 
            consultas e conteúdo do site em desenvolvimento.
          </p>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <BarChart3 className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Dashboard</h3>
                <p className="text-sm text-muted-foreground">Estatísticas e relatórios</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Pacientes</h3>
                <p className="text-sm text-muted-foreground">Gestão de pacientes</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Consultas</h3>
                <p className="text-sm text-muted-foreground">Agendamentos e histórico</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Mensagens</h3>
                <p className="text-sm text-muted-foreground">Formulários de contato</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Conteúdo</h3>
                <p className="text-sm text-muted-foreground">Gestão do site</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Settings className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">Sistema e usuários</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-clinic-light/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Continue navegando pelo site
            </h3>
            <p className="text-muted-foreground mb-6">
              Explore a landing page e as funcionalidades já disponíveis
            </p>
            <Link to="/">
              <Button className="bg-clinic-gradient hover:opacity-90">
                <Heart className="w-5 h-5 mr-2" />
                Ir para o Site Principal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
