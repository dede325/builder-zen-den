import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Phone,
  Mail,
  User,
  MapPin,
  Shield,
  Wifi,
  WifiOff,
  Send,
  Save,
} from "lucide-react";
import {
  angolaFormatter,
  ANGOLA_PROVINCES,
  MAJOR_MUNICIPALITIES,
  FormLabels,
} from "@/lib/locale-angola";
import { pwaManager } from "@/lib/pwa-utils";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  province: string;
  municipality: string;
  subject: string;
  specialty: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  dataConsent: boolean;
  marketingConsent: boolean;
  emergencyContact?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface SubmitStatus {
  type: "success" | "error" | "offline" | null;
  message: string;
}

const SPECIALTIES = [
  "Cardiologia",
  "Pediatria",
  "Cirurgia Geral",
  "Dermatologia",
  "Neurologia",
  "Ginecologia-Obstetrícia",
  "Ortopedia",
  "Otorrinolaringologia",
  "Urologia",
  "Endocrinologia",
  "Gastroenterologia",
  "Medicina do Trabalho",
  "Consulta Geral",
];

const CONTACT_SUBJECTS = [
  { value: "consulta", label: "Marcação de Consulta" },
  { value: "informacao", label: "Pedido de Informação" },
  { value: "segunda_opiniao", label: "Segunda Opinião Médica" },
  { value: "exame", label: "Marcação de Exame" },
  { value: "receita", label: "Renovação de Receita" },
  { value: "urgencia", label: "Situação de Urgência" },
  { value: "seguro", label: "Questões de Seguro" },
  { value: "reclamacao", label: "Reclamação" },
  { value: "sugestao", label: "Sugestão" },
  { value: "outro", label: "Outro Assunto" },
];

export default function ContactFormAngola() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    province: "",
    municipality: "",
    subject: "consulta",
    specialty: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    dataConsent: false,
    marketingConsent: false,
    emergencyContact: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [availableMunicipalities, setAvailableMunicipalities] = useState<
    string[]
  >([]);
  const [businessStatus, setBusinessStatus] = useState("");

  // Update online status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Update business status
  useEffect(() => {
    const updateBusinessStatus = () => {
      setBusinessStatus(angolaFormatter.getBusinessStatus());
    };

    updateBusinessStatus();
    const interval = setInterval(updateBusinessStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update municipalities when province changes
  useEffect(() => {
    if (formData.province && MAJOR_MUNICIPALITIES[formData.province]) {
      setAvailableMunicipalities(MAJOR_MUNICIPALITIES[formData.province]);
    } else {
      setAvailableMunicipalities([]);
    }

    // Clear municipality if not available in new province
    if (formData.municipality && formData.province) {
      const isValidMunicipality = MAJOR_MUNICIPALITIES[
        formData.province
      ]?.includes(formData.municipality);
      if (!isValidMunicipality) {
        setFormData((prev) => ({ ...prev, municipality: "" }));
      }
    }
  }, [formData.province, formData.municipality]);

  // Generate time slots for appointments
  const generateTimeSlots = () => {
    const slots = angolaFormatter.generateTimeSlots(7, 19, 30);
    return slots.map((slot) => ({
      value: slot,
      label: `${slot}h`,
    }));
  };

  // Validation functions
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "E-mail é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Formato de e-mail inválido";
    }

    // Phone validation (Angola format)
    if (!formData.phone.trim()) {
      errors.phone = "Telefone é obrigatório";
    } else if (!angolaFormatter.isValidAngolaPhone(formData.phone)) {
      errors.phone =
        "Formato de telefone inválido para Angola (+244 XXX XXX XXX)";
    }

    // Province validation
    if (!formData.province) {
      errors.province = "Província é obrigatória";
    }

    // Municipality validation
    if (!formData.municipality) {
      errors.municipality = "Município é obrigatório";
    }

    // Message validation
    if (!formData.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    // Data consent validation (required by Lei n.º 22/11)
    if (!formData.dataConsent) {
      errors.dataConsent =
        "É obrigatório consentir o tratamento de dados pessoais";
    }

    // Date validation for appointment requests
    if (formData.subject === "consulta" || formData.subject === "exame") {
      if (!formData.preferredDate) {
        errors.preferredDate = "Data preferida é obrigatória para marcações";
      } else {
        const selectedDate = new Date(formData.preferredDate);
        const today = angolaFormatter.getCurrentAngolaTime();

        if (selectedDate <= today) {
          errors.preferredDate = "Data deve ser futura";
        }

        if (!angolaFormatter.isBusinessDay(selectedDate)) {
          errors.preferredDate = "Selecione um dia útil (Segunda a Sábado)";
        }

        if (angolaFormatter.isAngolaHoliday(selectedDate)) {
          const holidayName = angolaFormatter.getHolidayName(selectedDate);
          errors.preferredDate = `Data não disponível - ${holidayName}`;
        }
      }

      if (!formData.preferredTime) {
        errors.preferredTime = "Horário preferido é obrigatório para marcações";
      }

      if (!formData.specialty) {
        errors.specialty = "Especialidade é obrigatória para marcações";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Format phone number automatically
    if (field === "phone" && typeof value === "string") {
      const formatted = angolaFormatter.formatPhone(value);
      if (formatted !== value) {
        setFormData((prev) => ({ ...prev, phone: formatted }));
      }
    }

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitStatus({ type: null, message: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare submission data with Angola locale formatting
      const submissionData = {
        ...formData,
        phone: angolaFormatter.formatPhone(formData.phone),
        submittedAt: angolaFormatter.formatDateTime(new Date()),
        locale: "pt-AO",
        timezone: "Africa/Luanda",
        userAgent: navigator.userAgent,
        isOnline: isOnline,
      };

      if (isOnline) {
        // Online submission
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitStatus({
            type: "success",
            message:
              result.message ||
              "Mensagem enviada com sucesso! Entraremos em contacto em breve.",
          });

          // Reset form on success
          setFormData({
            name: "",
            email: "",
            phone: "",
            province: "",
            municipality: "",
            subject: "consulta",
            specialty: "",
            preferredDate: "",
            preferredTime: "",
            message: "",
            dataConsent: false,
            marketingConsent: false,
            emergencyContact: "",
          });

          setFormErrors({});
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
      } else {
        // Offline storage
        const formId = await pwaManager.storeFormOffline(
          "contact",
          submissionData,
        );

        setSubmitStatus({
          type: "offline",
          message:
            "Sem conexão à internet. Os seus dados foram guardados e serão enviados quando a conexão for restaurada.",
        });

        console.log("[ContactForm] Form stored offline with ID:", formId);
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (!isOnline) {
        try {
          const formId = await pwaManager.storeFormOffline("contact", formData);
          setSubmitStatus({
            type: "offline",
            message:
              "Erro de conexão. Os seus dados foram guardados e serão enviados quando a conexão for restaurada.",
          });
        } catch (offlineError) {
          console.error("Failed to store form offline:", offlineError);
          setSubmitStatus({
            type: "error",
            message:
              "Erro ao guardar dados. Verifique sua conexão e tente novamente.",
          });
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: "Erro de conexão. Verifique sua internet e tente novamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAppointmentRequest =
    formData.subject === "consulta" || formData.subject === "exame";

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <Mail className="w-5 h-5 text-clinic-primary" />
              {FormLabels.message}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Preencha o formulário e entraremos em contacto em breve
            </CardDescription>
          </div>

          <div className="flex flex-col items-end gap-2">
            {/* Connection status */}
            <Badge
              variant={isOnline ? "default" : "destructive"}
              className="text-xs"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </>
              )}
            </Badge>

            {/* Business status */}
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {businessStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Status Messages */}
        {submitStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border-green-200"
                : submitStatus.type === "offline"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {submitStatus.type === "success" && (
                <CheckCircle className="w-5 h-5" />
              )}
              {submitStatus.type === "offline" && <Save className="w-5 h-5" />}
              {submitStatus.type === "error" && (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm">{submitStatus.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clinic-primary flex items-center gap-2">
              <User className="w-4 h-4" />
              Dados Pessoais
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  {FormLabels.name} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`min-h-[44px] ${formErrors.name ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  placeholder="Nome completo"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  {FormLabels.email} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`min-h-[44px] ${formErrors.email ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                  placeholder="exemplo@email.com"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  {FormLabels.phone} *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`min-h-[44px] ${formErrors.phone ? "border-red-500" : ""}`}
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
                <Label
                  htmlFor="emergencyContact"
                  className="text-sm font-medium"
                >
                  {FormLabels.emergencyContact}
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleInputChange("emergencyContact", e.target.value)
                  }
                  className="min-h-[44px]"
                  disabled={isSubmitting}
                  placeholder="+244 XXX XXX XXX"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clinic-primary flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province" className="text-sm font-medium">
                  {FormLabels.province} *
                </Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) =>
                    handleInputChange("province", value)
                  }
                >
                  <SelectTrigger
                    className={`min-h-[44px] ${formErrors.province ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANGOLA_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.province && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.province}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="municipality" className="text-sm font-medium">
                  {FormLabels.municipality} *
                </Label>
                <Select
                  value={formData.municipality}
                  onValueChange={(value) =>
                    handleInputChange("municipality", value)
                  }
                  disabled={
                    !formData.province || availableMunicipalities.length === 0
                  }
                >
                  <SelectTrigger
                    className={`min-h-[44px] ${formErrors.municipality ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecione o município" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMunicipalities.map((municipality) => (
                      <SelectItem key={municipality} value={municipality}>
                        {municipality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.municipality && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.municipality}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clinic-primary flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Detalhes do Pedido
            </h3>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium">
                Assunto *
              </Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => handleInputChange("subject", value)}
              >
                <SelectTrigger className="min-h-[44px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_SUBJECTS.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAppointmentRequest && (
              <>
                <div>
                  <Label htmlFor="specialty" className="text-sm font-medium">
                    {FormLabels.specialty} *
                  </Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value) =>
                      handleInputChange("specialty", value)
                    }
                  >
                    <SelectTrigger
                      className={`min-h-[44px] ${formErrors.specialty ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALTIES.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.specialty && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.specialty}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="preferredDate"
                      className="text-sm font-medium"
                    >
                      Data Preferida *
                    </Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) =>
                        handleInputChange("preferredDate", e.target.value)
                      }
                      className={`min-h-[44px] ${formErrors.preferredDate ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                      min={angolaFormatter
                        .formatDate(new Date(), {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                        .split("/")
                        .reverse()
                        .join("-")}
                    />
                    {formErrors.preferredDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.preferredDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="preferredTime"
                      className="text-sm font-medium"
                    >
                      Horário Preferido *
                    </Label>
                    <Select
                      value={formData.preferredTime}
                      onValueChange={(value) =>
                        handleInputChange("preferredTime", value)
                      }
                    >
                      <SelectTrigger
                        className={`min-h-[44px] ${formErrors.preferredTime ? "border-red-500" : ""}`}
                      >
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateTimeSlots().map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.preferredTime && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.preferredTime}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="message" className="text-sm font-medium">
                {FormLabels.message} *
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                rows={4}
                className={`min-h-[120px] ${formErrors.message ? "border-red-500" : ""}`}
                disabled={isSubmitting}
                placeholder={
                  isAppointmentRequest
                    ? "Descreva os sintomas ou motivo da consulta..."
                    : "Descreva a sua dúvida ou necessidade..."
                }
              />
              {formErrors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.message}
                </p>
              )}
            </div>
          </div>

          {/* Privacy and Consent */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-clinic-primary flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacidade e Consentimento
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="dataConsent"
                  checked={formData.dataConsent}
                  onCheckedChange={(checked) =>
                    handleInputChange("dataConsent", checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="dataConsent"
                    className={`text-sm font-medium cursor-pointer ${formErrors.dataConsent ? "text-red-500" : ""}`}
                  >
                    Consentimento para Tratamento de Dados *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Consinto o tratamento dos meus dados pessoais para fins de
                    atendimento médico, conforme a Lei n.º 22/11 de Proteção de
                    Dados Pessoais de Angola.
                  </p>
                  {formErrors.dataConsent && (
                    <p className="text-red-500 text-xs">
                      {formErrors.dataConsent}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) =>
                    handleInputChange("marketingConsent", checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="marketingConsent"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Comunicações de Marketing (Opcional)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Desejo receber informações sobre novos serviços, promoções e
                    conteúdo de saúde por e-mail ou SMS.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-clinic-gradient hover:opacity-90 disabled:opacity-50 min-h-[48px] text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {isOnline ? "Enviando..." : "Guardando..."}
              </>
            ) : (
              <>
                {isOnline ? (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Offline
                  </>
                )}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            * Campos obrigatórios | Dados protegidos pela Lei n.º 22/11 de
            Angola
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
