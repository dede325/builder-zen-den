import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  DollarSign,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  DashboardStats,
  Consulta,
  Exame,
  ItemEstoque,
} from "@shared/manager-types";
import ManagerDataService from "@/services/managerData";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400",
    yellow:
      "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400",
    red: "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400",
    purple:
      "text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && trendValue && (
            <div
              className={cn("flex items-center", {
                "text-green-600": trend === "up",
                "text-red-600": trend === "down",
                "text-gray-600": trend === "stable",
              })}
            >
              {trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
              {trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  color?: string;
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  action,
  color = "bg-primary",
}: QuickActionCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={action}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-full text-white", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ManagerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [consultasHoje, setConsultasHoje] = useState<Consulta[]>([]);
  const [examesPendentes, setExamesPendentes] = useState<Exame[]>([]);
  const [estoqueAlerta, setEstoqueAlerta] = useState<ItemEstoque[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, consultasData, examesData, estoqueData] =
          await Promise.all([
            ManagerDataService.getDashboardStats(),
            ManagerDataService.getConsultas(),
            ManagerDataService.getExames(),
            ManagerDataService.getEstoque(),
          ]);

        setStats(statsData);
        setConsultasHoje(
          consultasData.filter(
            (c) => c.data === new Date().toISOString().split("T")[0],
          ),
        );
        setExamesPendentes(examesData.filter((e) => e.status === "pendente"));
        setEstoqueAlerta(
          estoqueData.filter((i) => i.quantidade <= i.quantidadeMinima),
        );
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Consultas Hoje"
          value={stats.consultasHoje}
          description="Agendadas para hoje"
          icon={Calendar}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <StatsCard
          title="Exames Pendentes"
          value={stats.examesPendentes}
          description="Aguardando resultado"
          icon={FileText}
          trend="down"
          trendValue="-3%"
          color="yellow"
        />
        <StatsCard
          title="Faturamento Mês"
          value={`R$ ${stats.faturamentoMes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          description="Janeiro 2024"
          icon={DollarSign}
          trend="up"
          trendValue="+8%"
          color="green"
        />
        <StatsCard
          title="Pacientes Ativos"
          value={stats.pacientesAtivos}
          description="Com consultas recentes"
          icon={Users}
          trend="up"
          trendValue="+5%"
          color="purple"
        />
        <StatsCard
          title="Mensagens"
          value={stats.mensagensNaoLidas}
          description="Não lidas"
          icon={MessageSquare}
          trend="stable"
          trendValue="0"
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <QuickActionCard
          title="Nova Consulta"
          description="Agendar consulta médica"
          icon={Calendar}
          action={() => {}}
          color="bg-blue-600"
        />
        <QuickActionCard
          title="Novo Exame"
          description="Solicitar exame para paciente"
          icon={FileText}
          action={() => {}}
          color="bg-green-600"
        />
        <QuickActionCard
          title="Cadastrar Usuário"
          description="Adicionar novo funcionário"
          icon={Users}
          action={() => {}}
          color="bg-purple-600"
        />
        <QuickActionCard
          title="Ver Relatórios"
          description="Análises e estatísticas"
          icon={Activity}
          action={() => {}}
          color="bg-orange-600"
        />
      </div>

      {/* Recent Activities */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Consultas de Hoje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Consultas de Hoje</span>
            </CardTitle>
            <CardDescription>
              {consultasHoje.length} consulta(s) agendada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {consultasHoje.slice(0, 3).map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {consulta.pacienteNome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {consulta.hora} - {consulta.especialidade}
                    </p>
                  </div>
                  <Badge
                    variant={
                      consulta.status === "em_andamento"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {consulta.status === "agendada" && "Agendada"}
                    {consulta.status === "em_andamento" && "Em Andamento"}
                    {consulta.status === "concluida" && "Concluída"}
                  </Badge>
                </div>
              ))}
              {consultasHoje.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  Ver todas ({consultasHoje.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Exames Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Exames Pendentes</span>
            </CardTitle>
            <CardDescription>
              {examesPendentes.length} exame(s) aguardando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examesPendentes.slice(0, 3).map((exame) => (
                <div
                  key={exame.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{exame.pacienteNome}</p>
                    <p className="text-xs text-muted-foreground">
                      {exame.tipoExame}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <Clock className="h-3 w-3" />
                    <span>Pendente</span>
                  </Badge>
                </div>
              ))}
              {examesPendentes.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  Ver todos ({examesPendentes.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Estoque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Alertas de Estoque</span>
            </CardTitle>
            <CardDescription>
              {estoqueAlerta.length} item(ns) em falta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estoqueAlerta.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{item.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Estoque: {item.quantidade} {item.unidade}
                    </p>
                  </div>
                  <Badge variant="destructive">Baixo</Badge>
                </div>
              ))}
              {estoqueAlerta.length > 3 && (
                <Button variant="outline" size="sm" className="w-full">
                  Ver todos ({estoqueAlerta.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
