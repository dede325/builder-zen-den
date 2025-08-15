import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Camera,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Paciente, ConfiguracoesPaciente } from "@shared/patient-types";
import PatientDataService from "@/services/patientData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

function PhotoUpload({
  currentPhoto,
  onPhotoChange,
  disabled,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onPhotoChange(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview || undefined} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>

        {!disabled && (
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!disabled && (
        <div className="space-y-2 w-full max-w-xs">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
              dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300",
              "hover:border-gray-400",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste uma foto ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG até 5MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              Selecionar Foto
            </Button>
            {preview && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemovePhoto}
                className="flex-1"
              >
                Remover
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PerfilPage() {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [formData, setFormData] = useState<Partial<Paciente>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Configurações
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesPaciente>({
    paciente_id: "pac_001",
    notificacoes_email: true,
    notificacoes_sms: false,
    notificacoes_push: true,
    privacidade_dados: true,
    compartilhar_exames: false,
    tema: "claro",
    idioma: "pt-BR",
  });

  // Mudança de senha
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const loadPaciente = async () => {
      try {
        const data = await PatientDataService.getPaciente("pac_001");
        setPaciente(data);
        setFormData(data);
        setPhotoPreview(data.foto_url || null);
      } catch (error) {
        console.error("Erro ao carregar paciente:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPaciente();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.telefone?.trim()) {
      newErrors.telefone = "Telefone é obrigatório";
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = "Telefone deve estar no formato (11) 99999-9999";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setSuccessMessage("");

    try {
      // Upload da foto se houver
      let photoUrl = formData.foto_url;
      if (photoFile) {
        setUploadingPhoto(true);
        const uploadResult = await PatientDataService.uploadArquivo(
          photoFile,
          "foto",
        );
        if (uploadResult.success) {
          photoUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Erro no upload da foto");
        }
        setUploadingPhoto(false);
      }

      // Atualizar dados do paciente
      const updatedPaciente = await PatientDataService.updatePaciente(
        "pac_001",
        {
          ...formData,
          foto_url: photoUrl,
        },
      );

      setPaciente(updatedPaciente);
      setSuccessMessage("Perfil atualizado com sucesso!");
      setPhotoFile(null);

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setErrors({ general: "Erro ao salvar as alterações. Tente novamente." });
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const handlePasswordChange = async () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current) {
      newErrors.current = "Senha atual é obrigatória";
    }

    if (!passwordData.new) {
      newErrors.new = "Nova senha é obrigatória";
    } else if (passwordData.new.length < 6) {
      newErrors.new = "Nova senha deve ter pelo menos 6 caracteres";
    }

    if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = "Senhas não coincidem";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simular mudança de senha
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordData({ current: "", new: "", confirm: "" });
      setSuccessMessage("Senha alterada com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handlePhotoChange = (file: File | null, preview: string | null) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      {successMessage && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errors.general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="dados" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Foto e Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Foto de Perfil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoUpload
                  currentPhoto={photoPreview || undefined}
                  onPhotoChange={handlePhotoChange}
                  disabled={saving || uploadingPhoto}
                />
                {uploadingPhoto && (
                  <div className="text-center mt-4">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Enviando foto...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações da Conta */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Membro desde</p>
                      <p className="text-sm text-muted-foreground">
                        {paciente &&
                          format(new Date(paciente.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Última atualização</p>
                      <p className="text-sm text-muted-foreground">
                        {paciente &&
                          format(new Date(paciente.updated_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>
                Mantenha suas informações atualizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    className={errors.nome ? "border-red-500" : ""}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        telefone: formatPhoneInput(e.target.value),
                      }))
                    }
                    placeholder="(11) 99999-9999"
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        data_nascimento: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, cpf: e.target.value }))
                    }
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CPF não pode ser alterado
                  </p>
                </div>

                <div>
                  <Label htmlFor="convenio">Convênio</Label>
                  <Input
                    id="convenio"
                    value={formData.convenio || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        convenio: e.target.value,
                      }))
                    }
                    placeholder="Nome do convênio"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Input
                  id="endereco"
                  value={formData.endereco || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: e.target.value,
                    }))
                  }
                  placeholder="Rua, número, bairro, cidade - UF"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || uploadingPhoto}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                    className={
                      errors.current ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.current && (
                  <p className="text-red-500 text-sm mt-1">{errors.current}</p>
                )}
              </div>

              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        new: e.target.value,
                      }))
                    }
                    className={errors.new ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.new && (
                  <p className="text-red-500 text-sm mt-1">{errors.new}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                    className={
                      errors.confirm ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirm && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>
                )}
              </div>

              <Button onClick={handlePasswordChange} className="w-full">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
              <CardDescription>
                Configure como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_email}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        notificacoes_email: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por SMS
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_sms}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        notificacoes_sms: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push</p>
                  <p className="text-sm text-muted-foreground">
                    Notificações push no navegador
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.notificacoes_push}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        notificacoes_push: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacidade</CardTitle>
              <CardDescription>
                Controle o compartilhamento dos seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compartilhar exames</p>
                  <p className="text-sm text-muted-foreground">
                    Permitir compartilhamento de exames com outros médicos
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configuracoes.compartilhar_exames}
                    onChange={(e) =>
                      setConfiguracoes((prev) => ({
                        ...prev,
                        compartilhar_exames: e.target.checked,
                      }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
