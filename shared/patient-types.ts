export interface Paciente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  foto_url?: string;
  data_nascimento: string;
  cpf: string;
  convenio?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamePaciente {
  id: string;
  paciente_id: string;
  tipo: string;
  data: string;
  status: "pendente" | "coletado" | "resultado_disponivel" | "entregue";
  resultado_url?: string;
  resultado_texto?: string;
  medico_solicitante: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversa {
  id: string;
  usuario1_id: string;
  usuario2_id: string;
  ultimo_contato: string;
  criado_em: string;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  remetente_id: string;
  remetente_nome: string;
  remetente_tipo: "paciente" | "medico" | "secretaria" | "enfermagem";
  texto: string;
  enviado_em: string;
  lido: boolean;
  tipo_arquivo?: "imagem" | "documento" | "audio";
  arquivo_url?: string;
}

export interface FaturaPaciente {
  id: string;
  paciente_id: string;
  valor: number;
  descricao: string;
  status: "pago" | "pendente" | "vencido" | "cancelado";
  data_emissao: string;
  data_vencimento: string;
  data_pagamento?: string;
  forma_pagamento?: "dinheiro" | "cartao" | "pix" | "convenio";
  servicos: ServicoFatura[];
  created_at: string;
  updated_at: string;
}

export interface ServicoFatura {
  id: string;
  fatura_id: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface ContatoChat {
  id: string;
  nome: string;
  tipo: "medico" | "secretaria" | "enfermagem";
  especialidade?: string;
  foto_url?: string;
  status: "online" | "offline" | "ocupado";
  ultima_mensagem?: string;
  ultima_atividade: string;
  mensagens_nao_lidas: number;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FiltroExames {
  periodo: "7dias" | "30dias" | "todos";
  tipo?: string;
  status?: ExamePaciente["status"];
}

export interface ConfiguracoesPaciente {
  paciente_id: string;
  notificacoes_email: boolean;
  notificacoes_sms: boolean;
  notificacoes_push: boolean;
  privacidade_dados: boolean;
  compartilhar_exames: boolean;
  tema: "claro" | "escuro" | "sistema";
  idioma: string;
}
