import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContactSubmission, getContactSubmissions, updateContactStatus } from "./routes/contact";
import { testEmailConnection, sendTestEmail } from "./routes/email-test";

// Portal routes - temporarily commented to resolve startup issue
// import { handleLogin, handleLogout, requireAuth } from "./routes/portal-auth";
// import { getProfile, updateProfile, getNotificationSettings, updateNotificationSettings } from "./routes/portal-patients";
// import { getAppointments, createAppointment, updateAppointment, cancelAppointment } from "./routes/portal-appointments";
// import { getExamResults, markExamAsViewed, downloadExamResult, downloadExamFile, getExamStatistics } from "./routes/portal-exams";
// import { checkPermissions, getUserPermissions, getRolePermissions, validateAction } from "./routes/portal-permissions";

export function createServer() {
  const app = express();

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

  // Contact form routes
  app.post("/api/contact", handleContactSubmission);
  app.get("/api/contact/submissions", getContactSubmissions);
  app.patch("/api/contact/submissions/:id", updateContactStatus);

  // Email test routes (development only)
  if (process.env.NODE_ENV === 'development') {
    app.get("/api/email/test-connection", testEmailConnection);
    app.post("/api/email/send-test", sendTestEmail);
  }

  // Portal authentication routes
  app.post("/api/portal/auth/login", handleLogin);
  app.post("/api/portal/auth/logout", handleLogout);

  // Portal patient routes (protected)
  app.get("/api/portal/profile", requireAuth, getProfile);
  app.patch("/api/portal/profile", requireAuth, updateProfile);
  app.get("/api/portal/notifications", requireAuth, getNotificationSettings);
  app.patch("/api/portal/notifications", requireAuth, updateNotificationSettings);

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

  return app;
}
