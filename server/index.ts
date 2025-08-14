import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleContactSubmission, getContactSubmissions, updateContactStatus } from "./routes/contact";

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

  return app;
}
