import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Send,
  Loader2,
  Info,
  Calendar as CalendarIcon,
} from "lucide-react";
import { 
  formatPhoneNumber, 
  validatePhoneNumber, 
  isNationalHoliday,
  getNextBusinessHour,
  isBusinessHours,
  PROVINCES,
  MEDICAL_TERMINOLOGY 
} from "@/lib/locale-angola";

// Validation schema following Angola data protection requirements
const appointmentSchema = z.object({
  // Personal Information
  fullName: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  
  email: z.string()
    .email("Formato de email inválido")
    .max(150, "Email muito longo"),
  
  phone: z.string()
    .refine(validatePhoneNumber, "Número de telefone inválido para Angola"),
  
  birthDate: z.string()
    .refine((date) => {
      const parsed = new Date(date);
      const now = new Date();
      const age = now.getFullYear() - parsed.getFullYear();
      return age >= 0 && age <= 120;
    }, "Data de nascimento inválida"),
  
  // Address
  address: z.string().min(10, "Endereço muito curto").max(200, "Endereço muito longo"),
  municipality: z.string().min(2, "Município obrigatório"),
  province: z.enum(PROVINCES, { errorMap: () => ({ message: "Província inválida" }) }),
  
  // Medical Information
  specialty: z.string().min(1, "Especialidade obrigatória"),
  appointmentType: z.enum(['consultation', 'followup', 'exam', 'emergency'], {
    errorMap: () => ({ message: "Tipo de consulta inválido" })
  }),
  preferredDate: z.string().refine((date) => {
    const selected = new Date(date);
    const now = new Date();
    selected.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return selected >= now;
  }, "Data deve ser hoje ou no futuro"),
  
  preferredTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
  
  symptoms: z.string().max(1000, "Descrição muito longa").optional(),
  medicalHistory: z.string().max(1000, "Histórico muito longo").optional(),
  medications: z.string().max(500, "Lista de medicamentos muito longa").optional(),
  allergies: z.string().max(500, "Lista de alergias muito longa").optional(),
  
  // Insurance
  hasInsurance: z.boolean(),
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
  
  // Legal consent (required by Lei 22/11)
  dataProcessingConsent: z.boolean().refine(val => val === true, {
    message: "Consentimento obrigatório para processamento de dados pessoais"
  }),
  healthDataConsent: z.boolean().refine(val => val === true, {
    message: "Consentimento obrigatório para processamento de dados de saúde"
  }),
  communicationConsent: z.boolean().optional(),
  
  // Emergency contact
  emergencyContactName: z.string().min(2, "Nome do contacto de emergência obrigatório"),
  emergencyContactPhone: z.string().refine(validatePhoneNumber, "Telefone de emergência inválido"),
  emergencyContactRelation: z.string().min(2, "Relação com contacto de emergência obrigatória"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const specialties = [
  { value: 'cardiology', label: MEDICAL_TERMINOLOGY.cardiology },
  { value: 'pediatrics', label: MEDICAL_TERMINOLOGY.pediatrics },
  { value: 'gynecology', label: MEDICAL_TERMINOLOGY.gynecology },
  { value: 'orthopedics', label: MEDICAL_TERMINOLOGY.orthopedics },
  { value: 'dermatology', label: MEDICAL_TERMINOLOGY.dermatology },
  { value: 'neurology', label: MEDICAL_TERMINOLOGY.neurology },
  { value: 'urology', label: MEDICAL_TERMINOLOGY.urology },
  { value: 'ophthalmology', label: MEDICAL_TERMINOLOGY.ophthalmology },
  { value: 'otolaryngology', label: MEDICAL_TERMINOLOGY.otolaryngology },
  { value: 'endocrinology', label: MEDICAL_TERMINOLOGY.endocrinology },
  { value: 'gastroenterology', label: MEDICAL_TERMINOLOGY.gastroenterology },
];

const appointmentTypes = [
  { value: 'consultation', label: 'Primeira Consulta', icon: User },
  { value: 'followup', label: 'Consulta de Seguimento', icon: Calendar },
  { value: 'exam', label: 'Exame Complementar', icon: Stethoscope },
  { value: 'emergency', label: 'Urgência', icon: AlertCircle },
];

const insuranceProviders = [
  'ENSA - Empresa Nacional de Seguros de Angola',
  'Global Seguros',
  'Angola Seguros',
  'NOSSA Seguros',
  'Garantia Seguros',
  'Fidelidade Angola',
  'Outro'
];

export default function AppointmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [businessHours, setBusinessHours] = useState<string>('');

  const totalSteps = 4;

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      hasInsurance: false,
      dataProcessingConsent: false,
      healthDataConsent: false,
      communicationConsent: false,
    },
  });

  // Check business hours status
  useEffect(() => {
    if (isBusinessHours()) {
      setBusinessHours('Estamos abertos agora!');
    } else {
      const next = getNextBusinessHour();
      setBusinessHours(next.message);
    }
  }, []);

  // Form submission
  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);

    try {
      // Format phone numbers
      const formattedData = {
        ...data,
        phone: formatPhoneNumber(data.phone),
        emergencyContactPhone: formatPhoneNumber(data.emergencyContactPhone),
        submissionTime: new Date().toISOString(),
        source: 'website-premium-form',
        consentVersion: '2024.1',
      };

      // In production, send to backend
      const response = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        form.reset();
      } else {
        throw new Error('Erro no envio');
      }
    } catch (error) {
      console.error('Appointment submission error:', error);
      // Handle offline storage if needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = async () => {
    const fieldsToValidate: Record<number, (keyof AppointmentFormData)[]> = {
      1: ['fullName', 'email', 'phone', 'birthDate'],
      2: ['address', 'municipality', 'province'],
      3: ['specialty', 'appointmentType', 'preferredDate', 'preferredTime'],
      4: ['dataProcessingConsent', 'healthDataConsent', 'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'],
    };

    const fields = fieldsToValidate[currentStep] || [];
    const isValid = await form.trigger(fields);
    
    if (isValid) {
      nextStep();
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center space-y-6 p-8"
      >
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Agendamento Enviado!</h2>
        <p className="text-lg text-muted-foreground">
          Recebemos o seu pedido de agendamento. Entraremos em contacto consigo no prazo de 24 horas 
          para confirmar a sua consulta.
        </p>
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-info mt-0.5" />
            <div className="text-left">
              <h4 className="font-semibold text-info-foreground mb-2">Próximos Passos</h4>
              <ul className="text-sm text-info-foreground/80 space-y-1">
                <li>• Receberá um SMS/email de confirmação</li>
                <li>• Prepare os seus documentos de identificação</li>
                <li>• Chegue 15 minutos antes da consulta</li>
                <li>• Traga lista de medicamentos actuais</li>
              </ul>
            </div>
          </div>
        </div>
        <Button onClick={() => window.location.reload()} variant="clinic" size="lg">
          Fazer Novo Agendamento
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Agendar Consulta</h2>
          <Badge variant="outline" className="px-3 py-1">
            Passo {currentStep} de {totalSteps}
          </Badge>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-clinic-gradient h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Business Hours Alert */}
        <Alert className="mt-4 border-info/20 bg-info/5">
          <Clock className="h-4 w-4 text-info" />
          <AlertDescription className="text-info-foreground">
            {businessHours}
          </AlertDescription>
        </Alert>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo *</FormLabel>
                            <FormControl>
                              <Input placeholder="João Silva Santos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="joao@exemplo.co.ao" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+244 923 123 456" 
                                {...field}
                                onChange={(e) => {
                                  const formatted = formatPhoneNumber(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Formato: +244 XXX XXX XXX
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Endereço
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço Completo *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Rua da Missão, Nº 123, Bairro Maianga"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="municipality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Município *</FormLabel>
                            <FormControl>
                              <Input placeholder="Luanda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Província *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione a província" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {PROVINCES.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Steps 3 & 4 would continue here... */}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              Anterior
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={validateCurrentStep}
                className="flex items-center gap-2"
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Agendamento
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
