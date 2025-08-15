import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Bell, 
  Shield, 
  Camera,
  Save,
  Key
} from 'lucide-react';
import { PerfilGestor as PerfilGestorType } from '@shared/manager-types';
import ManagerDataService from '@/services/managerData';

export function PerfilGestor() {
  const [perfil, setPerfil] = useState<PerfilGestorType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        const data = await ManagerDataService.getPerfilGestor();
        setPerfil(data);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerfil();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const handleNotificationChange = (key: keyof PerfilGestorType['notificacoes'], value: boolean) => {
    if (perfil) {
      setPerfil({
        ...perfil,
        notificacoes: {
          ...perfil.notificacoes,
          [key]: value
        }
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando perfil...</div>;
  }

  if (!perfil) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Perfil do Gestor</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={perfil.fotoPerfil} />
                    <AvatarFallback>
                      {perfil.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Alterar Foto
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={perfil.nome}
                      onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={perfil.email}
                      onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={perfil.telefone}
                      onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={perfil.cargo}
                      onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{perfil.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Telefone</p>
                      <p className="text-sm text-muted-foreground">{perfil.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Cargo</p>
                      <p className="text-sm text-muted-foreground">{perfil.cargo}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Preferências de Notificação</span>
              </CardTitle>
              <CardDescription>
                Configure como deseja receber as notificações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Canais de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notif">Notificações por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações importantes por email
                      </p>
                    </div>
                    <Switch
                      id="email-notif"
                      checked={perfil.notificacoes.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notif">Notificações por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas urgentes via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms-notif"
                      checked={perfil.notificacoes.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notif">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações no navegador e dispositivos móveis
                      </p>
                    </div>
                    <Switch
                      id="push-notif"
                      checked={perfil.notificacoes.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Tipos de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="financeiro-notif">Alertas Financeiros</Label>
                      <p className="text-sm text-muted-foreground">
                        Faturas vencidas, pagamentos recebidos
                      </p>
                    </div>
                    <Switch
                      id="financeiro-notif"
                      checked={perfil.notificacoes.financeiro}
                      onCheckedChange={(checked) => handleNotificationChange('financeiro', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="estoque-notif">Alertas de Estoque</Label>
                      <p className="text-sm text-muted-foreground">
                        Itens com estoque baixo ou vencimento próximo
                      </p>
                    </div>
                    <Switch
                      id="estoque-notif"
                      checked={perfil.notificacoes.estoque}
                      onCheckedChange={(checked) => handleNotificationChange('estoque', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="consultas-notif">Consultas e Exames</Label>
                      <p className="text-sm text-muted-foreground">
                        Agendamentos, cancelamentos e resultados
                      </p>
                    </div>
                    <Switch
                      id="consultas-notif"
                      checked={perfil.notificacoes.consultas}
                      onCheckedChange={(checked) => handleNotificationChange('consultas', checked)}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Preferências'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Segurança da Conta</span>
              </CardTitle>
              <CardDescription>
                Gerencie a segurança e acesso à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Alterar Senha</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Digite a nova senha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                </div>
                <Button className="w-full">
                  Alterar Senha
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Sessões Ativas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome - Windows • Agora
                      </p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Ativa
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
