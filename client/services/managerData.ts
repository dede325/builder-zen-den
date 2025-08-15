import {
  DashboardStats,
  Consulta,
  Exame,
  Usuario,
  Fatura,
  MensagemInterna,
  ItemEstoque,
  MovimentacaoEstoque,
  RelatorioConsulta,
  DesempenhoMedico,
  ReceitaPeriodo,
  TaxaComparecimento,
  PerfilGestor,
  LogAtividade
} from '@shared/manager-types';

const today = new Date().toISOString().split('T')[0];
const thisMonth = new Date().toISOString().slice(0, 7);

export const mockDashboardStats: DashboardStats = {
  consultasHoje: 24,
  examesPendentes: 8,
  faturamentoMes: 85420.50,
  pacientesAtivos: 1247,
  mensagensNaoLidas: 3
};

export const mockConsultas: Consulta[] = [
  {
    id: '1',
    pacienteId: 'p1',
    pacienteNome: 'Maria Silva',
    medicoId: 'm1',
    medicoNome: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    data: today,
    hora: '08:00',
    status: 'agendada',
    tipo: 'consulta'
  },
  {
    id: '2',
    pacienteId: 'p2',
    pacienteNome: 'Pedro Oliveira',
    medicoId: 'm2',
    medicoNome: 'Dra. Ana Costa',
    especialidade: 'Dermatologia',
    data: today,
    hora: '09:30',
    status: 'em_andamento',
    tipo: 'retorno'
  },
  {
    id: '3',
    pacienteId: 'p3',
    pacienteNome: 'Carla Santos',
    medicoId: 'm1',
    medicoNome: 'Dr. João Santos',
    especialidade: 'Cardiologia',
    data: today,
    hora: '10:00',
    status: 'concluida',
    tipo: 'consulta'
  }
];

export const mockExames: Exame[] = [
  {
    id: 'e1',
    pacienteId: 'p1',
    pacienteNome: 'Maria Silva',
    medicoSolicitante: 'Dr. João Santos',
    tipoExame: 'Eletrocardiograma',
    dataColeta: today,
    status: 'pendente'
  },
  {
    id: 'e2',
    pacienteId: 'p2',
    pacienteNome: 'Pedro Oliveira',
    medicoSolicitante: 'Dra. Ana Costa',
    tipoExame: 'Hemograma Completo',
    dataColeta: '2024-01-10',
    dataResultado: '2024-01-11',
    status: 'resultado_disponivel'
  }
];

export const mockUsuarios: Usuario[] = [
  {
    id: 'm1',
    nome: 'Dr. João Santos',
    email: 'joao.santos@clinica.com',
    telefone: '(11) 99999-1111',
    tipo: 'medico',
    especialidade: 'Cardiologia',
    crm: '123456',
    status: 'ativo',
    dataCadastro: '2023-01-15',
    ultimoLogin: today
  },
  {
    id: 'm2',
    nome: 'Dra. Ana Costa',
    email: 'ana.costa@clinica.com',
    telefone: '(11) 99999-2222',
    tipo: 'medico',
    especialidade: 'Dermatologia',
    crm: '654321',
    status: 'ativo',
    dataCadastro: '2023-02-20',
    ultimoLogin: today
  },
  {
    id: 'e1',
    nome: 'Enfermeira Carolina',
    email: 'carolina@clinica.com',
    telefone: '(11) 99999-3333',
    tipo: 'enfermeira',
    status: 'ativo',
    dataCadastro: '2023-03-10',
    ultimoLogin: today
  }
];

export const mockFaturas: Fatura[] = [
  {
    id: 'f1',
    pacienteId: 'p1',
    pacienteNome: 'Maria Silva',
    valor: 250.00,
    dataVencimento: '2024-01-20',
    status: 'pendente',
    descricao: 'Consulta Cardiologia'
  },
  {
    id: 'f2',
    pacienteId: 'p2',
    pacienteNome: 'Pedro Oliveira',
    valor: 180.00,
    dataVencimento: '2024-01-15',
    dataPagamento: '2024-01-14',
    status: 'pago',
    descricao: 'Consulta Dermatologia',
    formaPagamento: 'cartao'
  }
];

export const mockMensagens: MensagemInterna[] = [
  {
    id: 'msg1',
    remetenteId: 'm1',
    remetenteNome: 'Dr. João Santos',
    destinatarioId: 'gestor1',
    destinatarioNome: 'Gestor Principal',
    assunto: 'Necessário equipamento novo',
    conteudo: 'Precisamos urgentemente de um novo eletrocardi��grafo para o consultório.',
    dataEnvio: today,
    lida: false,
    arquivada: false,
    prioridade: 'alta'
  },
  {
    id: 'msg2',
    remetenteId: 'e1',
    remetenteNome: 'Enfermeira Carolina',
    destinatarioId: 'gestor1',
    destinatarioNome: 'Gestor Principal',
    assunto: 'Estoque baixo',
    conteudo: 'O estoque de seringas está acabando. Precisamos reabastecer.',
    dataEnvio: '2024-01-10',
    lida: false,
    arquivada: false,
    prioridade: 'normal'
  }
];

export const mockEstoque: ItemEstoque[] = [
  {
    id: 'est1',
    nome: 'Seringa 5ml',
    categoria: 'material',
    quantidade: 25,
    quantidadeMinima: 50,
    unidade: 'unidade',
    valorUnitario: 0.80,
    fornecedor: 'MedSupplies'
  },
  {
    id: 'est2',
    nome: 'Paracetamol 500mg',
    categoria: 'medicamento',
    quantidade: 200,
    quantidadeMinima: 100,
    unidade: 'comprimido',
    valorUnitario: 0.15,
    fornecedor: 'FarmaDistribuidora',
    dataValidade: '2025-06-30',
    lote: 'LOT123456'
  }
];

export const mockMovimentacoes: MovimentacaoEstoque[] = [
  {
    id: 'mov1',
    itemId: 'est1',
    itemNome: 'Seringa 5ml',
    tipo: 'saida',
    quantidade: 10,
    motivo: 'Uso em consultas',
    responsavel: 'Enfermeira Carolina',
    data: today
  }
];

export const mockRelatoriosConsulta: RelatorioConsulta[] = [
  { especialidade: 'Cardiologia', total: 45, percentual: 35 },
  { especialidade: 'Dermatologia', total: 32, percentual: 25 },
  { especialidade: 'Pediatria', total: 28, percentual: 22 },
  { especialidade: 'Neurologia', total: 23, percentual: 18 }
];

export const mockDesempenhoMedicos: DesempenhoMedico[] = [
  {
    medicoId: 'm1',
    medicoNome: 'Dr. João Santos',
    totalConsultas: 45,
    avaliacaoMedia: 4.8,
    especialidade: 'Cardiologia'
  },
  {
    medicoId: 'm2',
    medicoNome: 'Dra. Ana Costa',
    totalConsultas: 32,
    avaliacaoMedia: 4.6,
    especialidade: 'Dermatologia'
  }
];

export const mockReceitaPeriodo: ReceitaPeriodo[] = [
  { mes: '2024-01', receita: 85420.50, despesas: 32150.30, lucro: 53270.20 },
  { mes: '2023-12', receita: 78900.00, despesas: 29800.50, lucro: 49099.50 },
  { mes: '2023-11', receita: 82340.75, despesas: 31200.25, lucro: 51140.50 }
];

export const mockTaxaComparecimento: TaxaComparecimento[] = [
  { mes: '2024-01', agendadas: 128, realizadas: 115, taxa: 89.8 },
  { mes: '2023-12', agendadas: 142, realizadas: 128, taxa: 90.1 },
  { mes: '2023-11', agendadas: 136, realizadas: 121, taxa: 89.0 }
];

export const mockPerfilGestor: PerfilGestor = {
  id: 'gestor1',
  nome: 'Carlos Silva',
  email: 'carlos.silva@clinica.com',
  telefone: '(11) 99999-0000',
  cargo: 'Gestor Geral',
  notificacoes: {
    email: true,
    sms: false,
    push: true,
    financeiro: true,
    estoque: true,
    consultas: false
  }
};

export const mockLogsAtividade: LogAtividade[] = [
  {
    id: 'log1',
    usuarioId: 'gestor1',
    usuarioNome: 'Carlos Silva',
    acao: 'Aprovação de consulta',
    modulo: 'Consultas',
    detalhes: 'Aprovou consulta ID: 1',
    data: today,
    ip: '192.168.1.100'
  }
];

class ManagerDataService {
  private static instance: ManagerDataService;

  private constructor() {}

  static getInstance(): ManagerDataService {
    if (!ManagerDataService.instance) {
      ManagerDataService.instance = new ManagerDataService();
    }
    return ManagerDataService.instance;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDashboardStats), 500);
    });
  }

  async getConsultas(): Promise<Consulta[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockConsultas), 500);
    });
  }

  async getExames(): Promise<Exame[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExames), 500);
    });
  }

  async getUsuarios(): Promise<Usuario[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockUsuarios), 500);
    });
  }

  async getFaturas(): Promise<Fatura[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFaturas), 500);
    });
  }

  async getMensagens(): Promise<MensagemInterna[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMensagens), 500);
    });
  }

  async getEstoque(): Promise<ItemEstoque[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockEstoque), 500);
    });
  }

  async getMovimentacoes(): Promise<MovimentacaoEstoque[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMovimentacoes), 500);
    });
  }

  async getRelatoriosConsulta(): Promise<RelatorioConsulta[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRelatoriosConsulta), 500);
    });
  }

  async getDesempenhoMedicos(): Promise<DesempenhoMedico[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDesempenhoMedicos), 500);
    });
  }

  async getReceitaPeriodo(): Promise<ReceitaPeriodo[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReceitaPeriodo), 500);
    });
  }

  async getTaxaComparecimento(): Promise<TaxaComparecimento[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTaxaComparecimento), 500);
    });
  }

  async getPerfilGestor(): Promise<PerfilGestor> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPerfilGestor), 500);
    });
  }

  async getLogsAtividade(): Promise<LogAtividade[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockLogsAtividade), 500);
    });
  }
}

export default ManagerDataService.getInstance();
