import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Search, 
  Filter,
  Plus,
  CreditCard,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Stethoscope,
  Save,
  Send,
  Building,
  Phone,
  Mail,
  Printer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'pix' | 'insurance' | 'transfer';
  services: InvoiceService[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  notes?: string;
  observations?: string;
}

interface InvoiceService {
  id: string;
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: 'consultation' | 'procedure' | 'exam' | 'medication' | 'other';
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    patientId: 'p_001',
    patientName: 'Maria Silva Santos',
    patientEmail: 'maria.silva@email.com',
    patientPhone: '(11) 99999-1234',
    doctorId: 'current_doctor',
    doctorName: 'Dr. João Carvalho',
    issueDate: '2024-01-15',
    dueDate: '2024-01-25',
    paymentDate: '2024-01-20',
    status: 'paid',
    paymentMethod: 'card',
    services: [
      {
        id: 's_001',
        description: 'Consulta Cardiológica',
        code: 'CONS-001',
        quantity: 1,
        unitPrice: 250.00,
        total: 250.00,
        category: 'consultation'
      },
      {
        id: 's_002',
        description: 'Eletrocardiograma',
        code: 'ECG-001',
        quantity: 1,
        unitPrice: 100.00,
        total: 100.00,
        category: 'exam'
      }
    ],
    subtotal: 350.00,
    discount: 0,
    tax: 0,
    total: 350.00,
    notes: 'Pagamento realizado via cartão de crédito.'
  },
  {
    id: 'INV-002',
    patientId: 'p_002',
    patientName: 'Carlos Oliveira',
    patientEmail: 'carlos@email.com',
    patientPhone: '(11) 99999-5678',
    doctorId: 'current_doctor',
    doctorName: 'Dr. João Carvalho',
    issueDate: '2024-01-14',
    dueDate: '2024-01-24',
    status: 'sent',
    services: [
      {
        id: 's_003',
        description: 'Consulta de Retorno',
        code: 'CONS-002',
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00,
        category: 'consultation'
      }
    ],
    subtotal: 150.00,
    discount: 15.00,
    tax: 0,
    total: 135.00,
    observations: 'Desconto de 10% para consulta de retorno.'
  }
];

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onStatusUpdate: (invoiceId: string, status: Invoice['status'], data?: any) => void;
  onGeneratePDF: (invoice: Invoice) => void;
}

function InvoiceDetails({ invoice, onClose, onStatusUpdate, onGeneratePDF }: InvoiceDetailsProps) {
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho', icon: FileText },
    sent: { color: 'bg-blue-100 text-blue-800', label: 'Enviada', icon: Send },
    paid: { color: 'bg-green-100 text-green-800', label: 'Paga', icon: CheckCircle },
    overdue: { color: 'bg-red-100 text-red-800', label: 'Vencida', icon: AlertTriangle },
    cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelada', icon: AlertTriangle }
  };

  const StatusIcon = statusConfig[invoice.status].icon;

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await onGeneratePDF(invoice);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Fatura {invoice.id}</span>
        </DialogTitle>
        <DialogDescription>
          Detalhes e ações da fatura
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="preview">Visualização</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Dados do Paciente</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {invoice.patientName}</p>
                <p><strong>Email:</strong> {invoice.patientEmail}</p>
                <p><strong>Telefone:</strong> {invoice.patientPhone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Informações da Fatura</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Data de Emissão:</strong> {format(new Date(invoice.issueDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                <p><strong>Data de Vencimento:</strong> {format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                {invoice.paymentDate && (
                  <p><strong>Data de Pagamento:</strong> {format(new Date(invoice.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                )}
                <div className="flex items-center space-x-2">
                  <strong>Status:</strong>
                  <Badge className={statusConfig[invoice.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[invoice.status].label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Serviços Prestados</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-center">Qtd</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>{service.code || '-'}</TableCell>
                    <TableCell className="text-center">{service.quantity}</TableCell>
                    <TableCell className="text-right">
                      R$ {service.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {service.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 space-y-2 text-right">
              <div className="flex justify-end space-x-4">
                <span>Subtotal:</span>
                <span>R$ {invoice.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-end space-x-4 text-red-600">
                  <span>Desconto:</span>
                  <span>- R$ {invoice.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {invoice.tax > 0 && (
                <div className="flex justify-end space-x-4">
                  <span>Impostos:</span>
                  <span>R$ {invoice.tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-end space-x-4 text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {(invoice.notes || invoice.observations) && (
            <div className="space-y-4">
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notas</h3>
                  <p className="text-sm bg-muted p-3 rounded">{invoice.notes}</p>
                </div>
              )}
              {invoice.observations && (
                <div>
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <p className="text-sm bg-muted p-3 rounded">{invoice.observations}</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div id={`invoice-${invoice.id}`} className="bg-white p-8 border rounded-lg">
            {/* Cabeçalho da Fatura */}
            <div className="flex items-start justify-between border-b pb-6 mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Building className="h-8 w-8 text-clinic-primary" />
                  <div>
                    <h1 className="text-2xl font-bold text-clinic-primary">Clínica Bem Cuidar</h1>
                    <p className="text-sm text-muted-foreground">Cuidando da sua saúde com excelência</p>
                  </div>
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
                <p className="text-lg font-mono">{invoice.id}</p>
                <div className="mt-2">
                  <Badge className={statusConfig[invoice.status].color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[invoice.status].label}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Informações do Paciente e Médico */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Dados do Paciente</span>
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Nome:</strong> {invoice.patientName}</p>
                  <p><strong>Email:</strong> {invoice.patientEmail}</p>
                  <p><strong>Telefone:</strong> {invoice.patientPhone}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Médico Responsável</span>
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Nome:</strong> {invoice.doctorName}</p>
                  <p><strong>CRM:</strong> 123456</p>
                  <p><strong>Especialidade:</strong> Cardiologia</p>
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
              <div>
                <strong>Data de Emissão:</strong>
                <p>{format(new Date(invoice.issueDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              <div>
                <strong>Data de Vencimento:</strong>
                <p>{format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
              {invoice.paymentDate && (
                <div>
                  <strong>Data de Pagamento:</strong>
                  <p>{format(new Date(invoice.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                </div>
              )}
            </div>

            {/* Serviços */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Serviços Prestados</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Descrição</th>
                    <th className="border border-gray-300 p-2 text-center">Qtd</th>
                    <th className="border border-gray-300 p-2 text-right">Valor Unit.</th>
                    <th className="border border-gray-300 p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.services.map((service) => (
                    <tr key={service.id}>
                      <td className="border border-gray-300 p-2">{service.description}</td>
                      <td className="border border-gray-300 p-2 text-center">{service.quantity}</td>
                      <td className="border border-gray-300 p-2 text-right">
                        R$ {service.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        R$ {service.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="text-right space-y-1">
                  <p>
                    <strong>Subtotal: </strong>
                    R$ {invoice.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {invoice.discount > 0 && (
                    <p className="text-red-600">
                      <strong>Desconto: </strong>
                      - R$ {invoice.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                  <p className="text-xl font-bold text-clinic-primary">
                    <strong>Total: R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé */}
            <div className="border-t pt-4 mt-6 text-xs text-muted-foreground">
              <p><strong>Observações:</strong></p>
              <p>• Esta fatura é válida por 30 dias após a data de emissão</p>
              <p>• Em caso de dúvidas, entre em contato conosco</p>
              <p>• Mantenha este documento para seus registros</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-4">
            {invoice.status === 'draft' && (
              <Button onClick={() => onStatusUpdate(invoice.id, 'sent')} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Enviar Fatura
              </Button>
            )}
            
            {invoice.status === 'sent' && (
              <div className="space-y-2">
                <Button onClick={() => onStatusUpdate(invoice.id, 'paid', { paymentDate: new Date().toISOString().split('T')[0] })} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Marcar como Paga
                </Button>
                <Button variant="outline" onClick={() => onStatusUpdate(invoice.id, 'overdue')} className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Marcar como Vencida
                </Button>
              </div>
            )}
            
            <Button onClick={handleGeneratePDF} disabled={generatingPDF} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {generatingPDF ? 'Gerando PDF...' : 'Baixar PDF'}
            </Button>
            
            <Button variant="outline" className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir Fatura
            </Button>
            
            {invoice.status !== 'cancelled' && (
              <Button variant="destructive" onClick={() => onStatusUpdate(invoice.id, 'cancelled')} className="w-full">
                Cancelar Fatura
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fechar
        </Button>
      </div>
    </DialogContent>
  );
}

async function generateInvoicePDF(invoice: Invoice) {
  const element = document.getElementById(`invoice-${invoice.id}`);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;
    
    const x = (pdfWidth - finalWidth) / 2;
    const y = (pdfHeight - finalHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
    pdf.save(`fatura_${invoice.id}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
}

export default function DoctorBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    let filtered = invoices;

    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(invoice => 
            new Date(invoice.issueDate).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(invoice => 
            new Date(invoice.issueDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(invoice => 
            new Date(invoice.issueDate) >= filterDate
          );
          break;
      }
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  const handleStatusUpdate = (invoiceId: string, status: Invoice['status'], data?: any) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId ? { 
        ...invoice, 
        status,
        ...data
      } : invoice
    ));
  };

  const handleGeneratePDF = async (invoice: Invoice) => {
    await generateInvoicePDF(invoice);
  };

  const statusCounts = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    cancelled: invoices.filter(i => i.status === 'cancelled').length
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((sum, i) => sum + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Faturas</h2>
          <p className="text-muted-foreground">
            Gerencie faturas e pagamentos dos pacientes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Fatura
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.paid} faturas pagas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.sent} faturas enviadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">{statusCounts.overdue} faturas vencidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente ou número..."
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
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="sent">Enviadas</SelectItem>
                <SelectItem value="paid">Pagas</SelectItem>
                <SelectItem value="overdue">Vencidas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Faturas */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Data Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => {
                const statusConfig = {
                  draft: { color: 'bg-gray-100 text-gray-800', label: 'Rascunho', icon: FileText },
                  sent: { color: 'bg-blue-100 text-blue-800', label: 'Enviada', icon: Send },
                  paid: { color: 'bg-green-100 text-green-800', label: 'Paga', icon: CheckCircle },
                  overdue: { color: 'bg-red-100 text-red-800', label: 'Vencida', icon: AlertTriangle },
                  cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Cancelada', icon: AlertTriangle }
                };

                const StatusIcon = statusConfig[invoice.status].icon;

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.issueDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[invoice.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold">
                      R$ {invoice.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Button>
                        </DialogTrigger>
                        {selectedInvoice && (
                          <InvoiceDetails
                            invoice={selectedInvoice}
                            onClose={() => setSelectedInvoice(null)}
                            onStatusUpdate={handleStatusUpdate}
                            onGeneratePDF={handleGeneratePDF}
                          />
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
