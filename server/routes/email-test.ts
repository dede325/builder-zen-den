import { RequestHandler } from "express";
import { emailService } from "../email";

export const testEmailConnection: RequestHandler = async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: "Configuração de e-mail funcionando corretamente"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Falha na configuração de e-mail. Verifique as credenciais SMTP."
      });
    }
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao testar configuração de e-mail",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const sendTestEmail: RequestHandler = async (req, res) => {
  try {
    const testSubmission = {
      id: 999,
      name: "Teste Sistema",
      email: "teste@bemcuidar.co.ao",
      phone: "+244 999 999 999",
      subject: "duvida" as const,
      message: "Esta é uma mensagem de teste do sistema de contato da Clínica Bem Cuidar.",
      submitted_at: new Date().toISOString(),
      status: 'pending' as const
    };

    await emailService.sendContactNotification(testSubmission);
    
    res.json({
      success: true,
      message: "E-mail de teste enviado com sucesso para recepcao@bemcuidar.co.ao e coordenacao@bemcuidar.co.ao"
    });
  } catch (error) {
    console.error("Test email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar e-mail de teste",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
