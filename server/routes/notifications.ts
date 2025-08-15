import { RequestHandler } from 'express';
import { database } from '../database';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  category: 'appointment' | 'medical' | 'billing' | 'general' | 'emergency';
  subject?: string;
  content: string;
  variables: string[];
  active: boolean;
}

interface NotificationLog {
  id: string;
  userId: string;
  templateId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipient: string;
  subject?: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdAt: string;
}

interface NotificationPreferences {
  userId: string;
  appointmentReminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
    timing: number; // hours before
  };
  examResults: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  medicationReminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  emergencyAlerts: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketingCommunications: {
    email: boolean;
    sms: boolean;
  };
}

// Mock notification templates
const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'apt_reminder_24h',
    name: 'Lembrete de Consulta - 24h',
    type: 'email',
    category: 'appointment',
    subject: 'Lembrete: Sua consulta é amanhã',
    content: `Olá {{patientName}},

Lembramos que você tem uma consulta agendada para amanhã:

🕒 Data e Hora: {{appointmentDate}} às {{appointmentTime}}
👨‍⚕️ Médico: {{doctorName}}
🏥 Especialidade: {{specialty}}
📍 Local: {{location}}

Recomendações:
- Chegue 15 minutos antes do horário
- Traga seus documentos e cartão do seguro
- Liste suas dúvidas e medicamentos atuais

Para reagendar ou cancelar, entre em contato conosco.

Atenciosamente,
Equipe Bem Cuidar`,
    variables: ['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'specialty', 'location'],
    active: true,
  },
  {
    id: 'apt_reminder_sms',
    name: 'Lembrete de Consulta - SMS',
    type: 'sms',
    category: 'appointment',
    content: 'Lembrete: Consulta amanhã {{appointmentTime}} com {{doctorName}}. Chegue 15min antes. Bem Cuidar',
    variables: ['appointmentTime', 'doctorName'],
    active: true,
  },
  {
    id: 'exam_result_ready',
    name: 'Resultado de Exame Disponível',
    type: 'email',
    category: 'medical',
    subject: 'Seu resultado de exame está disponível',
    content: `Olá {{patientName}},

Seu resultado de exame está disponível para visualização:

🔬 Exame: {{examName}}
📅 Data da Coleta: {{collectionDate}}
👨‍⚕️ Médico Solicitante: {{doctorName}}

Você pode acessar seus resultados através do portal do paciente ou retirar a via impressa na recepção.

⚠️ Se houver alguma alteração importante, nossa equipe entrará em contato.

Atenciosamente,
Equipe Bem Cuidar`,
    variables: ['patientName', 'examName', 'collectionDate', 'doctorName'],
    active: true,
  },
  {
    id: 'medication_reminder',
    name: 'Lembrete de Medicação',
    type: 'push',
    category: 'medical',
    content: 'Hora de tomar {{medicationName}} - {{dosage}}',
    variables: ['medicationName', 'dosage'],
    active: true,
  },
  {
    id: 'emergency_alert',
    name: 'Alerta de Emergência',
    type: 'sms',
    category: 'emergency',
    content: 'URGENTE: {{message}} - Entre em contato imediatamente: {{emergencyPhone}}',
    variables: ['message', 'emergencyPhone'],
    active: true,
  },
  {
    id: 'welcome_patient',
    name: 'Boas-vindas Novo Paciente',
    type: 'email',
    category: 'general',
    subject: 'Bem-vindo(a) à Clínica Bem Cuidar!',
    content: `Olá {{patientName}},

Seja muito bem-vindo(a) à Clínica Bem Cuidar! 🎉

Estamos felizes em tê-lo(a) como nosso paciente. Nossa missão é proporcionar cuidados médicos de excelência com atenção personalizada.

📱 Portal do Paciente:
- Agende consultas online
- Visualize seus exames
- Comunique-se com nossa equipe
- Acompanhe seu histórico médico

🏥 Nossos Serviços:
- Clínica Geral
- Cardiologia
- Dermatologia
- Pediatria
- E muito mais!

📞 Contato:
- Telefone: {{clinicPhone}}
- WhatsApp: {{clinicWhatsApp}}
- Email: {{clinicEmail}}

Qualquer dúvida, estamos à disposição!

Atenciosamente,
Equipe Bem Cuidar`,
    variables: ['patientName', 'clinicPhone', 'clinicWhatsApp', 'clinicEmail'],
    active: true,
  },
];

// Mock notification logs
const notificationLogs: NotificationLog[] = [
  {
    id: 'log-1',
    userId: 'patient-1',
    templateId: 'apt_reminder_24h',
    type: 'email',
    recipient: 'paciente@example.com',
    subject: 'Lembrete: Sua consulta é amanhã',
    content: 'Email content...',
    status: 'delivered',
    sentAt: '2024-12-20T09:00:00Z',
    deliveredAt: '2024-12-20T09:01:15Z',
    createdAt: '2024-12-20T09:00:00Z',
  },
  {
    id: 'log-2',
    userId: 'patient-1',
    templateId: 'apt_reminder_sms',
    type: 'sms',
    recipient: '+244923456789',
    content: 'Lembrete: Consulta amanhã 14:30 com Dr. António Silva. Chegue 15min antes. Bem Cuidar',
    status: 'sent',
    sentAt: '2024-12-20T09:05:00Z',
    createdAt: '2024-12-20T09:05:00Z',
  },
];

// Get notification templates
export const getNotificationTemplates: RequestHandler = (req, res) => {
  try {
    const { type, category, active } = req.query;
    
    let filtered = notificationTemplates;
    
    if (type) {
      filtered = filtered.filter(template => template.type === type);
    }
    
    if (category) {
      filtered = filtered.filter(template => template.category === category);
    }
    
    if (active !== undefined) {
      filtered = filtered.filter(template => template.active === (active === 'true'));
    }
    
    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching notification templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification templates'
    });
  }
};

// Send notification
export const sendNotification: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      templateId,
      recipient,
      variables = {},
      priority = 'normal',
      scheduledFor
    } = req.body;

    if (!userId || !templateId || !recipient) {
      return res.status(400).json({
        success: false,
        message: 'userId, templateId, and recipient are required'
      });
    }

    const template = notificationTemplates.find(t => t.id === templateId);
    if (!template || !template.active) {
      return res.status(404).json({
        success: false,
        message: 'Template not found or inactive'
      });
    }

    // Replace variables in content
    let content = template.content;
    let subject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, String(value));
      if (subject) {
        subject = subject.replace(regex, String(value));
      }
    });

    // Create notification log
    const notificationLog: NotificationLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      templateId,
      type: template.type,
      recipient,
      subject,
      content,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Simulate sending based on type
    try {
      switch (template.type) {
        case 'email':
          await sendEmail(recipient, subject!, content);
          break;
        case 'sms':
          await sendSMS(recipient, content);
          break;
        case 'push':
          await sendPushNotification(userId, content);
          break;
        case 'in_app':
          await createInAppNotification(userId, content);
          break;
      }
      
      notificationLog.status = 'sent';
      notificationLog.sentAt = new Date().toISOString();
      
      // For this demo, mark as delivered immediately
      if (template.type === 'email' || template.type === 'sms') {
        notificationLog.status = 'delivered';
        notificationLog.deliveredAt = new Date().toISOString();
      }
      
    } catch (error) {
      notificationLog.status = 'failed';
      notificationLog.errorMessage = (error as Error).message;
    }

    // In a real app, save to database
    notificationLogs.push(notificationLog);

    res.json({
      success: true,
      data: notificationLog,
      message: `Notification ${notificationLog.status}`
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
};

// Get notification logs
export const getNotificationLogs: RequestHandler = (req, res) => {
  try {
    const { userId, type, status, limit = 50 } = req.query;
    
    let filtered = notificationLogs;
    
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }
    
    if (type) {
      filtered = filtered.filter(log => log.type === type);
    }
    
    if (status) {
      filtered = filtered.filter(log => log.status === status);
    }
    
    // Sort by creation date (newest first)
    filtered = filtered
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, Number(limit));
    
    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification logs'
    });
  }
};

// Get user notification preferences
export const getNotificationPreferences: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock preferences - in real app, fetch from database
    const preferences: NotificationPreferences = {
      userId,
      appointmentReminders: {
        email: true,
        sms: true,
        push: true,
        timing: 24, // 24 hours before
      },
      examResults: {
        email: true,
        sms: false,
        push: true,
      },
      medicationReminders: {
        email: false,
        sms: false,
        push: true,
      },
      emergencyAlerts: {
        email: true,
        sms: true,
        push: true,
      },
      marketingCommunications: {
        email: false,
        sms: false,
      },
    };
    
    res.json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification preferences'
    });
  }
};

// Update user notification preferences
export const updateNotificationPreferences: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    // In real app, save to database
    console.log(`Updating preferences for user ${userId}:`, preferences);
    
    res.json({
      success: true,
      data: preferences,
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences'
    });
  }
};

// Send bulk notifications
export const sendBulkNotifications: RequestHandler = async (req, res) => {
  try {
    const { templateId, recipients, variables = {}, priority = 'normal' } = req.body;
    
    if (!templateId || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: 'templateId and recipients array are required'
      });
    }
    
    const template = notificationTemplates.find(t => t.id === templateId);
    if (!template || !template.active) {
      return res.status(404).json({
        success: false,
        message: 'Template not found or inactive'
      });
    }
    
    const results = [];
    
    for (const recipient of recipients) {
      try {
        // Each recipient can have individual variables
        const recipientVariables = { ...variables, ...recipient.variables };
        
        let content = template.content;
        let subject = template.subject;
        
        Object.entries(recipientVariables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          content = content.replace(regex, String(value));
          if (subject) {
            subject = subject.replace(regex, String(value));
          }
        });
        
        const notificationLog: NotificationLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: recipient.userId,
          templateId,
          type: template.type,
          recipient: recipient.address, // email or phone
          subject,
          content,
          status: 'sent',
          sentAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        
        results.push(notificationLog);
        notificationLogs.push(notificationLog);
        
      } catch (error) {
        results.push({
          recipient: recipient.address,
          status: 'failed',
          error: (error as Error).message
        });
      }
    }
    
    res.json({
      success: true,
      data: {
        sent: results.filter(r => r.status === 'sent').length,
        failed: results.filter(r => r.status === 'failed').length,
        details: results
      },
      message: `Bulk notification completed: ${results.filter(r => r.status === 'sent').length} sent, ${results.filter(r => r.status === 'failed').length} failed`
    });
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk notifications'
    });
  }
};

// Get notification statistics
export const getNotificationStats: RequestHandler = (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    
    let filtered = notificationLogs;
    
    if (userId) {
      filtered = filtered.filter(log => log.userId === userId);
    }
    
    if (startDate) {
      filtered = filtered.filter(log => 
        new Date(log.createdAt) >= new Date(startDate as string)
      );
    }
    
    if (endDate) {
      filtered = filtered.filter(log => 
        new Date(log.createdAt) <= new Date(endDate as string)
      );
    }
    
    const stats = {
      total: filtered.length,
      byType: {
        email: filtered.filter(log => log.type === 'email').length,
        sms: filtered.filter(log => log.type === 'sms').length,
        push: filtered.filter(log => log.type === 'push').length,
        in_app: filtered.filter(log => log.type === 'in_app').length,
      },
      byStatus: {
        pending: filtered.filter(log => log.status === 'pending').length,
        sent: filtered.filter(log => log.status === 'sent').length,
        delivered: filtered.filter(log => log.status === 'delivered').length,
        failed: filtered.filter(log => log.status === 'failed').length,
        read: filtered.filter(log => log.status === 'read').length,
      },
      byCategory: {
        appointment: filtered.filter(log => {
          const template = notificationTemplates.find(t => t.id === log.templateId);
          return template?.category === 'appointment';
        }).length,
        medical: filtered.filter(log => {
          const template = notificationTemplates.find(t => t.id === log.templateId);
          return template?.category === 'medical';
        }).length,
        billing: filtered.filter(log => {
          const template = notificationTemplates.find(t => t.id === log.templateId);
          return template?.category === 'billing';
        }).length,
        general: filtered.filter(log => {
          const template = notificationTemplates.find(t => t.id === log.templateId);
          return template?.category === 'general';
        }).length,
        emergency: filtered.filter(log => {
          const template = notificationTemplates.find(t => t.id === log.templateId);
          return template?.category === 'emergency';
        }).length,
      },
      deliveryRate: filtered.length > 0 ? 
        (filtered.filter(log => log.status === 'delivered').length / filtered.length) * 100 : 0,
      readRate: filtered.length > 0 ? 
        (filtered.filter(log => log.status === 'read').length / filtered.length) * 100 : 0,
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics'
    });
  }
};

// Mock functions for sending notifications
async function sendEmail(to: string, subject: string, content: string): Promise<void> {
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  console.log(`📧 Sending email to ${to}: ${subject}`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
}

async function sendSMS(to: string, content: string): Promise<void> {
  // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
  console.log(`📱 Sending SMS to ${to}: ${content}`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
}

async function sendPushNotification(userId: string, content: string): Promise<void> {
  // In production, integrate with push notification service (Firebase, OneSignal, etc.)
  console.log(`🔔 Sending push notification to user ${userId}: ${content}`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
}

async function createInAppNotification(userId: string, content: string): Promise<void> {
  // In production, store in database for in-app display
  console.log(`💬 Creating in-app notification for user ${userId}: ${content}`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
}
