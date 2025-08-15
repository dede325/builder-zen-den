export interface DashboardStats {
  consultasHoje: number;
  examesPendentes: number;
  faturamentoMes: number;
  pacientesAtivos: number;
  mensagensNaoLidas: number;
}

export interface Consulta {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  medicoId: string;
  medicoNome: string;
  especialidade: string;
  data: string;
  hora: string;
  status: 'agendada' | 'concluida' | 'cancelada' | 'em_andamento';
  tipo: 'consulta' | 'retorno';
  observacoes?: string;
}

export interface Exame {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  medicoSolicitante: string;
  tipoExame: string;
  dataColeta: string;
  dataResultado?: string;
  status: 'pendente' | 'coletado' | 'resultado_disponivel' | 'entregue';
  observacoes?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: 'medico' | 'enfermeira' | 'secretaria' | 'paciente' | 'gestor';
  especialidade?: string;
  crm?: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  dataCadastro: string;
  ultimoLogin?: string;
}

export interface Fatura {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  descricao: string;
  formaPagamento?: 'dinheiro' | 'cartao' | 'pix' | 'convenio';
}

export interface MensagemInterna {
  id: string;
  remetenteId: string;
  remetenteNome: string;
  destinatarioId: string;
  destinatarioNome: string;
  assunto: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  arquivada: boolean;
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
}

export interface ItemEstoque {
  id: string;
  nome: string;
  categoria: 'medicamento' | 'material' | 'equipamento';
  quantidade: number;
  quantidadeMinima: number;
  unidade: string;
  valorUnitario: number;
  fornecedor: string;
  dataValidade?: string;
  lote?: string;
}

export interface MovimentacaoEstoque {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  motivo: string;
  responsavel: string;
  data: string;
}

export interface RelatorioConsulta {
  especialidade: string;
  total: number;
  percentual: number;
}

export interface DesempenhoMedico {
  medicoId: string;
  medicoNome: string;
  totalConsultas: number;
  avaliacaoMedia: number;
  especialidade: string;
}

export interface ReceitaPeriodo {
  mes: string;
  receita: number;
  despesas: number;
  lucro: number;
}

export interface TaxaComparecimento {
  mes: string;
  agendadas: number;
  realizadas: number;
  taxa: number;
}

export interface PerfilGestor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  fotoPerfil?: string;
  notificacoes: {
    email: boolean;
    sms: boolean;
    push: boolean;
    financeiro: boolean;
    estoque: boolean;
    consultas: boolean;
  };
}

export interface LogAtividade {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  acao: string;
  modulo: string;
  detalhes: string;
  data: string;
  ip: string;
}
