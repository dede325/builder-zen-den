import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  FileText, 
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  CheckCircle
} from 'lucide-react';
import { Fatura, ReceitaPeriodo } from '@shared/manager-types';
import ManagerDataService from '@/services/managerData';
import { cn } from '@/lib/utils';

interface FaturaDetailsProps {
  fatura: Fatura;
  onClose: () => void;
  onMarkAsPaid: (id: string, formaPagamento: Fatura['formaPagamento']) => void;
}

function FaturaDetails({ fatura, onClose, onMarkAsPaid }: FaturaDetailsProps) {
  const [formaPagamento, setFormaPagamento] = useState<Fatura['formaPagamento']>('dinheiro');

  const handleMarkAsPaid = () => {
    onMarkAsPaid(fatura.id, formaPagamento);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Detalhes da Fatura</DialogTitle>
        <DialogDescription>
          Informações de cobrança e pagamento
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Paciente</label>
            <p className="text-lg">{fatura.pacienteNome}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Valor</label>
            <p className="text-lg font-bold text-green-600">
              R$ {fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Data de Vencimento</label>
            <p>{new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}</p>
          </div>
          {fatura.dataPagamento && (
            <div>
              <label className="text-sm font-medium">Data de Pagamento</label>
              <p>{new Date(fatura.dataPagamento).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge variant={
              fatura.status === 'pago' ? 'outline' :
              fatura.status === 'pendente' ? 'secondary' :
              fatura.status === 'vencido' ? 'destructive' : 'default'
            }>
              {fatura.status === 'pago' && 'Pago'}
              {fatura.status === 'pendente' && 'Pendente'}
              {fatura.status === 'vencido' && 'Vencido'}
              {fatura.status === 'cancelado' && 'Cancelado'}
            </Badge>
          </div>
          {fatura.formaPagamento && (
            <div>
              <label className="text-sm font-medium">Forma de Pagamento</label>
              <p className="capitalize">{fatura.formaPagamento}</p>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Descrição</label>
          <p className="mt-1 p-3 bg-muted rounded-lg">{fatura.descricao}</p>
        </div>

        {fatura.status === 'pendente' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Forma de Pagamento</label>
              <Select value={formaPagamento} onValueChange={(value) => setFormaPagamento(value as Fatura['formaPagamento'])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="convenio">Convênio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleMarkAsPaid} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Pago
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Boleto
              </Button>
            </div>
          </div>
        )}

        {fatura.status === 'pago' && (
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download Comprovante
          </Button>
        )}
      </div>
    </DialogContent>
  );
}

export function FinanceiroManager() {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [filteredFaturas, setFilteredFaturas] = useState<Fatura[]>([]);
  const [receitaPeriodo, setReceitaPeriodo] = useState<ReceitaPeriodo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [faturasData, receitaData] = await Promise.all([
          ManagerDataService.getFaturas(),
          ManagerDataService.getReceitaPeriodo()
        ]);
        setFaturas(faturasData);
        setFilteredFaturas(faturasData);
        setReceitaPeriodo(receitaData);
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = faturas;

    if (searchTerm) {
      filtered = filtered.filter(fatura =>
        fatura.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fatura.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(fatura => fatura.status === statusFilter);
    }

    setFilteredFaturas(filtered);
  }, [faturas, searchTerm, statusFilter]);

  const handleMarkAsPaid = (id: string, formaPagamento: Fatura['formaPagamento']) => {
    setFaturas(prev => prev.map(f => 
      f.id === id ? { 
        ...f, 
        status: 'pago' as const,
        dataPagamento: new Date().toISOString().split('T')[0],
        formaPagamento
      } : f
    ));
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Paciente', 'Valor', 'Data Vencimento', 'Status', 'Descrição'].join(','),
      ...filteredFaturas.map(f => [
        f.pacienteNome,
        f.valor,
        f.dataVencimento,
        f.status,
        f.descricao
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faturas.csv';
    a.click();
  };

  const totalReceita = faturas.filter(f => f.status === 'pago').reduce((sum, f) => sum + f.valor, 0);
  const totalPendente = faturas.filter(f => f.status === 'pendente').reduce((sum, f) => sum + f.valor, 0);
  const totalVencido = faturas.filter(f => f.status === 'vencido').reduce((sum, f) => sum + f.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão Financeira</h2>
          <p className="text-muted-foreground">
            Controle de faturas, pagamentos e relatórios financeiros
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fatura
        </Button>
      </div>

      <Tabs defaultValue="faturas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="faturas" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Faturas pagas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pendente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Aguardando pagamento</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vencido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">Pagamentos em atraso</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{faturas.length}</div>
                <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
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
                    placeholder="Buscar por paciente ou descrição..."
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
                    <SelectItem value="pendente">Pendentes</SelectItem>
                    <SelectItem value="pago">Pagas</SelectItem>
                    <SelectItem value="vencido">Vencidas</SelectItem>
                    <SelectItem value="cancelado">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Faturas Table */}
          <Card>
            <CardHeader>
              <CardTitle>Faturas ({filteredFaturas.length})</CardTitle>
              <CardDescription>
                Lista de todas as faturas com filtros aplicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando faturas...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Forma Pagto</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaturas.map((fatura) => (
                      <TableRow key={fatura.id}>
                        <TableCell className="font-medium">{fatura.pacienteNome}</TableCell>
                        <TableCell className="font-bold">
                          R$ {fatura.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          {new Date(fatura.dataVencimento).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          {fatura.dataPagamento 
                            ? new Date(fatura.dataPagamento).toLocaleDateString('pt-BR')
                            : '-'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            fatura.status === 'pago' ? 'outline' :
                            fatura.status === 'pendente' ? 'secondary' :
                            fatura.status === 'vencido' ? 'destructive' : 'default'
                          }>
                            {fatura.status === 'pago' && (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Pago
                              </>
                            )}
                            {fatura.status === 'pendente' && 'Pendente'}
                            {fatura.status === 'vencido' && (
                              <>
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Vencido
                              </>
                            )}
                            {fatura.status === 'cancelado' && 'Cancelado'}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {fatura.formaPagamento || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedFatura(fatura)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              {selectedFatura && (
                                <FaturaDetails
                                  fatura={selectedFatura}
                                  onClose={() => setSelectedFatura(null)}
                                  onMarkAsPaid={handleMarkAsPaid}
                                />
                              )}
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Receita por Período</span>
                </CardTitle>
                <CardDescription>
                  Evolução da receita nos últimos meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receitaPeriodo.map((periodo) => (
                    <div key={periodo.mes} className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {new Date(periodo.mes + '-01').toLocaleDateString('pt-BR', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </span>
                        <Badge variant={periodo.lucro > 0 ? 'outline' : 'destructive'}>
                          {periodo.lucro > 0 ? '+' : ''}
                          {periodo.lucro.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Receita:</span>
                          <p className="font-medium text-green-600">
                            {periodo.receita.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Despesas:</span>
                          <p className="font-medium text-red-600">
                            {periodo.despesas.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lucro:</span>
                          <p className={cn("font-medium", periodo.lucro > 0 ? "text-green-600" : "text-red-600")}>
                            {periodo.lucro.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Formas de Pagamento</span>
                </CardTitle>
                <CardDescription>
                  Distribuição dos métodos de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['dinheiro', 'cartao', 'pix', 'convenio'].map((forma) => {
                    const faturasPorForma = faturas.filter(f => f.formaPagamento === forma && f.status === 'pago');
                    const totalPorForma = faturasPorForma.reduce((sum, f) => sum + f.valor, 0);
                    const percentual = totalReceita > 0 ? (totalPorForma / totalReceita) * 100 : 0;
                    
                    return (
                      <div key={forma} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium">{forma}</span>
                          <span className="text-sm text-muted-foreground">
                            {percentual.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">
                            {totalPorForma.toLocaleString('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            })}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            ({faturasPorForma.length} faturas)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
