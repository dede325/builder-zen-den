import nodemailer from 'nodemailer';
import { ContactSubmission } from './storage';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure with environment variables or use a default test configuration
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    });
  }

  async sendContactNotification(submission: ContactSubmission): Promise<void> {
    const emailContent = this.formatContactEmail(submission);
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@bemcuidar.co.ao',
      to: ['recepcao@bemcuidar.co.ao', 'coordenacao@bemcuidar.co.ao'],
      subject: `Nova Mensagem de Contato - ${submission.subject}`,
      html: emailContent,
      text: this.stripHtml(emailContent)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  private formatContactEmail(submission: ContactSubmission): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nova Mensagem de Contato - Clínica Bem Cuidar</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(to right, #79cbcb, #566264); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #566264; }
          .value { margin-top: 5px; padding: 10px; background-color: #f9f9f9; border-radius: 5px; }
          .footer { background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏥 Clínica Bem Cuidar</h1>
          <p>Nova mensagem de contato recebida</p>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Nome:</div>
            <div class="value">${submission.name}</div>
          </div>
          
          <div class="field">
            <div class="label">E-mail:</div>
            <div class="value">${submission.email}</div>
          </div>
          
          <div class="field">
            <div class="label">Telefone:</div>
            <div class="value">${submission.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">Assunto:</div>
            <div class="value">${submission.subject}</div>
          </div>
          
          <div class="field">
            <div class="label">Mensagem:</div>
            <div class="value">${submission.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div class="field">
            <div class="label">Data/Hora:</div>
            <div class="value">${new Date().toLocaleString('pt-AO')}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Esta mensagem foi enviada através do formulário de contato do site da Clínica Bem Cuidar.</p>
          <p>Para responder, utilize o e-mail: ${submission.email}</p>
        </div>
      </body>
      </html>
    `;
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
