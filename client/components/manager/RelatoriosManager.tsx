import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import {
  RelatorioConsulta,
  DesempenhoMedico,
  ReceitaPeriodo,
  TaxaComparecimento,
} from "@shared/manager-types";
import ManagerDataService from "@/services/managerData";

export function RelatoriosManager() {
  const [relatoriosConsulta, setRelatoriosConsulta] = useState<
    RelatorioConsulta[]
  >([]);
  const [desempenhoMedicos, setDesempenhoMedicos] = useState<
    DesempenhoMedico[]
  >([]);
  const [receitaPeriodo, setReceitaPeriodo] = useState<ReceitaPeriodo[]>([]);
  const [taxaComparecimento, setTaxaComparecimento] = useState<
    TaxaComparecimento[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatorios = async () => {
      try {
        const [consultasData, medicosData, receitaData, taxaData] =
          await Promise.all([
            ManagerDataService.getRelatoriosConsulta(),
            ManagerDataService.getDesempenhoMedicos(),
            ManagerDataService.getReceitaPeriodo(),
            ManagerDataService.getTaxaComparecimento(),
          ]);

        setRelatoriosConsulta(consultasData);
        setDesempenhoMedicos(medicosData);
        setReceitaPeriodo(receitaData);
        setTaxaComparecimento(taxaData);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatorios();
  }, []);

  const handleExportPDF = () => {
    console.log("Exportar PDF");
  };

  if (loading) {
    return <div className="text-center py-8">Carregando relatórios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Estatísticas</h2>
          <p className="text-muted-foreground">
            Análises detalhadas do desempenho da clínica
          </p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="mes">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Consultas por Especialidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Consultas por Especialidade</span>
            </CardTitle>
            <CardDescription>
              Distribuição das consultas realizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosConsulta.map((relatorio) => (
                <div key={relatorio.especialidade} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {relatorio.especialidade}
                    </span>
                    <div className="text-right">
                      <span className="font-bold">{relatorio.total}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({relatorio.percentual}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${relatorio.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Desempenho dos Médicos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Desempenho dos Médicos</span>
            </CardTitle>
            <CardDescription>Avaliação e produtividade médica</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {desempenhoMedicos.map((medico) => (
                <div key={medico.medicoId} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{medico.medicoNome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {medico.especialidade}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-bold">
                          {medico.avaliacaoMedia.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Consultas realizadas:</span>
                    <span className="font-medium">{medico.totalConsultas}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Receita por Período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Receita por Período</span>
            </CardTitle>
            <CardDescription>Evolução financeira mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receitaPeriodo.map((periodo) => (
                <div key={periodo.mes} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {new Date(periodo.mes + "-01").toLocaleDateString(
                        "pt-BR",
                        {
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-bold text-green-600">
                        {periodo.lucro.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Receita</span>
                      <p className="font-medium text-green-600">
                        {periodo.receita.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Despesas</span>
                      <p className="font-medium text-red-600">
                        {periodo.despesas.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margem</span>
                      <p className="font-medium">
                        {((periodo.lucro / periodo.receita) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Comparecimento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Taxa de Comparecimento</span>
            </CardTitle>
            <CardDescription>
              Percentual de consultas realizadas vs agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxaComparecimento.map((taxa) => (
                <div key={taxa.mes} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {new Date(taxa.mes + "-01").toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-bold text-blue-600">
                      {taxa.taxa.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${taxa.taxa}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Agendadas: {taxa.agendadas}</span>
                    <span>Realizadas: {taxa.realizadas}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
