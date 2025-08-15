import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Stethoscope,
  Award,
  BookOpen,
  Clock,
  Settings,
  FileText,
  Globe,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DoctorProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    cpf: string;
    rg: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    avatar?: string;
  };
  professionalInfo: {
    crm: string;
    crmState: string;
    specialty: string;
    subspecialties: string[];
    medicalSchool: string;
    graduationYear: string;
    residency?: string;
    residencyYear?: string;
    fellowships: string[];
    certifications: string[];
    languages: string[];
  };
  workInfo: {
    position: string;
    department: string;
    hireDate: string;
    workSchedule: {
      monday: { start: string; end: string; active: boolean };
      tuesday: { start: string; end: string; active: boolean };
      wednesday: { start: string; end: string; active: boolean };
      thursday: { start: string; end: string; active: boolean };
      friday: { start: string; end: string; active: boolean };
      saturday: { start: string; end: string; active: boolean };
      sunday: { start: string; end: string; active: boolean };
    };
    consultationDuration: number; // em minutos
    acceptsEmergency: boolean;
    acceptsTelemedicine: boolean;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      appointmentReminders: boolean;
      urgentMessages: boolean;
      systemUpdates: boolean;
    };
    privacy: {
      showPhoneToPatients: boolean;
      showEmailToPatients: boolean;
      allowPatientReviews: boolean;
      shareStatistics: boolean;
    };
    interface: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      timezone: string;
      dateFormat: string;
      timeFormat: '12h' | '24h';
    };
  };
  statistics: {
    totalConsultations: number;
    averageRating: number;
    totalPatients: number;
    yearsOfExperience: number;
    consultationsThisMonth: number;
    patientSatisfaction: number;
  };
  documents: {
    diploma?: string;
    crmCertificate?: string;
    specialtyCertificates: string[];
    cv?: string;
  };
}

const mockDoctorProfile: DoctorProfile = {
  id: 'doc_001',
  personalInfo: {
    firstName: 'João',
    lastName: 'Carvalho Santos',
    email: 'joao.carvalho@bemcuidar.com.br',
    phone: '(11) 99999-1234',
    dateOfBirth: '1980-05-15',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    address: {
      street: 'Rua dos Médicos',
      number: '123',
      complement: 'Apartamento 45',
      neighborhood: 'Vila Médica',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    avatar: '/avatars/doctor.jpg'
  },
  professionalInfo: {
    crm: '123456',
    crmState: 'SP',
    specialty: 'Cardiologia',
    subspecialties: ['Ecocardiografia', 'Cardiologia Intervencionista'],
    medicalSchool: 'Universidade de São Paulo (USP)',
    graduationYear: '2005',
    residency: 'Hospital das Clínicas - USP',
    residencyYear: '2008',
    fellowships: ['Fellowship em Cardiologia Intervencionista - InCor'],
    certifications: [
      'Título de Especialista em Cardiologia - SBC',
      'Certificação em Ecocardiografia - SBC',
      'ACLS - American Heart Association'
    ],
    languages: ['Português', 'Inglês', 'Espanhol']
  },
  workInfo: {
    position: 'Médico Cardiologista',
    department: 'Cardiologia',
    hireDate: '2010-03-01',
    workSchedule: {
      monday: { start: '08:00', end: '18:00', active: true },
      tuesday: { start: '08:00', end: '18:00', active: true },
      wednesday: { start: '08:00', end: '18:00', active: true },
      thursday: { start: '08:00', end: '18:00', active: true },
      friday: { start: '08:00', end: '18:00', active: true },
      saturday: { start: '08:00', end: '14:00', active: true },
      sunday: { start: '', end: '', active: false }
    },
    consultationDuration: 30,
    acceptsEmergency: true,
    acceptsTelemedicine: true
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
      appointmentReminders: true,
      urgentMessages: true,
      systemUpdates: true
    },
    privacy: {
      showPhoneToPatients: false,
      showEmailToPatients: false,
      allowPatientReviews: true,
      shareStatistics: true
    },
    interface: {
      theme: 'light',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'dd/MM/yyyy',
      timeFormat: '24h'
    }
  },
  statistics: {
    totalConsultations: 2456,
    averageRating: 4.8,
    totalPatients: 892,
    yearsOfExperience: 19,
    consultationsThisMonth: 85,
    patientSatisfaction: 96
  },
  documents: {
    diploma: '/documents/diploma.pdf',
    crmCertificate: '/documents/crm.pdf',
    specialtyCertificates: ['/documents/cardio_cert.pdf'],
    cv: '/documents/cv.pdf'
  }
};

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

function PhotoUpload({ currentPhoto, onPhotoChange, disabled }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
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
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-32 w-32">
          <AvatarImage src={preview || undefined} />
          <AvatarFallback>
            <User className="h-16 w-16" />
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
              "hover:border-gray-400"
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

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile>(mockDoctorProfile);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Mudança de senha
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    setPhotoPreview(profile.personalInfo.avatar || null);
  }, [profile]);

  const validateForm = (section: string) => {
    const newErrors: Record<string, string> = {};

    if (section === 'personal') {
      if (!profile.personalInfo.firstName?.trim()) {
        newErrors.firstName = 'Nome é obrigatório';
      }
      if (!profile.personalInfo.lastName?.trim()) {
        newErrors.lastName = 'Sobrenome é obrigatório';
      }
      if (!profile.personalInfo.email?.trim()) {
        newErrors.email = 'Email é obrigatório';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.personalInfo.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!profile.personalInfo.phone?.trim()) {
        newErrors.phone = 'Telefone é obrigatório';
      }
    }

    if (section === 'professional') {
      if (!profile.professionalInfo.crm?.trim()) {
        newErrors.crm = 'CRM é obrigatório';
      }
      if (!profile.professionalInfo.specialty?.trim()) {
        newErrors.specialty = 'Especialidade é obrigatória';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (section: string) => {
    if (!validateForm(section)) return;

    setSaving(true);
    setSuccessMessage('');
    
    try {
      // Upload da foto se houver
      if (photoFile) {
        setUploadingPhoto(true);
        // Simular upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        const photoUrl = `/uploads/avatars/${Date.now()}_${photoFile.name}`;
        setProfile(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            avatar: photoUrl
          }
        }));
        setUploadingPhoto(false);
      }

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 500));
      setSuccessMessage('Perfil atualizado com sucesso!');
      setPhotoFile(null);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setErrors({ general: 'Erro ao salvar as alterações. Tente novamente.' });
    } finally {
      setSaving(false);
      setUploadingPhoto(false);
    }
  };

  const handlePasswordChange = async () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.current) {
      newErrors.current = 'Senha atual é obrigatória';
    }

    if (!passwordData.new) {
      newErrors.new = 'Nova senha é obrigatória';
    } else if (passwordData.new.length < 8) {
      newErrors.new = 'Nova senha deve ter pelo menos 8 caracteres';
    }

    if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = 'Senhas não coincidem';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ current: '', new: '', confirm: '' });
      setSuccessMessage('Senha alterada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setSaving(false);
    }
  };

  const handlePhotoChange = (file: File | null, preview: string | null) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateProfessionalInfo = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        [field]: value
      }
    }));
  };

  const updateWorkInfo = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      workInfo: {
        ...prev.workInfo,
        [field]: value
      }
    }));
  };

  const updatePreferences = (section: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [section]: {
          ...prev.preferences[section as keyof typeof prev.preferences],
          [field]: value
        }
      }
    }));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Perfil Médico</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações profissionais e pessoais
          </p>
        </div>
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

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Pessoal</TabsTrigger>
          <TabsTrigger value="professional">Profissional</TabsTrigger>
          <TabsTrigger value="work">Trabalho</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
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
                    <p className="text-sm text-muted-foreground">Enviando foto...</p>
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
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">CRM</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.professionalInfo.crm}/{profile.professionalInfo.crmState}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Especialidade</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.professionalInfo.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Contratação</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(profile.workInfo.hireDate), 'dd/MM/yyyy', { locale: ptBR })}
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
                Mantenha suas informações pessoais atualizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profile.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', formatPhoneInput(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.personalInfo.dateOfBirth}
                    onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={profile.personalInfo.cpf}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CPF não pode ser alterado
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('personal')} 
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
                    Salvar Informações Pessoais
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="h-5 w-5" />
                <span>Informações Profissionais</span>
              </CardTitle>
              <CardDescription>
                Dados da sua formação e especialização médica
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="crm">CRM</Label>
                  <Input
                    id="crm"
                    value={profile.professionalInfo.crm}
                    onChange={(e) => updateProfessionalInfo('crm', e.target.value)}
                    className={errors.crm ? 'border-red-500' : ''}
                  />
                  {errors.crm && <p className="text-red-500 text-sm mt-1">{errors.crm}</p>}
                </div>
                
                <div>
                  <Label htmlFor="crmState">Estado do CRM</Label>
                  <Select 
                    value={profile.professionalInfo.crmState} 
                    onValueChange={(value) => updateProfessionalInfo('crmState', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      {/* Adicionar outros estados */}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="specialty">Especialidade Principal</Label>
                  <Input
                    id="specialty"
                    value={profile.professionalInfo.specialty}
                    onChange={(e) => updateProfessionalInfo('specialty', e.target.value)}
                    className={errors.specialty ? 'border-red-500' : ''}
                  />
                  {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                </div>
                
                <div>
                  <Label htmlFor="medicalSchool">Faculdade de Medicina</Label>
                  <Input
                    id="medicalSchool"
                    value={profile.professionalInfo.medicalSchool}
                    onChange={(e) => updateProfessionalInfo('medicalSchool', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="graduationYear">Ano de Formatura</Label>
                  <Input
                    id="graduationYear"
                    value={profile.professionalInfo.graduationYear}
                    onChange={(e) => updateProfessionalInfo('graduationYear', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="residency">Residência Médica</Label>
                  <Input
                    id="residency"
                    value={profile.professionalInfo.residency || ''}
                    onChange={(e) => updateProfessionalInfo('residency', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="certifications">Certificações</Label>
                <Textarea
                  id="certifications"
                  value={profile.professionalInfo.certifications.join('\n')}
                  onChange={(e) => updateProfessionalInfo('certifications', e.target.value.split('\n').filter(Boolean))}
                  placeholder="Digite uma certificação por linha"
                  rows={4}
                />
              </div>

              <Button 
                onClick={() => handleSave('professional')} 
                disabled={saving}
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
                    Salvar Informações Profissionais
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="work" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Informações de Trabalho</span>
              </CardTitle>
              <CardDescription>
                Configure seus horários e preferências de trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profile.workInfo.position}
                    onChange={(e) => updateWorkInfo('position', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input
                    id="department"
                    value={profile.workInfo.department}
                    onChange={(e) => updateWorkInfo('department', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="consultationDuration">Duração da Consulta (minutos)</Label>
                  <Input
                    id="consultationDuration"
                    type="number"
                    min="15"
                    max="120"
                    value={profile.workInfo.consultationDuration}
                    onChange={(e) => updateWorkInfo('consultationDuration', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Preferências de Atendimento</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Aceita Emergências</Label>
                      <p className="text-sm text-muted-foreground">
                        Disponível para atendimentos de emergência
                      </p>
                    </div>
                    <Switch
                      checked={profile.workInfo.acceptsEmergency}
                      onCheckedChange={(checked) => updateWorkInfo('acceptsEmergency', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Telemedicina</Label>
                      <p className="text-sm text-muted-foreground">
                        Realiza consultas online
                      </p>
                    </div>
                    <Switch
                      checked={profile.workInfo.acceptsTelemedicine}
                      onCheckedChange={(checked) => updateWorkInfo('acceptsTelemedicine', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('work')} 
                disabled={saving}
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
                    Salvar Configurações de Trabalho
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultas Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {profile.statistics.totalConsultations.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Desde o início</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avaliação Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {profile.statistics.averageRating.toFixed(1)} ★
                </div>
                <p className="text-sm text-muted-foreground">De 5.0 estrelas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pacientes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {profile.statistics.totalPatients.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experiência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {profile.statistics.yearsOfExperience}
                </div>
                <p className="text-sm text-muted-foreground">Anos de prática</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Este Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {profile.statistics.consultationsThisMonth}
                </div>
                <p className="text-sm text-muted-foreground">Consultas realizadas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Satisfação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {profile.statistics.patientSatisfaction}%
                </div>
                <p className="text-sm text-muted-foreground">Dos pacientes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por email
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.email}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por SMS
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.sms}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'sms', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações push no navegador
                    </p>
                  </div>
                  <Switch
                    checked={profile.preferences.notifications.push}
                    onCheckedChange={(checked) => updatePreferences('notifications', 'push', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Interface</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select 
                    value={profile.preferences.interface.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'system') => updatePreferences('interface', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeFormat">Formato de Hora</Label>
                  <Select 
                    value={profile.preferences.interface.timeFormat} 
                    onValueChange={(value: '12h' | '24h') => updatePreferences('interface', 'timeFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 horas</SelectItem>
                      <SelectItem value="24h">24 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Alterar Senha</span>
              </CardTitle>
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
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.current}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                    className={errors.current ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.current && <p className="text-red-500 text-sm mt-1">{errors.current}</p>}
              </div>

              <div>
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.new}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                    className={errors.new ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.new && <p className="text-red-500 text-sm mt-1">{errors.new}</p>}
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                    className={errors.confirm ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
              </div>

              <Button onClick={handlePasswordChange} disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
