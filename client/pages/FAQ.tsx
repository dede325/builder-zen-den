import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import {
  Menu,
  X,
  HelpCircle,
  Clock,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Shield,
  Users,
  Stethoscope,
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const faqItems: FAQItem[] = [
    {
      id: "1",
      question: "Como posso agendar uma consulta?",
      answer:
        "Você pode agendar sua consulta de três formas: (1) Ligando para nosso telefone +244 945 344 650, (2) Enviando uma mensagem através do nosso formulário de contato no site, ou (3) Visitando nossa recepção no endereço Avenida 21 de Janeiro, Nº 351, Benfica, Luanda. Nossa equipe estará pronta para ajudá-lo a escolher o melhor horário e especialista para suas necessidades.",
      category: "agendamento",
    },
    {
      id: "2",
      question: "Quais são os horários de funcionamento?",
      answer:
        "Nossos horários de funcionamento são: Segunda a Sexta das 07:00 às 19:00, Sábados das 07:00 às 13:00, e Domingos fechados. Para atendimentos de urgência, oferecemos serviço 24 horas. Em feriados, nossos horários podem sofrer alterações, que são comunicadas antecipadamente em nosso site e redes sociais.",
      category: "geral",
    },
    {
      id: "3",
      question: "Quais planos de saúde são aceitos?",
      answer:
        "Aceitamos os principais planos de saúde de Angola, incluindo SAÚDE ANGOLA, MEDICLÍNICA, GLOBAL SAÚDE, SANITAS, e outros convênios corporativos. Também atendemos pacientes particulares. Recomendamos que verifique a cobertura do seu plano antes da consulta, ligando para nossa recepção ou diretamente para seu plano de saúde.",
      category: "pagamento",
    },
    {
      id: "4",
      question:
        "Preciso de encaminhamento médico para consultas especializadas?",
      answer:
        "Não é obrigatório ter encaminhamento médico para consultas especializadas em nossa clínica. No entanto, se você possuir um encaminhamento do seu médico de família ou clínico geral, isso pode ajudar o especialista a ter mais informações sobre seu histórico médico e necessidades específicas.",
      category: "consultas",
    },
    {
      id: "5",
      question: "Como posso cancelar ou reagendar uma consulta?",
      answer:
        "Para cancelar ou reagendar sua consulta, entre em contato conosco com pelo menos 24 horas de antecedência através do telefone +244 945 344 650 ou enviando um e-mail para recepcao@bemcuidar.co.ao. Isso nos permite oferecer o horário para outros pacientes e evita cobranças por não comparecimento.",
      category: "agendamento",
    },
    {
      id: "6",
      question: "Quais documentos devo levar na primeira consulta?",
      answer:
        "Para sua primeira consulta, traga: (1) Documento de identidade válido, (2) Cartão do plano de saúde (se aplicável), (3) Exames médicos recentes relacionados ao motivo da consulta, (4) Lista de medicamentos que está tomando atualmente, e (5) Histórico médico familiar relevante. Isso ajudará o médico a ter uma visão completa de sua saúde.",
      category: "consultas",
    },
    {
      id: "7",
      question: "Vocês fazem exames laboratoriais?",
      answer:
        "Sim! Temos um laboratório completo em nossas instalações que realiza uma ampla gama de exames, incluindo análises de sangue, urina, fezes, exames hormonais, marcadores tumorais, e muito mais. Os resultados ficam prontos em prazos que variam de acordo com o tipo de exame, geralmente entre 1 a 3 dias úteis.",
      category: "exames",
    },
    {
      id: "8",
      question: "Como posso acessar meus resultados de exames?",
      answer:
        "Você pode acessar seus resultados através do nosso Portal do Paciente online, disponível 24 horas por dia. Também fornecemos os resultados impressos na recepção ou enviamos por e-mail seguro, conforme sua preferência. Para acessar o portal, você receberá suas credenciais por e-mail após o primeiro atendimento.",
      category: "exames",
    },
    {
      id: "9",
      question: "Vocês atendem emergências médicas?",
      answer:
        "Sim, oferecemos atendimento de urgência 24 horas para situações que requerem cuidados médicos imediatos. Nossa equipe de plantão está preparada para atender emergências clínicas e estabilizar pacientes que necessitem de cuidados especializados. Para emergências graves, também temos protocolo de transferência para hospitais de referência quando necessário.",
      category: "urgencia",
    },
    {
      id: "10",
      question: "Qual é a política de privacidade e confidencialidade?",
      answer:
        "Seguimos rigorosamente todas as normas de confidencialidade médica. Suas informações pessoais e médicas são mantidas em sigilo absoluto e só são compartilhadas com profissionais envolvidos em seu tratamento ou com sua autorização expressa. Utilizamos sistemas seguros para armazenamento de dados e seguimos todas as regulamentações de proteção de dados aplicáveis.",
      category: "privacidade",
    },
    {
      id: "11",
      question: "Posso trazer um acompanhante para a consulta?",
      answer:
        "Sim, você pode trazer um acompanhante para sua consulta, especialmente em casos de pacientes idosos, crianças, ou quando se sentir mais confortável com apoio. Pedimos apenas que informe na recepção para que possamos acomodar adequadamente. Para consultas de especialidades específicas, o médico pode solicitar privacidade em determinados momentos do exame.",
      category: "consultas",
    },
    {
      id: "12",
      question: "Vocês oferecem teleconsulta?",
      answer:
        "Sim, oferecemos serviços de teleconsulta para consultas de retorno, acompanhamento de tratamentos crônicos, orientações médicas, e algumas consultas iniciais específicas. A teleconsulta deve ser agendada previamente e requer que você tenha um dispositivo com câmera e internet estável. Algumas situações ainda requerem atendimento presencial.",
      category: "tecnologia",
    },
    {
      id: "13",
      question: "Como funciona o pagamento particular?",
      answer:
        "Para pacientes particulares, aceitamos pagamento em dinheiro, cartões de débito/crédito, e transferências bancárias. Os valores das consultas e exames estão disponíveis em nossa recepção ou podem ser consultados por telefone. Oferecemos também a possibilidade de parcelamento para procedimentos de maior valor, sujeito à análise.",
      category: "pagamento",
    },
    {
      id: "14",
      question: "Posso solicitar segunda opinião médica?",
      answer:
        "Absolutamente! Incentivamos nossos pacientes a buscar segunda opinião quando sentirem necessidade, especialmente para casos complexos ou tratamentos de longo prazo. Fornecemos todos os exames e relatórios necessários para que você possa consultar outro profissional. Nossa equipe está sempre disponível para esclarecer dúvidas sobre diagnósticos e tratamentos.",
      category: "consultas",
    },
    {
      id: "15",
      question: "Vocês fazem cirurgias?",
      answer:
        "Sim, realizamos diversos tipos de cirurgias em nosso centro cirúrgico, incluindo cirurgias gerais, procedimentos dermatológicos, pequenas cirurgias ambulatoriais, e cirurgias especializadas. Nosso centro cirúrgico possui equipamentos modernos e seguimos todos os protocolos de segurança. Para cirurgias de maior complexidade, temos parcerias com hospitais de referência.",
      category: "cirurgia",
    },
  ];

  const categories = [
    { id: "all", name: "Todas as Perguntas", icon: HelpCircle },
    { id: "agendamento", name: "Agendamento", icon: Calendar },
    { id: "consultas", name: "Consultas", icon: Stethoscope },
    { id: "exames", name: "Exames", icon: FileText },
    { id: "pagamento", name: "Pagamento", icon: CreditCard },
    { id: "urgencia", name: "Urgência", icon: Clock },
    { id: "geral", name: "Informações Gerais", icon: Users },
    { id: "privacidade", name: "Privacidade", icon: Shield },
  ];

  const filteredFAQs =
    selectedCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === selectedCategory);

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
                to="/faq"
                className="text-primary font-medium transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/galeria"
                className="text-foreground hover:text-primary transition-colors"
              >
                Galeria
              </Link>
              <Link
                to="/equipe"
                className="text-foreground hover:text-primary transition-colors"
              >
                Equipe
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
                  to="/faq"
                  className="text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link
                  to="/galeria"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Galeria
                </Link>
                <Link
                  to="/equipe"
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Equipe
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
              <HelpCircle className="w-12 h-12 text-clinic-primary mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Perguntas{" "}
                <span className="text-clinic-primary">Frequentes</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Encontre respostas para as dúvidas mais comuns sobre nossos
              serviços, procedimentos e políticas da Clínica Bem Cuidar.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Phone className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Telefone</h3>
                <p className="text-muted-foreground">+244 945 344 650</p>
                <p className="text-sm text-muted-foreground">
                  Seg-Sex: 07:00-19:00
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Mail className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">E-mail</h3>
                <p className="text-muted-foreground">
                  recepcao@bemcuidar.co.ao
                </p>
                <p className="text-sm text-muted-foreground">Resposta em 24h</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <MapPin className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Localização</h3>
                <p className="text-muted-foreground">Av. 21 de Janeiro, 351</p>
                <p className="text-sm text-muted-foreground">Benfica, Luanda</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.id ? "bg-clinic-gradient" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-white border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:text-clinic-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Nossa equipe está sempre disponível para esclarecer suas dúvidas e
            ajudá-lo com qualquer informação adicional que precisar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-clinic-gradient hover:opacity-90"
              asChild
            >
              <Link to="/contato">
                <Mail className="w-5 h-5 mr-2" />
                Entre em Contato
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="tel:+244945344650">
                <Phone className="w-5 h-5 mr-2" />
                Ligar Agora
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
