import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Heart,
  Shield,
  UserCheck,
  Stethoscope,
  Users,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Smartphone,
} from "lucide-react";
import { useAuthStore, UserRole } from "@/store/auth-portal";

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
  twoFactorCode?: string;
}

export default function UnifiedLogin() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    remember: false,
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const roleConfigs = {
    patient: {
      title: "Portal do Paciente",
      description: "Acesse seus exames, consultas e histórico médico",
      icon: Heart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      redirect: "/portal/patient",
    },
    doctor: {
      title: "Portal Médico",
      description: "Gerencie seus pacientes e agenda médica",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      redirect: "/portal/doctor",
    },
    admin: {
      title: "Administração",
      description: "Painel administrativo e gestão da clínica",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      redirect: "/portal/admin",
    },
    nurse: {
      title: "Portal Enfermagem",
      description: "Acompanhamento de pacientes e procedimentos",
      icon: UserCheck,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      redirect: "/portal/nurse",
    },
    receptionist: {
      title: "Recepção",
      description: "Gestão de agendamentos e atendimento",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      redirect: "/portal/reception",
    },
  };

  const currentConfig = roleConfigs[selectedRole];

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resetMode) {
      // Handle password reset
      return;
    }

    try {
      await login(formData.email, formData.password, selectedRole);
      navigate(currentConfig.redirect);
    } catch (error) {
      if (error instanceof Error && error.message.includes("2FA")) {
        setShow2FA(true);
      }
    }
  };

  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-clinic-light/20 via-white to-clinic-secondary/10 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-clinic-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-clinic-secondary/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader
            className={`${currentConfig.bgColor} ${currentConfig.borderColor} border-b-2 text-center pb-8`}
          >
            <motion.div
              key={selectedRole}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center space-y-4"
            >
              <div
                className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center`}
              >
                <IconComponent className={`w-8 h-8 ${currentConfig.color}`} />
              </div>

              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {currentConfig.title}
                </CardTitle>
                <p className="text-gray-600 mt-2 text-sm">
                  {currentConfig.description}
                </p>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Role Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Tipo de Acesso
              </Label>
              <Tabs
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 mb-4 h-auto p-1">
                  <TabsTrigger value="patient" className="text-xs py-2">
                    Paciente
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="text-xs py-2">
                    Médico
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs py-2">
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsList className="grid grid-cols-2 h-auto p-1">
                  <TabsTrigger value="nurse" className="text-xs py-2">
                    Enfermagem
                  </TabsTrigger>
                  <TabsTrigger value="receptionist" className="text-xs py-2">
                    Recepção
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Separator className="my-6" />

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {!show2FA ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      E-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="pl-10"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label
                    htmlFor="twoFactorCode"
                    className="text-sm font-medium"
                  >
                    Código de Verificação (2FA)
                  </Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="twoFactorCode"
                      type="text"
                      value={formData.twoFactorCode || ""}
                      onChange={(e) =>
                        handleInputChange("twoFactorCode", e.target.value)
                      }
                      className="pl-10 text-center tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Digite o código de 6 dígitos do seu app autenticador
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${currentConfig.color} bg-gradient-to-r from-clinic-primary to-clinic-secondary hover:shadow-lg transition-all duration-300`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </div>
                ) : show2FA ? (
                  "Verificar Código"
                ) : (
                  "Entrar"
                )}
              </Button>

              {!show2FA && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) =>
                        handleInputChange("remember", e.target.checked)
                      }
                      className="rounded border-gray-300 text-clinic-primary focus:ring-clinic-primary"
                    />
                    <span className="text-gray-600">Lembrar-me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-clinic-primary hover:text-clinic-secondary"
                  >
                    Esqueci a senha
                  </button>
                </div>
              )}

              {show2FA && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShow2FA(false)}
                  className="w-full"
                >
                  Voltar ao Login
                </Button>
              )}
            </form>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Protegido por criptografia AES-256
              </p>
              <p className="text-xs text-gray-500 mt-1">
                © 2025 Clínica Bem Cuidar - Todos os direitos reservados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">
            Em caso de emergência, ligue:{" "}
            <a
              href="tel:+244923456789"
              className="font-semibold text-clinic-primary"
            >
              +244 923 456 789
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
