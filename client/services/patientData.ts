import {
  Paciente,
  ExamePaciente,
  Conversa,
  Mensagem,
  FaturaPaciente,
  ServicoFatura,
  ContatoChat,
  FiltroExames,
  ConfiguracoesPaciente,
} from "@shared/patient-types";

// Mock data
const currentPatientId = "pac_001";

export const mockPaciente: Paciente = {
  id: currentPatientId,
  nome: "Maria Silva Santos",
  email: "maria.silva@email.com",
  telefone: "(11) 99999-1234",
  endereco: "Rua das Flores, 123, São Paulo - SP",
  foto_url: "/placeholder.svg",
  data_nascimento: "1985-03-15",
  cpf: "123.456.789-00",
  convenio: "Plano Saúde ABC",
  created_at: "2023-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

export const mockExames: ExamePaciente[] = [
  {
    id: "ex_001",
    paciente_id: currentPatientId,
    tipo: "Hemograma Completo",
    data: "2024-01-15",
    status: "resultado_disponivel",
    resultado_url: "/exames/hemograma_001.pdf",
    resultado_texto:
      "Resultados dentro dos parâmetros normais. Contagem de glóbulos vermelhos: 4.5 milhões/μL, Hemoglobina: 14.2 g/dL.",
    medico_solicitante: "Dr. João Silva - Clínico Geral",
    observacoes: "Exame de rotina para check-up anual",
    created_at: "2024-01-10T09:00:00Z",
    updated_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "ex_002",
    paciente_id: currentPatientId,
    tipo: "Eletrocardiograma",
    data: "2024-01-12",
    status: "resultado_disponivel",
    resultado_url: "/exames/ecg_002.pdf",
    resultado_texto:
      "Ritmo sinusal regular. Frequência cardíaca: 72 bpm. Não foram detectadas alterações significativas.",
    medico_solicitante: "Dra. Ana Costa - Cardiologista",
    observacoes: "Paciente relatou palpitações esporádicas",
    created_at: "2024-01-08T11:00:00Z",
    updated_at: "2024-01-12T16:00:00Z",
  },
  {
    id: "ex_003",
    paciente_id: currentPatientId,
    tipo: "Ultrassom Abdominal",
    data: "2024-01-08",
    status: "coletado",
    medico_solicitante: "Dr. Carlos Oliveira - Gastroenterologista",
    observacoes: "Investigação de dores abdominais",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-01-08T10:30:00Z",
  },
  {
    id: "ex_004",
    paciente_id: currentPatientId,
    tipo: "Raio-X Tórax",
    data: "2024-01-20",
    status: "pendente",
    medico_solicitante: "Dra. Maria Fernandes - Pneumologista",
    observacoes: "Avaliação pré-operatória",
    created_at: "2024-01-18T14:00:00Z",
    updated_at: "2024-01-18T14:00:00Z",
  },
];

export const mockContatos: ContatoChat[] = [
  {
    id: "cont_001",
    nome: "Dr. João Silva",
    tipo: "medico",
    especialidade: "Clínico Geral",
    foto_url: "/avatars/dr-joao.jpg",
    status: "online",
    ultima_mensagem: "Seus exames estão normais. Agende retorno em 6 meses.",
    ultima_atividade: new Date().toISOString(),
    mensagens_nao_lidas: 0,
  },
  {
    id: "cont_002",
    nome: "Enfermeira Ana",
    tipo: "enfermagem",
    foto_url: "/avatars/enf-ana.jpg",
    status: "ocupado",
    ultima_mensagem: "Lembre-se de tomar o medicamento conforme orientado.",
    ultima_atividade: "2024-01-15T10:30:00Z",
    mensagens_nao_lidas: 2,
  },
  {
    id: "cont_003",
    nome: "Secretária Carla",
    tipo: "secretaria",
    foto_url: "/avatars/sec-carla.jpg",
    status: "online",
    ultima_mensagem: "Sua consulta foi reagendada para quinta-feira às 14h.",
    ultima_atividade: "2024-01-14T15:20:00Z",
    mensagens_nao_lidas: 1,
  },
];

export const mockMensagens: Mensagem[] = [
  {
    id: "msg_001",
    conversa_id: "conv_001",
    remetente_id: "cont_001",
    remetente_nome: "Dr. João Silva",
    remetente_tipo: "medico",
    texto:
      "Olá Maria! Recebi os resultados dos seus exames. Está tudo dentro da normalidade.",
    enviado_em: "2024-01-15T09:00:00Z",
    lido: true,
  },
  {
    id: "msg_002",
    conversa_id: "conv_001",
    remetente_id: currentPatientId,
    remetente_nome: "Maria Silva Santos",
    remetente_tipo: "paciente",
    texto:
      "Que ótima notícia! Obrigada doutor. Quando devo agendar o próximo check-up?",
    enviado_em: "2024-01-15T09:15:00Z",
    lido: true,
  },
  {
    id: "msg_003",
    conversa_id: "conv_001",
    remetente_id: "cont_001",
    remetente_nome: "Dr. João Silva",
    remetente_tipo: "medico",
    texto: "Seus exames estão normais. Agende retorno em 6 meses.",
    enviado_em: "2024-01-15T09:30:00Z",
    lido: false,
  },
];

export const mockFaturas: FaturaPaciente[] = [
  {
    id: "fat_001",
    paciente_id: currentPatientId,
    valor: 450.0,
    descricao: "Consulta + Exames",
    status: "pago",
    data_emissao: "2024-01-15",
    data_vencimento: "2024-01-25",
    data_pagamento: "2024-01-20",
    forma_pagamento: "cartao",
    servicos: [
      {
        id: "serv_001",
        fatura_id: "fat_001",
        descricao: "Consulta Clínico Geral",
        quantidade: 1,
        valor_unitario: 200.0,
        valor_total: 200.0,
      },
      {
        id: "serv_002",
        fatura_id: "fat_001",
        descricao: "Hemograma Completo",
        quantidade: 1,
        valor_unitario: 150.0,
        valor_total: 150.0,
      },
      {
        id: "serv_003",
        fatura_id: "fat_001",
        descricao: "Eletrocardiograma",
        quantidade: 1,
        valor_unitario: 100.0,
        valor_total: 100.0,
      },
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "fat_002",
    paciente_id: currentPatientId,
    valor: 280.0,
    descricao: "Consulta Cardiologista",
    status: "pendente",
    data_emissao: "2024-01-12",
    data_vencimento: "2024-01-22",
    servicos: [
      {
        id: "serv_004",
        fatura_id: "fat_002",
        descricao: "Consulta Cardiologista",
        quantidade: 1,
        valor_unitario: 280.0,
        valor_total: 280.0,
      },
    ],
    created_at: "2024-01-12T11:00:00Z",
    updated_at: "2024-01-12T11:00:00Z",
  },
];

// Service class
class PatientDataService {
  private static instance: PatientDataService;

  private constructor() {}

  static getInstance(): PatientDataService {
    if (!PatientDataService.instance) {
      PatientDataService.instance = new PatientDataService();
    }
    return PatientDataService.instance;
  }

  // Paciente
  async getPaciente(id: string): Promise<Paciente> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPaciente), 300);
    });
  }

  async updatePaciente(id: string, data: Partial<Paciente>): Promise<Paciente> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = {
          ...mockPaciente,
          ...data,
          updated_at: new Date().toISOString(),
        };
        resolve(updated);
      }, 500);
    });
  }

  // Exames
  async getExames(
    pacienteId: string,
    filtros?: FiltroExames,
  ): Promise<ExamePaciente[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let exames = mockExames.filter((e) => e.paciente_id === pacienteId);

        if (filtros?.periodo) {
          const today = new Date();
          const dias =
            filtros.periodo === "7dias"
              ? 7
              : filtros.periodo === "30dias"
                ? 30
                : 365;
          const dataLimite = new Date(
            today.getTime() - dias * 24 * 60 * 60 * 1000,
          );

          exames = exames.filter((e) => new Date(e.data) >= dataLimite);
        }

        if (filtros?.status) {
          exames = exames.filter((e) => e.status === filtros.status);
        }

        if (filtros?.tipo) {
          exames = exames.filter((e) =>
            e.tipo.toLowerCase().includes(filtros.tipo!.toLowerCase()),
          );
        }

        resolve(
          exames.sort(
            (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
          ),
        );
      }, 400);
    });
  }

  async getExame(id: string): Promise<ExamePaciente | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exame = mockExames.find((e) => e.id === id);
        resolve(exame || null);
      }, 200);
    });
  }

  // Mensagens
  async getContatos(pacienteId: string): Promise<ContatoChat[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockContatos), 300);
    });
  }

  async getMensagens(conversaId: string): Promise<Mensagem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mensagens = mockMensagens.filter(
          (m) => m.conversa_id === conversaId,
        );
        resolve(
          mensagens.sort(
            (a, b) =>
              new Date(a.enviado_em).getTime() -
              new Date(b.enviado_em).getTime(),
          ),
        );
      }, 400);
    });
  }

  async enviarMensagem(conversaId: string, texto: string): Promise<Mensagem> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const novaMensagem: Mensagem = {
          id: `msg_${Date.now()}`,
          conversa_id: conversaId,
          remetente_id: currentPatientId,
          remetente_nome: mockPaciente.nome,
          remetente_tipo: "paciente",
          texto,
          enviado_em: new Date().toISOString(),
          lido: false,
        };
        resolve(novaMensagem);
      }, 300);
    });
  }

  // Faturas
  async getFaturas(pacienteId: string): Promise<FaturaPaciente[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const faturas = mockFaturas.filter((f) => f.paciente_id === pacienteId);
        resolve(
          faturas.sort(
            (a, b) =>
              new Date(b.data_emissao).getTime() -
              new Date(a.data_emissao).getTime(),
          ),
        );
      }, 400);
    });
  }

  async getFatura(id: string): Promise<FaturaPaciente | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fatura = mockFaturas.find((f) => f.id === id);
        resolve(fatura || null);
      }, 200);
    });
  }

  // Upload de arquivo
  async uploadArquivo(
    file: File,
    tipo: "foto" | "documento",
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular upload
        if (file.size > 5 * 1024 * 1024) {
          // 5MB
          resolve({
            success: false,
            error: "Arquivo muito grande. Máximo 5MB.",
          });
          return;
        }

        const url = `/uploads/${tipo}/${Date.now()}_${file.name}`;
        resolve({ success: true, url });
      }, 1000);
    });
  }

  // WebSocket simulado
  private websocketListeners: Array<(mensagem: Mensagem) => void> = [];

  onNovaMensagem(callback: (mensagem: Mensagem) => void) {
    this.websocketListeners.push(callback);
  }

  private simularMensagemRecebida() {
    setTimeout(
      () => {
        const novaMensagem: Mensagem = {
          id: `msg_${Date.now()}`,
          conversa_id: "conv_001",
          remetente_id: "cont_001",
          remetente_nome: "Dr. João Silva",
          remetente_tipo: "medico",
          texto: "Como você está se sentindo hoje?",
          enviado_em: new Date().toISOString(),
          lido: false,
        };

        this.websocketListeners.forEach((callback) => callback(novaMensagem));
      },
      Math.random() * 30000 + 10000,
    ); // 10-40 segundos
  }
}

export default PatientDataService.getInstance();
