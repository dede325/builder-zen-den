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

            {/* Step 3: Medical Information */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Informações Médicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especialidade *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione a especialidade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {specialties.map((specialty) => (
                                  <SelectItem key={specialty.value} value={specialty.value}>
                                    {specialty.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="appointmentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Consulta *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione o tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {appointmentTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon className="w-4 h-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Preferida *</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  // Check if date is a holiday
                                  const holiday = isNationalHoliday(e.target.value);
                                  if (holiday.isHoliday) {
                                    alert(`Atenção: ${e.target.value} é feriado nacional (${holiday.holiday?.name})`);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Consulte os nossos horários de funcionamento
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="preferredTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora Preferida *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione a hora" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 11 }, (_, i) => {
                                  const hour = 7 + i;
                                  const time = `${hour.toString().padStart(2, '0')}:00`;
                                  return (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Horário: Segunda a Sexta 07:00-19:00, Sábado 07:00-13:00
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Informações Clínicas (Opcional)</h4>

                      <FormField
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sintomas Actuais</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Descreva os sintomas que está a sentir..."
                                className="min-h-[80px]"
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
                          name="medications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medicamentos Actuais</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Liste os medicamentos que toma regularmente..."
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="allergies"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alergias Conhecidas</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Alergias a medicamentos, alimentos, etc..."
                                  className="min-h-[60px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="medicalHistory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Histórico Médico Relevante</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Cirurgias anteriores, doenças crónicas, hospitalizações..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    {/* Insurance Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Seguro de Saúde</h4>

                      <FormField
                        control={form.control}
                        name="hasInsurance"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Tenho seguro de saúde
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch('hasInsurance') && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="insuranceProvider"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Seguradora</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione a seguradora" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {insuranceProviders.map((provider) => (
                                        <SelectItem key={provider} value={provider}>
                                          {provider}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="policyNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Número da Apólice</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Número da sua apólice de seguro"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Consent and Emergency Contact */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Emergency Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Contacto de Emergência
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="emergencyContactName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo *</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome do contacto de emergência" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="emergencyContactRelation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Relação *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Seleccione a relação" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="spouse">Cônjuge</SelectItem>
                                  <SelectItem value="parent">Pai/Mãe</SelectItem>
                                  <SelectItem value="child">Filho/a</SelectItem>
                                  <SelectItem value="sibling">Irmão/Irmã</SelectItem>
                                  <SelectItem value="friend">Amigo/a</SelectItem>
                                  <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="emergencyContactPhone"
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Legal Consent */}
                  <Card className="border-warning/20 bg-warning/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-warning" />
                        Consentimentos Legais (Obrigatório)
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Conforme a Lei n.º 22/11 de Protecção de Dados Pessoais de Angola
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Alert className="border-info/20 bg-info/5">
                        <Info className="h-4 w-4 text-info" />
                        <AlertDescription className="text-info-foreground">
                          Os seus dados pessoais serão processados exclusivamente para fins de prestação
                          de cuidados de saúde e gestão da sua consulta médica. Pode exercer os seus direitos
                          de acesso, rectificação e eliminação contactando dpo@bemcuidar.co.ao
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="dataProcessingConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  Consentimento para Processamento de Dados Pessoais *
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Consinto que os meus dados pessoais sejam processados pela Clínica Bem Cuidar
                                  para fins de agendamento e prestação de cuidados de saúde, conforme a Política de Privacidade.
                                </p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="healthDataConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-warning/30 rounded-lg bg-warning/5">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  Consentimento para Processamento de Dados de Saúde *
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Consinto expressamente que os meus dados de saúde (dados especiais) sejam processados
                                  pelos profissionais de saúde da clínica para fins de diagnóstico, tratamento e seguimento médico.
                                </p>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="communicationConsent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  Comunicações Promocionais (Opcional)
                                </FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Aceito receber comunicações sobre serviços de saúde, campanhas de prevenção
                                  e novidades da clínica por email e SMS.
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Nota Legal:</strong> Pode retirar o seu consentimento a qualquer momento
                          contactando-nos. A retirada do consentimento não afecta a licitude do processamento
                          efectuado até essa data. Para mais informações, consulte a nossa{' '}
                          <button className="text-primary hover:underline">
                            Política de Privacidade
                          </button>.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
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
