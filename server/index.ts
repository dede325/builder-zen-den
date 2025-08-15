/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getServerDate } from "./routes/server-date";
import {
  handleContactSubmission,
  getContactSubmissions,
  updateContactStatus,
} from "./routes/contact";
import { testEmailConnection, sendTestEmail } from "./routes/email-test";

// Portal routes
import { handleLogin, handleLogout, requireAuth } from "./routes/portal-auth";
import {
  getProfile,
  updateProfile,
  getNotificationSettings,
  updateNotificationSettings,
} from "./routes/portal-patients";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from "./routes/portal-appointments";
import {
  getExamResults,
  markExamAsViewed,
  downloadExamResult,
  downloadExamFile,
  getExamStatistics,
} from "./routes/portal-exams";
import {
  checkPermissions,
  getUserPermissions,
  getRolePermissions,
  validateAction,
} from "./routes/portal-permissions";
import { getLoginHintsHandler } from "./routes/login-hints";

// New enhanced routes
import {
  getMessages,
  sendMessage,
  markMessageAsRead,
  getConversation,
  getMessagingContacts
} from "./routes/messaging";
import {
  uploadFiles,
  getFile,
  getCompressedFile,
  getThumbnail,
  getUserFiles,
  deleteFile,
  uploadProfilePicture,
  getStorageStats,
  handleUploadError
} from "./routes/file-upload";
import {
  createVitalSigns,
  getPatientVitalSigns,
  getTodayVitalSigns,
  getVitalSignsStats,
  updateVitalSigns,
  getVitalSignsAlerts
} from "./routes/vital-signs";
import {
  getNotificationTemplates,
  sendNotification,
  getNotificationLogs,
  getNotificationPreferences,
  updateNotificationPreferences,
  sendBulkNotifications,
  getNotificationStats
} from "./routes/notifications";
import { upload } from "./file-upload";
import { initializeWebSocket } from "./websocket";
import { createServer as createHttpServer } from "http";

export function createServer() {
  const app = express();

  // Create HTTP server for WebSocket
  const server = createHttpServer(app);

  // Initialize WebSocket
  initializeWebSocket(server);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/server-date", getServerDate);

  // Contact form routes
  app.post("/api/contact", handleContactSubmission);
  app.get("/api/contact/submissions", getContactSubmissions);
  app.patch("/api/contact/submissions/:id", updateContactStatus);

  // Email test routes (development only)
  if (process.env.NODE_ENV === "development") {
    app.get("/api/email/test-connection", testEmailConnection);
    app.post("/api/email/send-test", sendTestEmail);
  }

  // Portal authentication routes
  app.post("/api/portal/auth/login", handleLogin);
  app.post("/api/portal/auth/logout", handleLogout);
  app.get("/api/portal/auth/login-hints", getLoginHintsHandler);

  // Portal patient routes (protected)
  app.get("/api/portal/profile", requireAuth, getProfile);
  app.patch("/api/portal/profile", requireAuth, updateProfile);
  app.get("/api/portal/notifications", requireAuth, getNotificationSettings);
  app.patch(
    "/api/portal/notifications",
    requireAuth,
    updateNotificationSettings,
  );

  // Portal appointment routes (protected)
  app.get("/api/portal/appointments", requireAuth, getAppointments);
  app.post("/api/portal/appointments", requireAuth, createAppointment);
  app.patch("/api/portal/appointments/:id", requireAuth, updateAppointment);
  app.delete("/api/portal/appointments/:id", requireAuth, cancelAppointment);

  // Portal exam routes (protected)
  app.get("/api/portal/exams", requireAuth, getExamResults);
  app.patch("/api/portal/exams/:id/viewed", requireAuth, markExamAsViewed);
  app.get("/api/portal/exams/:id/download", requireAuth, downloadExamResult);
  app.get("/api/portal/exams/:id/download-file", requireAuth, downloadExamFile);
  app.get("/api/portal/exams/statistics", requireAuth, getExamStatistics);

  // Portal permission routes (protected)
  app.get("/api/portal/permissions/check", requireAuth, checkPermissions);
  app.get("/api/portal/permissions/user", requireAuth, getUserPermissions);
  app.get("/api/portal/permissions/role/:role", getRolePermissions);
  app.post("/api/portal/permissions/validate", requireAuth, validateAction);

  // Messaging routes (protected)
  app.get("/api/messaging/messages", requireAuth, getMessages);
  app.post("/api/messaging/messages", requireAuth, sendMessage);
  app.patch("/api/messaging/messages/:messageId/read", requireAuth, markMessageAsRead);
  app.get("/api/messaging/conversation/:userId/:otherUserId", requireAuth, getConversation);
  app.get("/api/messaging/contacts", requireAuth, getMessagingContacts);

  // File upload routes (protected)
  if (upload) {
    app.post("/api/files/upload", requireAuth, upload.array('files', 5), uploadFiles, handleUploadError);
    app.post("/api/files/upload/profile", requireAuth, upload.single('profile'), uploadProfilePicture, handleUploadError);
  } else {
    app.post("/api/files/upload", requireAuth, (req, res) => {
      res.status(503).json({ success: false, message: 'File upload not available in this environment' });
    });
    app.post("/api/files/upload/profile", requireAuth, (req, res) => {
      res.status(503).json({ success: false, message: 'File upload not available in this environment' });
    });
  }
  app.get("/api/files/:fileId", requireAuth, getFile);
  app.get("/api/files/:fileId/compressed", requireAuth, getCompressedFile);
  app.get("/api/files/:fileId/thumbnail", requireAuth, getThumbnail);
  app.get("/api/files/user/:userId", requireAuth, getUserFiles);
  app.delete("/api/files/:fileId", requireAuth, deleteFile);
  app.get("/api/files/user/:userId/stats", requireAuth, getStorageStats);

  // Vital signs routes (protected)
  app.post("/api/vital-signs", requireAuth, createVitalSigns);
  app.get("/api/vital-signs/patient/:patientId", requireAuth, getPatientVitalSigns);
  app.get("/api/vital-signs/today", requireAuth, getTodayVitalSigns);
  app.get("/api/vital-signs/stats/:nurseId", requireAuth, getVitalSignsStats);
  app.patch("/api/vital-signs/:vitalId", requireAuth, updateVitalSigns);
  app.get("/api/vital-signs/alerts", requireAuth, getVitalSignsAlerts);

  // Notification routes (protected)
  app.get("/api/notifications/templates", requireAuth, getNotificationTemplates);
  app.post("/api/notifications/send", requireAuth, sendNotification);
  app.post("/api/notifications/send-bulk", requireAuth, sendBulkNotifications);
  app.get("/api/notifications/logs", requireAuth, getNotificationLogs);
  app.get("/api/notifications/preferences/:userId", requireAuth, getNotificationPreferences);
  app.put("/api/notifications/preferences/:userId", requireAuth, updateNotificationPreferences);
  app.get("/api/notifications/stats", requireAuth, getNotificationStats);

  return { app, server };
}
