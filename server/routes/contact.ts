import { RequestHandler } from "express";
import { database, ContactSubmission } from "../database";
import { emailService } from "../email";
import { z } from "zod";

// Validation schema for contact form
const ContactFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos").regex(/^[\+]?[0-9\s\-\(\)]+$/, "Formato de telefone inválido"),
  subject: z.enum(["consulta", "duvida", "sugestao"], {
    errorMap: () => ({ message: "Assunto deve ser consulta, dúvida ou sugestão" })
  }),
  message: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres")
});

export const handleContactSubmission: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validationResult = ContactFormSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const formData = validationResult.data;

    // Save to database
    const submissionId = await database.insertContactSubmission(formData);
    
    console.log(`Contact submission saved with ID: ${submissionId}`);

    // Prepare submission object for email
    const submission: ContactSubmission = {
      id: submissionId,
      ...formData,
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };

    // Send email notification (non-blocking)
    emailService.sendContactNotification(submission)
      .then(() => {
        console.log(`Email notification sent for submission ID: ${submissionId}`);
      })
      .catch((error) => {
        console.error(`Failed to send email for submission ID: ${submissionId}`, error);
        // Update status to indicate email failure (optional)
        database.updateSubmissionStatus(submissionId, 'pending').catch(console.error);
      });

    // Return immediate success response
    res.json({
      success: true,
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      submissionId
    });

  } catch (error) {
    console.error("Error processing contact form:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor. Tente novamente mais tarde."
    });
  }
};

export const getContactSubmissions: RequestHandler = async (req, res) => {
  try {
    const submissions = await database.getContactSubmissions();
    
    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar mensagens de contato"
    });
  }
};

export const updateContactStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'responded', 'archived'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status inválido"
      });
    }

    await database.updateSubmissionStatus(parseInt(id), status);
    
    res.json({
      success: true,
      message: "Status atualizado com sucesso"
    });
  } catch (error) {
    console.error("Error updating contact status:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar status"
    });
  }
};
