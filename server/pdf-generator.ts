import { ExamResult, Patient } from "./types";

interface PDFGeneratorOptions {
  patient: Patient;
  exam: ExamResult;
}

export class PDFGenerator {
  private static getLogoBase64(): string {
    // Base64 do logotipo da clínica (simplificado para demo)
    // Em produção, seria carregado de um arquivo real
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  }

  private static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  private static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static generateExamPDF({ patient, exam }: PDFGeneratorOptions): string {
    const currentDate = new Date().toLocaleString("pt-BR");

    // HTML template para o PDF
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resultado de Exame - ${exam.name}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #fff;
                color: #333;
                line-height: 1.6;
            }
            .header {
                display: flex;
                align-items: center;
                border-bottom: 3px solid #79cbcb;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                width: 80px;
                height: 80px;
                margin-right: 20px;
                background: linear-gradient(135deg, #79cbcb, #566264);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 24px;
            }
            .clinic-info {
                flex: 1;
            }
            .clinic-name {
                font-size: 28px;
                font-weight: bold;
                color: #566264;
                margin: 0;
            }
            .clinic-slogan {
                font-size: 14px;
                color: #79cbcb;
                margin: 5px 0;
            }
            .clinic-contact {
                font-size: 12px;
                color: #666;
                margin: 0;
            }
            .patient-info {
                background: #f8fffe;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
                border-left: 5px solid #79cbcb;
            }
            .info-row {
                display: flex;
                margin-bottom: 10px;
            }
            .info-label {
                font-weight: bold;
                min-width: 120px;
                color: #566264;
            }
            .info-value {
                flex: 1;
            }
            .exam-details {
                margin-bottom: 30px;
            }
            .exam-title {
                font-size: 24px;
                font-weight: bold;
                color: #566264;
                margin-bottom: 20px;
                text-align: center;
                padding: 15px;
                background: linear-gradient(135deg, #79cbcb, #566264);
                color: white;
                border-radius: 10px;
            }
            .exam-info {
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
            }
            .result-section {
                background: #f0f9f9;
                border-radius: 10px;
                padding: 20px;
                margin-bottom: 20px;
                border-left: 5px solid #79cbcb;
            }
            .result-title {
                font-size: 18px;
                font-weight: bold;
                color: #566264;
                margin-bottom: 15px;
            }
            .result-content {
                font-size: 14px;
                line-height: 1.8;
                color: #333;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
            .status-badge {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-ready {
                background: #d4edda;
                color: #155724;
            }
            .status-viewed {
                background: #cce7ff;
                color: #004085;
            }
            .status-pending {
                background: #fff3cd;
                color: #856404;
            }
            .reference-values {
                background: #f8f9fa;
                border: 1px solid #dee2e6;
                border-radius: 8px;
                padding: 15px;
                margin-top: 20px;
                font-size: 12px;
            }
            .watermark {
                position: fixed;
                bottom: 20px;
                right: 20px;
                opacity: 0.1;
                font-size: 48px;
                color: #79cbcb;
                transform: rotate(-45deg);
                pointer-events: none;
            }
        </style>
    </head>
    <body>
        <div class="watermark">CLÍNICA BEM CUIDAR</div>
        
        <div class="header">
            <div class="logo">BC</div>
            <div class="clinic-info">
                <h1 class="clinic-name">Clínica Bem Cuidar</h1>
                <p class="clinic-slogan">Cuidar é Amar</p>
                <p class="clinic-contact">
                    Av. 21 de Janeiro, 351 - Benfica, Luanda | Tel: +244 945 344 650 | recepcao@bemcuidar.co.ao
                </p>
            </div>
        </div>

        <div class="patient-info">
            <h2 style="margin-top: 0; color: #566264;">Dados do Paciente</h2>
            <div class="info-row">
                <span class="info-label">Nome:</span>
                <span class="info-value">${patient.name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">E-mail:</span>
                <span class="info-value">${patient.email}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Telefone:</span>
                <span class="info-value">${patient.phone}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Data de Nasc.:</span>
                <span class="info-value">${this.formatDate(patient.birthDate)}</span>
            </div>
            <div class="info-row">
                <span class="info-label">CPF:</span>
                <span class="info-value">${patient.cpf}</span>
            </div>
        </div>

        <div class="exam-details">
            <div class="exam-title">RESULTADO DE EXAME</div>
            
            <div class="exam-info">
                <div class="info-row">
                    <span class="info-label">Exame:</span>
                    <span class="info-value">${exam.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tipo:</span>
                    <span class="info-value">${exam.type}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data do Exame:</span>
                    <span class="info-value">${this.formatDate(exam.date)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">
                        <span class="status-badge status-${exam.status}">
                            ${
                              exam.status === "ready"
                                ? "Disponível"
                                : exam.status === "viewed"
                                  ? "Visualizado"
                                  : "Pendente"
                            }
                        </span>
                    </span>
                </div>
                <div class="info-row">
                    <span class="info-label">Data do Relatório:</span>
                    <span class="info-value">${currentDate}</span>
                </div>
            </div>

            <div class="result-section">
                <div class="result-title">Resultado e Interpretação</div>
                <div class="result-content">
                    ${exam.notes || "Resultado dentro dos parâmetros normais."}
                </div>
                
                ${this.getSpecificContent(exam)}
            </div>
        </div>

        <div class="footer">
            <p><strong>Clínica Bem Cuidar</strong> - Documento gerado automaticamente em ${currentDate}</p>
            <p>Este documento é válido apenas com assinatura digital da clínica.</p>
            <p>Em caso de dúvidas, entre em contato: +244 945 344 650 | recepcao@bemcuidar.co.ao</p>
        </div>
    </body>
    </html>
    `;

    return htmlTemplate;
  }

  private static getSpecificContent(exam: ExamResult): string {
    switch (exam.type) {
      case "Análise Clínica":
        return `
        <div class="reference-values">
            <strong>Valores de Referência:</strong><br>
            • Hemoglobina: 12.0-15.5 g/dL (mulheres), 13.5-17.5 g/dL (homens)<br>
            • Leucócitos: 4.000-11.000/mm³<br>
            • Plaquetas: 150.000-450.000/mm³<br>
            • Glicose: 70-99 mg/dL (jejum)<br>
            • Colesterol Total: < 200 mg/dL
        </div>
        `;
      case "Cardiologia":
        return `
        <div class="reference-values">
            <strong>Parâmetros Avaliados:</strong><br>
            • Ritmo cardíaco: Regular/Irregular<br>
            • Frequência cardíaca: 60-100 bpm (repouso)<br>
            • Eixo elétrico: Normal (-30° a +90°)<br>
            • Ondas e complexos: Morfologia e duração<br>
            • Intervalos: PR, QRS, QT
        </div>
        `;
      case "Radiologia":
        return `
        <div class="reference-values">
            <strong>Estruturas Avaliadas:</strong><br>
            • Campos pulmonares: Transparência e padrão vascular<br>
            • Silhueta cardíaca: Forma e tamanho<br>
            • Mediastino: Posição e contornos<br>
            • Costelas e estruturas ósseas<br>
            • Diafragma: Posição e mobilidade
        </div>
        `;
      default:
        return `
        <div class="reference-values">
            <strong>Observações Gerais:</strong><br>
            Exame realizado conforme protocolo padrão da clínica.<br>
            Resultados analisados por médico especialista.
        </div>
        `;
    }
  }

  static generatePDFFileName(exam: ExamResult, patient: Patient): string {
    const date = new Date(exam.date).toISOString().split("T")[0];
    const examName = exam.name.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
    const patientName = patient.name.split(" ")[0].toLowerCase();

    return `resultado_${examName}_${patientName}_${date}.pdf`;
  }
}
