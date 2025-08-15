import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  UserPlus,
  UserX,
  Shield,
  Mail,
  Phone,
  Calendar,
  Plus,
} from "lucide-react";
import { Usuario } from "@shared/manager-types";
import ManagerDataService from "@/services/managerData";
import { cn } from "@/lib/utils";

interface UsuarioFormProps {
  usuario?: Usuario;
  onSave: (usuario: Partial<Usuario>) => void;
  onClose: () => void;
}

function UsuarioForm({ usuario, onSave, onClose }: UsuarioFormProps) {
  const [formData, setFormData] = useState({
    nome: usuario?.nome || "",
    email: usuario?.email || "",
    telefone: usuario?.telefone || "",
    tipo: usuario?.tipo || ("paciente" as Usuario["tipo"]),
    especialidade: usuario?.especialidade || "",
    crm: usuario?.crm || "",
    status: usuario?.status || ("ativo" as Usuario["status"]),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{usuario ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
        <DialogDescription>
          {usuario
            ? "Altere as informações do usuário"
            : "Cadastre um novo usuário no sistema"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nome: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, telefone: e.target.value }))
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="tipo">Tipo de Usuário</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: Usuario["tipo"]) =>
                setFormData((prev) => ({ ...prev, tipo: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medico">Médico</SelectItem>
                <SelectItem value="enfermeira">Enfermeira</SelectItem>
                <SelectItem value="secretaria">Secretária</SelectItem>
                <SelectItem value="paciente">Paciente</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.tipo === "medico" && (
            <>
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      especialidade: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="crm">CRM</Label>
                <Input
                  id="crm"
                  value={formData.crm}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, crm: e.target.value }))
                  }
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="status">Status Ativo</Label>
          <Switch
            id="status"
            checked={formData.status === "ativo"}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                status: checked ? "ativo" : "inativo",
              }))
            }
          />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            {usuario ? "Salvar Alterações" : "Criar Usuário"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

interface UsuarioDetailsProps {
  usuario: Usuario;
  onClose: () => void;
  onEdit: (usuario: Usuario) => void;
  onToggleStatus: (id: string) => void;
}

function UsuarioDetails({
  usuario,
  onClose,
  onEdit,
  onToggleStatus,
}: UsuarioDetailsProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Detalhes do Usuário</DialogTitle>
        <DialogDescription>
          Informações completas e ações disponíveis
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <p className="text-lg">{usuario.nome}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <p className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{usuario.email}</span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Telefone</label>
            <p className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{usuario.telefone}</span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <Badge variant="outline" className="capitalize">
              {usuario.tipo}
            </Badge>
          </div>
          {usuario.especialidade && (
            <div>
              <label className="text-sm font-medium">Especialidade</label>
              <p>{usuario.especialidade}</p>
            </div>
          )}
          {usuario.crm && (
            <div>
              <label className="text-sm font-medium">CRM</label>
              <p>{usuario.crm}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge
              variant={
                usuario.status === "ativo"
                  ? "outline"
                  : usuario.status === "inativo"
                    ? "secondary"
                    : "destructive"
              }
            >
              {usuario.status === "ativo" && "Ativo"}
              {usuario.status === "inativo" && "Inativo"}
              {usuario.status === "suspenso" && "Suspenso"}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium">Data de Cadastro</label>
            <p className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}
              </span>
            </p>
          </div>
          {usuario.ultimoLogin && (
            <div>
              <label className="text-sm font-medium">Último Login</label>
              <p>{new Date(usuario.ultimoLogin).toLocaleDateString("pt-BR")}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => onEdit(usuario)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant={usuario.status === "ativo" ? "destructive" : "default"}
            onClick={() => onToggleStatus(usuario.id)}
            className="flex-1"
          >
            {usuario.status === "ativo" ? (
              <>
                <UserX className="h-4 w-4 mr-2" />
                Suspender
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export function UsuariosManager() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const data = await ManagerDataService.getUsuarios();
        setUsuarios(data);
        setFilteredUsuarios(data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  useEffect(() => {
    let filtered = usuarios;

    if (searchTerm) {
      filtered = filtered.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (tipoFilter !== "all") {
      filtered = filtered.filter((usuario) => usuario.tipo === tipoFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((usuario) => usuario.status === statusFilter);
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, tipoFilter, statusFilter]);

  const handleSaveUsuario = (userData: Partial<Usuario>) => {
    if (editingUsuario) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === editingUsuario.id ? { ...u, ...userData } : u,
        ),
      );
    } else {
      const newUsuario: Usuario = {
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString().split("T")[0],
        ...userData,
      } as Usuario;
      setUsuarios((prev) => [...prev, newUsuario]);
    }
    setShowForm(false);
    setEditingUsuario(null);
  };

  const handleToggleStatus = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status:
                u.status === "ativo"
                  ? "suspenso"
                  : ("ativo" as Usuario["status"]),
            }
          : u,
      ),
    );
    setSelectedUsuario(null);
  };

  const handleEditUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setSelectedUsuario(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie médicos, enfermeiras, secretárias e pacientes
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usuarios.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuários cadastrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Médicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {usuarios.filter((u) => u.tipo === "medico").length}
            </div>
            <p className="text-xs text-muted-foreground">Ativos no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Enfermeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {usuarios.filter((u) => u.tipo === "enfermeira").length}
            </div>
            <p className="text-xs text-muted-foreground">Cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Secretárias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {usuarios.filter((u) => u.tipo === "secretaria").length}
            </div>
            <p className="text-xs text-muted-foreground">Ativas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {usuarios.filter((u) => u.tipo === "paciente").length}
            </div>
            <p className="text-xs text-muted-foreground">Registrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="medico">Médicos</SelectItem>
                <SelectItem value="enfermeira">Enfermeiras</SelectItem>
                <SelectItem value="secretaria">Secretárias</SelectItem>
                <SelectItem value="paciente">Pacientes</SelectItem>
                <SelectItem value="gestor">Gestores</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
                <SelectItem value="suspenso">Suspensos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Usuários Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredUsuarios.length})</CardTitle>
          <CardDescription>
            Lista de todos os usuários com filtros aplicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando usuários...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      {usuario.nome}
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.telefone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {usuario.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{usuario.especialidade || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          usuario.status === "ativo"
                            ? "outline"
                            : usuario.status === "inativo"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {usuario.status === "ativo" && "Ativo"}
                        {usuario.status === "inativo" && "Inativo"}
                        {usuario.status === "suspenso" && "Suspenso"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {usuario.ultimoLogin
                        ? new Date(usuario.ultimoLogin).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUsuario(usuario)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        {selectedUsuario && (
                          <UsuarioDetails
                            usuario={selectedUsuario}
                            onClose={() => setSelectedUsuario(null)}
                            onEdit={handleEditUsuario}
                            onToggleStatus={handleToggleStatus}
                          />
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <UsuarioForm
          usuario={editingUsuario || undefined}
          onSave={handleSaveUsuario}
          onClose={() => {
            setShowForm(false);
            setEditingUsuario(null);
          }}
        />
      </Dialog>
    </div>
  );
}
