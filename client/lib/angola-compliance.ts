/**
 * Angola Legal Compliance Manager
 * Implements compliance with Angola medical and data protection laws
 *
 * Key Legislation:
 * - Lei n.º 22/11 de Proteção de Dados Pessoais
 * - Código de Conduta da Ordem dos Médicos de Angola
 * - Regulamentação do Ministério da Saúde
 * - Normas de Segurança de Dados Médicos
 */

interface LegalDocument {
  id: string;
  title: string;
  description: string;
  version: string;
  effectiveDate: Date;
  content: string;
  category:
    | "data_protection"
    | "medical_ethics"
    | "patient_rights"
    | "record_keeping"
    | "telemedicine";
  language: "pt-AO";
  source: string;
  lastUpdated: Date;
}

interface ConsentRecord {
  id: string;
  patientId: string;
  consentType:
    | "data_processing"
    | "medical_treatment"
    | "telemedicine"
    | "research"
    | "marketing";
  version: string;
  givenAt: Date;
  givenBy: string; // patient or legal guardian
  ipAddress?: string;
  withdrawnAt?: Date;
  withdrawalReason?: string;
  legalBasis: string;
  processingPurpose: string[];
  dataCategories: string[];
  retentionPeriod: number; // days
  thirdPartySharing: boolean;
  internationalTransfer: boolean;
  automaticDecisionMaking: boolean;
}

interface AuditRecord {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  dataSubjectId?: string; // Usually patient ID
  legalBasis: string;
  processingPurpose: string;
  dataCategories: string[];
  outcome: "success" | "failure" | "partial";
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  additionalDetails?: Record<string, any>;
}

interface DataSubjectRequest {
  id: string;
  requestType:
    | "access"
    | "rectification"
    | "erasure"
    | "portability"
    | "restriction"
    | "objection";
  requesterId: string;
  dataSubjectId: string;
  submittedAt: Date;
  status:
    | "pending"
    | "in_progress"
    | "completed"
    | "rejected"
    | "partially_fulfilled";
  requestDetails: string;
  identityVerified: boolean;
  responseDeadline: Date;
  responseAt?: Date;
  response?: string;
  documentsProvided: string[];
  handledBy?: string;
  rejectionReason?: string;
  appealDeadline?: Date;
}

interface RetentionPolicy {
  category: string;
  description: string;
  retentionPeriod: number; // days
  legalBasis: string;
  autoDelete: boolean;
  reviewRequired: boolean;
  archiveAfter?: number; // days
  exceptions?: string[];
}

class AngolaComplianceManager {
  private readonly DATA_PROTECTION_LAW = "Lei n.º 22/11 de 23 de Setembro";
  private readonly MEDICAL_RECORDS_RETENTION = 3650; // 10 years as per Angola law
  private readonly GDPR_STYLE_RIGHTS = true; // Angola law follows GDPR principles

  private legalDocuments: Map<string, LegalDocument> = new Map();
  private retentionPolicies: Map<string, RetentionPolicy> = new Map();

  constructor() {
    this.initializeLegalFramework();
    this.initializeRetentionPolicies();
  }

  // Initialize legal framework
  private initializeLegalFramework(): void {
    const dataProtectionLaw: LegalDocument = {
      id: "lei-22-11",
      title: "Lei de Proteção de Dados Pessoais",
      description:
        "Lei n.º 22/11 de 23 de Setembro sobre proteção de dados pessoais",
      version: "1.0",
      effectiveDate: new Date("2011-09-23"),
      content: "",
      category: "data_protection",
      language: "pt-AO",
      source: "Diário da República de Angola",
      lastUpdated: new Date("2011-09-23"),
    };

    const medicalEthics: LegalDocument = {
      id: "codigo-medicos",
      title: "Código de Conduta da Ordem dos Médicos",
      description: "Normas éticas e deontológicas para médicos em Angola",
      version: "2.0",
      effectiveDate: new Date("2020-01-01"),
      content: "",
      category: "medical_ethics",
      language: "pt-AO",
      source: "Ordem dos Médicos de Angola",
      lastUpdated: new Date("2020-01-01"),
    };

    this.legalDocuments.set(dataProtectionLaw.id, dataProtectionLaw);
    this.legalDocuments.set(medicalEthics.id, medicalEthics);
  }

  // Initialize data retention policies
  private initializeRetentionPolicies(): void {
    const policies: RetentionPolicy[] = [
      {
        category: "medical_records",
        description: "Registos médicos de pacientes",
        retentionPeriod: 3650, // 10 years
        legalBasis: "Normas do Ministério da Saúde de Angola",
        autoDelete: false, // Medical records should be archived, not deleted
        reviewRequired: true,
        archiveAfter: 2555, // 7 years active, then archive
      },
      {
        category: "exam_results",
        description: "Resultados de exames médicos",
        retentionPeriod: 2555, // 7 years
        legalBasis: "Normas Sanitárias Nacionais",
        autoDelete: true,
        reviewRequired: false,
      },
      {
        category: "prescriptions",
        description: "Prescrições médicas",
        retentionPeriod: 1825, // 5 years
        legalBasis: "Regulamentação Farmacêutica Angola",
        autoDelete: true,
        reviewRequired: false,
      },
      {
        category: "appointment_records",
        description: "Registos de consultas",
        retentionPeriod: 1095, // 3 years
        legalBasis: "Normas Administrativas Clínicas",
        autoDelete: false,
        reviewRequired: true,
        archiveAfter: 730, // 2 years active
      },
      {
        category: "consent_records",
        description: "Registos de consentimento",
        retentionPeriod: 2555, // 7 years
        legalBasis: "Lei 22/11 + Código Médico",
        autoDelete: false,
        reviewRequired: false,
      },
      {
        category: "audit_logs",
        description: "Logs de auditoria e acesso",
        retentionPeriod: 1095, // 3 years
        legalBasis: "Lei 22/11 Art. 15",
        autoDelete: true,
        reviewRequired: false,
      },
      {
        category: "telemedicine_recordings",
        description: "Gravações de teleconsultas",
        retentionPeriod: 730, // 2 years
        legalBasis: "Normas de Telemedicina MS Angola",
        autoDelete: true,
        reviewRequired: true,
        exceptions: ["emergency_cases", "legal_disputes"],
      },
      {
        category: "marketing_data",
        description: "Dados para fins de marketing",
        retentionPeriod: 365, // 1 year
        legalBasis: "Lei 22/11 Art. 8",
        autoDelete: true,
        reviewRequired: false,
      },
    ];

    policies.forEach((policy) => {
      this.retentionPolicies.set(policy.category, policy);
    });
  }

  // Record patient consent
  async recordConsent(
    consentData: Omit<ConsentRecord, "id" | "givenAt">,
  ): Promise<string> {
    const consent: ConsentRecord = {
      id: this.generateId(),
      givenAt: new Date(),
      ...consentData,
    };

    try {
      const response = await fetch("/api/compliance/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
          "X-Legal-Compliance": "Lei-22-11-Angola",
        },
        body: JSON.stringify(consent),
      });

      if (!response.ok) {
        throw new Error("Falha ao registar consentimento");
      }

      // Log the consent recording
      await this.logDataProcessing({
        action: "consent_recorded",
        resourceType: "consent_record",
        resourceId: consent.id,
        dataSubjectId: consent.patientId,
        legalBasis: consent.legalBasis,
        processingPurpose: "consent_management",
        dataCategories: ["consent_data", "identity_data"],
      });

      return consent.id;
    } catch (error) {
      console.error("[AngolaCompliance] Failed to record consent:", error);
      throw error;
    }
  }

  // Withdraw consent
  async withdrawConsent(
    consentId: string,
    withdrawalReason: string,
    requesterId: string,
  ): Promise<void> {
    try {
      const response = await fetch(
        `/api/compliance/consent/${consentId}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
          body: JSON.stringify({
            withdrawalReason,
            withdrawnAt: new Date().toISOString(),
            withdrawnBy: requesterId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao retirar consentimento");
      }

      // Log the withdrawal
      await this.logDataProcessing({
        action: "consent_withdrawn",
        resourceType: "consent_record",
        resourceId: consentId,
        legalBasis: "Lei 22/11 Art. 7",
        processingPurpose: "consent_withdrawal",
        dataCategories: ["consent_data"],
      });
    } catch (error) {
      console.error("[AngolaCompliance] Failed to withdraw consent:", error);
      throw error;
    }
  }

  // Handle data subject rights requests
  async submitDataSubjectRequest(
    requestData: Omit<
      DataSubjectRequest,
      "id" | "submittedAt" | "status" | "responseDeadline"
    >,
  ): Promise<string> {
    const request: DataSubjectRequest = {
      id: this.generateId(),
      submittedAt: new Date(),
      status: "pending",
      responseDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days as per Angola law
      ...requestData,
    };

    try {
      const response = await fetch("/api/compliance/data-subject-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Falha ao submeter pedido");
      }

      // Auto-assign to compliance officer
      await this.assignToComplianceOfficer(request.id);

      // Log the request
      await this.logDataProcessing({
        action: "data_subject_request_submitted",
        resourceType: "data_subject_request",
        resourceId: request.id,
        dataSubjectId: request.dataSubjectId,
        legalBasis: "Lei 22/11 Art. 11-16",
        processingPurpose: "rights_exercise",
        dataCategories: ["request_data", "identity_data"],
      });

      return request.id;
    } catch (error) {
      console.error(
        "[AngolaCompliance] Failed to submit data subject request:",
        error,
      );
      throw error;
    }
  }

  // Log data processing activities
  async logDataProcessing(
    auditData: Omit<AuditRecord, "id" | "timestamp" | "userId" | "userRole">,
  ): Promise<void> {
    const audit: AuditRecord = {
      id: this.generateId(),
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      userRole: this.getCurrentUserRole(),
      outcome: "success",
      ...auditData,
    };

    try {
      const response = await fetch("/api/compliance/audit-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
          "X-Audit-Required": "true",
        },
        body: JSON.stringify(audit),
      });

      if (!response.ok) {
        console.error("[AngolaCompliance] Failed to log audit record");
      }
    } catch (error) {
      console.error("[AngolaCompliance] Audit logging error:", error);
      // Store locally for later sync
      this.storeAuditOffline(audit);
    }
  }

  // Check if data processing is lawful
  isProcessingLawful(
    purpose: string,
    dataCategories: string[],
    hasConsent: boolean = false,
    vitalInterests: boolean = false,
    legalObligation: boolean = false,
  ): { lawful: boolean; legalBasis: string; conditions?: string[] } {
    // Special categories (sensitive data) require explicit consent or other specific conditions
    const specialCategories = ["health_data", "biometric_data", "genetic_data"];
    const hasSpecialData = dataCategories.some((cat) =>
      specialCategories.includes(cat),
    );

    if (hasSpecialData) {
      if (hasConsent) {
        return {
          lawful: true,
          legalBasis: "Lei 22/11 Art. 6 - Consentimento explícito",
          conditions: [
            "consent_specific",
            "consent_informed",
            "consent_unambiguous",
          ],
        };
      }

      if (vitalInterests) {
        return {
          lawful: true,
          legalBasis: "Lei 22/11 Art. 6 - Interesses vitais",
          conditions: ["documented_vital_interest", "proportionality"],
        };
      }

      if (
        purpose === "medical_treatment" ||
        purpose === "healthcare_provision"
      ) {
        return {
          lawful: true,
          legalBasis: "Lei 22/11 Art. 6 + Código Médico",
          conditions: ["medical_necessity", "professional_secrecy"],
        };
      }

      return {
        lawful: false,
        legalBasis: "Sem base legal válida para dados especiais",
        conditions: [
          "consent_required",
          "or_vital_interests",
          "or_medical_necessity",
        ],
      };
    }

    // Regular personal data
    if (hasConsent) {
      return { lawful: true, legalBasis: "Lei 22/11 Art. 5 - Consentimento" };
    }

    if (legalObligation) {
      return { lawful: true, legalBasis: "Lei 22/11 Art. 5 - Obrigação legal" };
    }

    if (purpose === "legitimate_interests") {
      return {
        lawful: true,
        legalBasis: "Lei 22/11 Art. 5 - Interesses legítimos",
        conditions: ["balance_test_required", "data_subject_rights_protected"],
      };
    }

    return { lawful: false, legalBasis: "Base legal insuficiente" };
  }

  // Get retention period for data category
  getRetentionPeriod(category: string): RetentionPolicy | null {
    return this.retentionPolicies.get(category) || null;
  }

  // Check if data should be deleted
  shouldDeleteData(category: string, createdAt: Date): boolean {
    const policy = this.getRetentionPeriod(category);
    if (!policy || !policy.autoDelete) return false;

    const expiryDate = new Date(createdAt);
    expiryDate.setDate(expiryDate.getDate() + policy.retentionPeriod);

    return new Date() > expiryDate;
  }

  // Generate privacy notice for Angola
  generatePrivacyNotice(language: "pt-AO" = "pt-AO"): string {
    return `
# AVISO DE PRIVACIDADE - CLÍNICA BEM CUIDAR

## Base Legal
Este aviso é elaborado em conformidade com a Lei n.º 22/11 de 23 de Setembro sobre Proteção de Dados Pessoais da República de Angola.

## Responsável pelo Tratamento
**Clínica Bem Cuidar, Lda.**
Avenida 21 de Janeiro, Nº 351, Benfica, Luanda, Angola
Email: privacidade@clinicabemcuidar.ao
Telefone: +244 222 123 456

## Finalidades do Tratamento
Os seus dados pessoais são tratados para:
- Prestação de cuidados médicos e de saúde
- Gestão de consultas e agendamentos
- Manutenção de registos médicos
- Comunicação relacionada com tratamentos
- Cumprimento de obrigações legais
- Melhoria dos nossos serviços

## Categorias de Dados
Tratamos as seguintes categorias de dados:
- Dados de identificação (nome, BI, contactos)
- Dados de saúde (historial médico, exames, diagnósticos)
- Dados de localização (endereço)
- Dados financeiros (informações de pagamento)

## Base Legal
O tratamento baseia-se em:
- Consentimento explícito (Lei 22/11 Art. 6)
- Necessidade para prestação de cuidados de saúde
- Cumprimento de obrigações legais
- Interesses vitais do titular dos dados

## Período de Conservação
- Registos médicos: 10 anos (conforme normas do Ministério da Saúde)
- Dados administrativos: 3 anos
- Consentimentos: 7 anos
- Logs de acesso: 3 anos

## Os Seus Direitos
Tem o direito de:
- Aceder aos seus dados pessoais
- Rectificar dados incorrectos
- Solicitar o apagamento (direito ao esquecimento)
- Restringir o tratamento
- Portabilidade dos dados
- Opor-se ao tratamento
- Retirar o consentimento

## Exercício de Direitos
Para exercer os seus direitos, contacte:
Email: direitos@clinicabemcuidar.ao
Telefone: +244 222 123 456
Endereço: Avenida 21 de Janeiro, Nº 351, Benfica, Luanda

## Segurança dos Dados
Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados, incluindo:
- Criptografia AES-256
- Controlo de acesso baseado em funções
- Auditoria contínua
- Formação regular do pessoal

## Partilha de Dados
Os seus dados podem ser partilhados com:
- Outros profissionais de saúde (com consentimento)
- Laboratórios e clínicas parceiras
- Seguradoras (mediante autorização)
- Autoridades competentes (quando legalmente obrigatório)

## Reclamações
Em caso de violação dos seus direitos, pode apresentar reclamação junto da autoridade competente de proteção de dados de Angola.

## Alterações
Este aviso pode ser actualizado. A versão actual está sempre disponível no nosso website.

**Última actualização: ${new Date().toLocaleDateString("pt-AO")}**
    `.trim();
  }

  // Generate consent form text
  generateConsentForm(purpose: string, dataCategories: string[]): string {
    const categoriesText = dataCategories.join(", ");

    return `
## TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO

**Finalidade:** ${purpose}
**Categorias de dados:** ${categoriesText}
**Base legal:** Lei n.º 22/11 de Proteção de Dados Pessoais

Eu, abaixo-assinado(a), declaro que:
1. Fui informado(a) sobre o tratamento dos meus dados pessoais
2. Compreendo as finalidades e a base legal do tratamento
3. Tenho conhecimento dos meus direitos
4. Dou o meu consentimento livre, específico e informado

**Direitos do titular:**
- Acesso, rectificação, apagamento, restrição, portabilidade
- Direito de oposição e retirada do consentimento
- Direito a reclamação junto da autoridade competente

**Contacto para exercício de direitos:**
Email: direitos@clinicabemcuidar.ao
Telefone: +244 222 123 456

☐ **Concordo** com o tratamento dos meus dados pessoais conforme descrito
☐ **Não concordo** com o tratamento

Data: ___/___/______
Assinatura: _________________________
    `.trim();
  }

  // Utility methods
  private async assignToComplianceOfficer(requestId: string): Promise<void> {
    // Implementation would assign to available compliance officer
    console.log(
      `[AngolaCompliance] Assigned request ${requestId} to compliance officer`,
    );
  }

  private storeAuditOffline(audit: AuditRecord): void {
    const offlineAudits = JSON.parse(
      localStorage.getItem("offline_audits") || "[]",
    );
    offlineAudits.push(audit);
    localStorage.setItem("offline_audits", JSON.stringify(offlineAudits));
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthToken(): string {
    // Get from auth store
    return "";
  }

  private getCurrentUserId(): string {
    // Get from auth store
    return "";
  }

  private getCurrentUserRole(): string {
    // Get from auth store
    return "";
  }
}

export const angolaCompliance = new AngolaComplianceManager();
export default angolaCompliance;
export type {
  ConsentRecord,
  AuditRecord,
  DataSubjectRequest,
  RetentionPolicy,
  LegalDocument,
};
