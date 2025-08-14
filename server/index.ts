import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContactSubmission, getContactSubmissions, updateContactStatus } from "./routes/contact";
import { testEmailConnection, sendTestEmail } from "./routes/email-test";

// Portal routes
import { handleLogin, handleLogout, requireAuth } from "./routes/portal-auth";
import { getProfile, updateProfile, getNotificationSettings, updateNotificationSettings } from "./routes/portal-patients";
import { getAppointments, createAppointment, updateAppointment, cancelAppointment } from "./routes/portal-appointments";
import { getExamResults, markExamAsViewed, downloadExamResult, downloadExamFile, getExamStatistics } from "./routes/portal-exams";

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

  return app;
}
