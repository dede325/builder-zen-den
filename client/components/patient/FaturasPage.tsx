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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { FaturaPaciente } from "@shared/patient-types";
import PatientDataService from "@/services/patientData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface FaturaDetailsProps {
  fatura: FaturaPaciente;
  onClose: () => void;
  onDownloadPDF: () => void;
}

function FaturaDetails({ fatura, onClose, onDownloadPDF }: FaturaDetailsProps) {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const statusConfig = {
    pago: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    pendente: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    vencido: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
    cancelado: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle },
  };

  const StatusIcon = statusConfig[fatura.status].icon;

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generateFaturaPDF(fatura);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Detalhes da Fatura</span>
        </DialogTitle>
        <DialogDescription>
          Fatura #{fatura.id} - Clínica Bem Cuidar
        </DialogDescription>
      </DialogHeader>

      <div id={`fatura-${fatura.id}`} className="space-y-6 bg-white p-6">
        {/* Cabeçalho da Fatura */}
        <div className="flex items-start justify-between border-b pb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Building className="h-6 w-6 text-clinic-primary" />
              <h1 className="text-2xl font-bold text-clinic-primary">
                Clínica Bem Cuidar
              </h1>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 3333-4444</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@bemcuidar.com.br</span>
              </div>
              <p>Rua da Saúde, 123 - São Paulo - SP</p>
              <p>CNPJ: 12.345.678/0001-90</p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-xl font-bold">FATURA</h2>
            <p className="text-lg font-mono">#{fatura.id}</p>
            <div className="mt-2">
              <Badge className={statusConfig[fatura.status].color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {fatura.status === "pago" && "PAGO"}
                {fatura.status === "pendente" && "PENDENTE"}
                {fatura.status === "vencido" && "VENCIDO"}
                {fatura.status === "cancelado" && "CANCELADO"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Informações do Paciente e Datas */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Dados do Paciente</span>
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Nome:</strong> Maria Silva Santos
              </p>
              <p>
                <strong>Email:</strong> maria.silva@email.com
              </p>
              <p>
                <strong>Telefone:</strong> (11) 99999-1234
              </p>
              <p>
                <strong>Convênio:</strong> Plano Saúde ABC
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Informações da Fatura</span>
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Data de Emissão:</strong>{" "}
                {format(new Date(fatura.data_emissao), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
              <p>
                <strong>Data de Vencimento:</strong>{" "}
                {format(new Date(fatura.data_vencimento), "dd/MM/yyyy", {
                  locale: ptBR,
                })}
              </p>
              {fatura.data_pagamento && (
                <p>
                  <strong>Data de Pagamento:</strong>{" "}
                  {format(new Date(fatura.data_pagamento), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </p>
              )}
              {fatura.forma_pagamento && (
                <p>
                  <strong>Forma de Pagamento:</strong>{" "}
                  <span className="capitalize">{fatura.forma_pagamento}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div>
          <h3 className="font-semibold mb-3">Serviços Prestados</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Qtd</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fatura.servicos.map((servico) => (
                <TableRow key={servico.id}>
                  <TableCell>{servico.descricao}</TableCell>
                  <TableCell className="text-center">
                    {servico.quantidade}
                  </TableCell>
                  <TableCell className="text-right">
                    R${" "}
                    {servico.valor_unitario.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R${" "}
                    {servico.valor_total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="text-right">
              <p className="text-lg">
                <strong>Subtotal: </strong>
                R${" "}
                {fatura.servicos
                  .reduce((sum, s) => sum + s.valor_total, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xl font-bold text-clinic-primary">
                <strong>
                  Total: R${" "}
                  {fatura.valor.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="border-t pt-4 text-sm text-muted-foreground">
          <p>
            <strong>Observações:</strong>
          </p>
          <p>• Esta fatura é válida por 30 dias após a data de emissão</p>
          <p>• Em caso de dúvidas, entre em contato conosco</p>
          <p>• Mantenha este documento para seus registros</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fechar
        </Button>
        <Button
          onClick={handleGeneratePDF}
          disabled={generatingPDF}
          className="flex-1"
        >
          <Download className="h-4 w-4 mr-2" />
          {generatingPDF ? "Gerando PDF..." : "Baixar PDF"}
        </Button>
      </div>
    </DialogContent>
  );
}

async function generateFaturaPDF(fatura: FaturaPaciente) {
  const element = document.getElementById(`fatura-${fatura.id}`);
  if (!element) return;

  try {
    // Capturar o elemento como imagem
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    // Criar PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calcular dimensões mantendo proporção
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    // Centralizar na página
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

    // Baixar PDF
    pdf.save(`fatura_${fatura.id}_${format(new Date(), "yyyy-MM-dd")}.pdf`);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
}

export default function FaturasPage() {
  const [faturas, setFaturas] = useState<FaturaPaciente[]>([]);
  const [filteredFaturas, setFilteredFaturas] = useState<FaturaPaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFatura, setSelectedFatura] = useState<FaturaPaciente | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadFaturas = async () => {
      try {
        const data = await PatientDataService.getFaturas("pac_001");
        setFaturas(data);
        setFilteredFaturas(data);
      } catch (error) {
        console.error("Erro ao carregar faturas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFaturas();
  }, []);

  useEffect(() => {
    let filtered = faturas;

    if (searchTerm) {
      filtered = filtered.filter(
        (fatura) =>
          fatura.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fatura.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((fatura) => fatura.status === statusFilter);
    }

    setFilteredFaturas(filtered);
  }, [faturas, searchTerm, statusFilter]);

  const statusCounts = {
    total: faturas.length,
    pago: faturas.filter((f) => f.status === "pago").length,
    pendente: faturas.filter((f) => f.status === "pendente").length,
    vencido: faturas.filter((f) => f.status === "vencido").length,
  };

  const totalPago = faturas
    .filter((f) => f.status === "pago")
    .reduce((sum, f) => sum + f.valor, 0);
  const totalPendente = faturas
    .filter((f) => f.status === "pendente")
    .reduce((sum, f) => sum + f.valor, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Minhas Faturas</h2>
          <p className="text-muted-foreground">
            Visualize e baixe suas faturas em PDF
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Faturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">Emitidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R${" "}
              {totalPago.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.pago} faturas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              R${" "}
              {totalPendente.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {statusCounts.pendente} faturas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.vencido}
            </div>
            <p className="text-xs text-muted-foreground">Precisam atenção</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por descrição ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pago">Pagas</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="vencido">Vencidas</SelectItem>
                <SelectItem value="cancelado">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas ({filteredFaturas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFaturas.map((fatura) => {
              const statusConfig = {
                pago: {
                  color: "bg-green-100 text-green-800 border-green-200",
                  icon: CheckCircle,
                },
                pendente: {
                  color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                  icon: Clock,
                },
                vencido: {
                  color: "bg-red-100 text-red-800 border-red-200",
                  icon: AlertTriangle,
                },
                cancelado: {
                  color: "bg-gray-100 text-gray-800 border-gray-200",
                  icon: AlertTriangle,
                },
              };

              const StatusIcon = statusConfig[fatura.status].icon;

              return (
                <div
                  key={fatura.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">Fatura #{fatura.id}</h3>
                        <Badge className={statusConfig[fatura.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {fatura.status === "pago" && "Pago"}
                          {fatura.status === "pendente" && "Pendente"}
                          {fatura.status === "vencido" && "Vencido"}
                          {fatura.status === "cancelado" && "Cancelado"}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {fatura.descricao}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Valor: </span>
                          <span className="font-medium text-lg">
                            R${" "}
                            {fatura.valor.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Vencimento:{" "}
                          </span>
                          <span>
                            {format(
                              new Date(fatura.data_vencimento),
                              "dd/MM/yyyy",
                              { locale: ptBR },
                            )}
                          </span>
                        </div>
                      </div>

                      {fatura.forma_pagamento && (
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">
                            Pagamento:{" "}
                          </span>
                          <span className="capitalize">
                            {fatura.forma_pagamento}
                          </span>
                          {fatura.data_pagamento && (
                            <span className="text-muted-foreground">
                              {" "}
                              em{" "}
                              {format(
                                new Date(fatura.data_pagamento),
                                "dd/MM/yyyy",
                                { locale: ptBR },
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFatura(fatura)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                        </DialogTrigger>
                        {selectedFatura && (
                          <FaturaDetails
                            fatura={selectedFatura}
                            onClose={() => setSelectedFatura(null)}
                            onDownloadPDF={() =>
                              generateFaturaPDF(selectedFatura)
                            }
                          />
                        )}
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFaturas.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                Nenhuma fatura encontrada
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Tente ajustar os filtros para ver mais resultados."
                  : "Você ainda não possui faturas cadastradas."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
