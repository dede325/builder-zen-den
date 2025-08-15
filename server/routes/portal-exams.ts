/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

import { RequestHandler } from "express";
import { portalStorage } from "../portal-storage";
import { ApiResponse } from "../types";
import { PDFGenerator } from "../pdf-generator";

export const getExamResults: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    const examResults = portalStorage.getPatientExamResults(patient.id);

    res.json({
      success: true,
      data: examResults,
    });
  } catch (error) {
    console.error("Error getting exam results:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar resultados de exames",
    });
  }
};

export const markExamAsViewed: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = (req as any).patient;

    // Verify exam belongs to patient
    const examResults = portalStorage.getPatientExamResults(patient.id);
    const examExists = examResults.some((e) => e.id === id);

    if (!examExists) {
      return res.status(404).json({
        success: false,
        message: "Resultado de exame não encontrado",
      });
    }

    const updatedExam = portalStorage.updateExamResult(id, {
      status: "viewed",
      updatedAt: new Date().toISOString(),
    });

    if (!updatedExam) {
      return res.status(404).json({
        success: false,
        message: "Resultado de exame não encontrado",
      });
    }

    res.json({
      success: true,
      data: updatedExam,
      message: "Exame marcado como visualizado",
    });
  } catch (error) {
    console.error("Error marking exam as viewed:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao marcar exame como visualizado",
    });
  }
};

export const downloadExamResult: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = (req as any).patient;

    // Verify exam belongs to patient
    const examResults = portalStorage.getPatientExamResults(patient.id);
    const exam = examResults.find((e) => e.id === id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Resultado de exame não encontrado",
      });
    }

    if (exam.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Resultado ainda não disponível",
      });
    }

    // In a real app, this would serve the actual PDF file
    // For now, we'll return a mock response
    res.json({
      success: true,
      data: {
        downloadUrl: `/api/portal/exams/${id}/download-file`,
        filename: `${exam.name.replace(/\s+/g, "_")}.pdf`,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      },
      message: "Link de download gerado",
    });
  } catch (error) {
    console.error("Error generating download link:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao gerar link de download",
    });
  }
};

export const downloadExamFile: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = (req as any).patient;

    // Verify exam belongs to patient
    const examResults = portalStorage.getPatientExamResults(patient.id);
    const exam = examResults.find((e) => e.id === id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Resultado de exame não encontrado",
      });
    }

    if (exam.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Resultado ainda não disponível",
      });
    }

    // Mark as viewed if not already
    if (exam.status !== "viewed") {
      portalStorage.updateExamResult(id, { status: "viewed" });
    }

    // Generate PDF content
    const pdfContent = PDFGenerator.generateExamPDF({ patient, exam });
    const fileName = PDFGenerator.generatePDFFileName(exam, patient);

    // Set headers for PDF download
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(".pdf", ".html")}"`,
    );

    // Send the HTML content (in production, this would be converted to PDF)
    res.send(pdfContent);
  } catch (error) {
    console.error("Error downloading exam file:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao baixar arquivo do exame",
    });
  }
};

export const getExamStatistics: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    const examResults = portalStorage.getPatientExamResults(patient.id);

    const stats = {
      total: examResults.length,
      pending: examResults.filter((e) => e.status === "pending").length,
      ready: examResults.filter((e) => e.status === "ready").length,
      viewed: examResults.filter((e) => e.status === "viewed").length,
      byType: examResults.reduce(
        (acc, exam) => {
          acc[exam.type] = (acc[exam.type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error getting exam statistics:", error);

    res.status(500).json({
      success: false,
      message: "Erro ao buscar estatísticas de exames",
    });
  }
};
