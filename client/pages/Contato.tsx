import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  X,
} from "lucide-react";

export default function Contato() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "consulta",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Formato de e-mail inválido";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telefone é obrigatório";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Formato de telefone inválido (mínimo 9 dígitos)";
    }

    if (!formData.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message:
            result.message ||
            "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "consulta",
          message: "",
        });
        setFormErrors({});

        toast({
          title: "Sucesso!",
          description:
            "Sua mensagem foi enviada. Entraremos em contato em breve.",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message || "Erro ao enviar mensagem. Tente novamente.",
        });

        if (result.errors) {
          setFormErrors(result.errors);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
                <h1 className="text-xl font-bold text-primary">
                  Clínica Bem Cuidar
                </h1>
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
              Entre em <span className="text-clinic-accent">Contato</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Estamos prontos para cuidar da sua saúde. Entre em contato conosco
              e agende sua consulta ou tire suas dúvidas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-clinic-gradient hover:opacity-90 text-white"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
              </Button>
              <Button variant="outline" size="lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Enviar Mensagem
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Localização</h3>
                  <p className="text-muted-foreground mb-4">
                    Avenida 21 de Janeiro, Nº 351
                    <br />
                    Benfica, Luanda
                    <br />
                    (próximo ao Talatona)
                    <br />
                    Angola
                  </p>
                  <Button variant="outline" size="sm">
                    Ver no Mapa
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Telefone</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>Recepção:</strong>
                    <br />
                    +244 945 344 650
                    <br />
                    <strong>WhatsApp:</strong>
                    <br />
                    +244 945 344 650
                  </p>
                  <Button variant="outline" size="sm">
                    Ligar Agora
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-clinic-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">E-mail</h3>
                  <p className="text-muted-foreground mb-4">
                    <strong>Recepção:</strong>
                    <br />
                    recepcao@bemcuidar.co.ao
                    <br />
                    <strong>Coordenação:</strong>
                    <br />
                    coordenacao@bemcuidar.co.ao
                  </p>
                  <Button variant="outline" size="sm">
                    Enviar E-mail
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="py-20 bg-clinic-light/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Horário de Funcionamento
              </h2>
              <p className="text-muted-foreground">
                Estamos abertos para cuidar da sua saúde
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-6 h-6 text-clinic-accent mr-2" />
                    Atendimento Regular
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Segunda a Sexta</span>
                    <span className="text-clinic-accent font-semibold">
                      07:00 - 19:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sábado</span>
                    <span className="text-clinic-accent font-semibold">
                      07:00 - 13:00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Domingo</span>
                    <span className="text-muted-foreground">Fechado</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-6 h-6 text-clinic-accent mr-2" />
                    Emergências
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">
                      Atendimento de Urgência
                    </h4>
                    <p className="text-red-700 text-sm">
                      24 horas por dia, 7 dias por semana
                    </p>
                    <p className="text-red-700 text-sm mt-2">
                      <strong>Telefone de Emergência:</strong>
                      <br />
                      +244 945 344 650
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Envie sua Mensagem
              </h2>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo e entraremos em contato em breve
              </p>
            </div>

            <Card>
              <CardContent className="p-8">
                {/* Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      submitStatus.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center">
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <X className="w-5 h-5 mr-2" />
                      )}
                      {submitStatus.message}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={formErrors.name ? "border-red-500" : ""}
                        disabled={isSubmitting}
                        placeholder="Seu nome completo"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={formErrors.email ? "border-red-500" : ""}
                        disabled={isSubmitting}
                        placeholder="seu@email.com"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={formErrors.phone ? "border-red-500" : ""}
                        disabled={isSubmitting}
                        placeholder="+244 XXX XXX XXX"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject">Assunto *</Label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        className="w-full p-2 border border-input rounded-md bg-background disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <option value="consulta">Consulta</option>
                        <option value="exame">Exame</option>
                        <option value="duvida">Dúvida</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="reclamacao">Reclamação</option>
                      </select>
                      {formErrors.subject && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      rows={6}
                      className={formErrors.message ? "border-red-500" : ""}
                      disabled={isSubmitting}
                      placeholder="Descreva sua dúvida, necessidade ou como podemos ajudá-lo..."
                    />
                    {formErrors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-clinic-gradient hover:opacity-90 disabled:opacity-50"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    * Campos obrigatórios | Responderemos em até 24 horas
                  </p>
                </form>
              </CardContent>
            </Card>
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
                Cuidamos da sua saúde com humanização, tecnologia e excelência
                médica.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <div className="space-y-2 text-gray-300">
                <p>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Av. 21 de Janeiro, 351, Benfica
                </p>
                <p>
                  <Phone className="w-4 h-4 inline mr-2" />
                  +244 945 344 650
                </p>
                <p>
                  <Mail className="w-4 h-4 inline mr-2" />
                  recepcao@bemcuidar.co.ao
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <div className="space-y-2">
                <Link
                  to="/portal"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Portal do Paciente
                </Link>
                <Link
                  to="/sobre"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Sobre a Clínica
                </Link>
                <Link
                  to="/exames"
                  className="block text-gray-300 hover:text-white transition-colors"
                >
                  Exames
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
