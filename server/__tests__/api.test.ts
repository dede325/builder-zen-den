import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createServer } from "../index";
import request from "supertest";

// Mock database
vi.mock("../database", () => ({
  database: {
    createMessage: vi.fn(),
    getMessages: vi.fn(),
    markMessageAsRead: vi.fn(),
    createFileUpload: vi.fn(),
    getFileUpload: vi.fn(),
    getUserFiles: vi.fn(),
    createVitalSigns: vi.fn(),
    getPatientVitalSigns: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
    getUsersByRole: vi.fn(),
    close: vi.fn(),
  },
}));

// Mock WebSocket
vi.mock("../websocket", () => ({
  initializeWebSocket: vi.fn(),
  getWebSocketManager: vi.fn(() => ({
    sendToUser: vi.fn(),
    broadcastToRole: vi.fn(),
  })),
}));

// Mock file upload
vi.mock("../file-upload", () => ({
  upload: null,
  fileUploadService: {
    processUploadedFile: vi.fn(),
    getFile: vi.fn(),
    getUserFiles: vi.fn(),
  },
}));

describe("API Routes", () => {
  let app: any;
  let server: any;

  beforeEach(() => {
    const result = createServer();
    app = result.app;
    server = result.server;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Health Check", () => {
    it("should respond to ping", async () => {
      const response = await request(app).get("/api/ping").expect(200);

      expect(response.body).toHaveProperty("message");
    });

    it("should return server date", async () => {
      const response = await request(app).get("/api/server-date").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("Contact Routes", () => {
    it("should submit contact form", async () => {
      const contactData = {
        name: "João Silva",
        email: "joao@example.com",
        phone: "+244 923 456 789",
        subject: "consulta",
        message: "Gostaria de agendar uma consulta",
      };

      const response = await request(app)
        .post("/api/contact")
        .send(contactData)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should validate required fields in contact form", async () => {
      const invalidData = {
        name: "João Silva",
        // missing email, phone, subject, message
      };

      const response = await request(app)
        .post("/api/contact")
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should get contact submissions", async () => {
      const response = await request(app)
        .get("/api/contact/submissions")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("Portal Authentication", () => {
    it("should login with valid credentials", async () => {
      const loginData = {
        email: "paciente@example.com",
        password: "123456",
      };

      const response = await request(app)
        .post("/api/portal/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("user");
    });

    it("should reject invalid credentials", async () => {
      const loginData = {
        email: "invalid@example.com",
        password: "wrongpassword",
      };

      const response = await request(app)
        .post("/api/portal/auth/login")
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should logout user", async () => {
      const response = await request(app)
        .post("/api/portal/auth/logout")
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("Messaging Routes", () => {
    const authToken = "mock-auth-token";

    it("should get messages for user", async () => {
      const response = await request(app)
        .get("/api/messaging/messages?userId=user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });

    it("should send message", async () => {
      const messageData = {
        from_user_id: "user-1",
        to_user_id: "user-2",
        message: "Hello, Doctor!",
        type: "text",
      };

      const response = await request(app)
        .post("/api/messaging/messages")
        .set("Authorization", `Bearer ${authToken}`)
        .send(messageData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should mark message as read", async () => {
      const response = await request(app)
        .patch("/api/messaging/messages/msg-1/read")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get messaging contacts", async () => {
      const response = await request(app)
        .get("/api/messaging/contacts?userRole=patient")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });
  });

  describe("File Upload Routes", () => {
    const authToken = "mock-auth-token";

    it("should handle missing file upload service", async () => {
      const response = await request(app)
        .post("/api/files/upload")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(503);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toContain("not available");
    });

    it("should get user files", async () => {
      const response = await request(app)
        .get("/api/files/user/user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get file by ID", async () => {
      const response = await request(app)
        .get("/api/files/file-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404); // Will 404 in test since file doesn't exist

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("Vital Signs Routes", () => {
    const authToken = "mock-auth-token";

    it("should create vital signs", async () => {
      const vitalData = {
        patient_id: "patient-1",
        recorded_by_user_id: "nurse-1",
        blood_pressure_systolic: 120,
        blood_pressure_diastolic: 80,
        heart_rate: 72,
        temperature: 36.8,
      };

      const response = await request(app)
        .post("/api/vital-signs")
        .set("Authorization", `Bearer ${authToken}`)
        .send(vitalData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get patient vital signs", async () => {
      const response = await request(app)
        .get("/api/vital-signs/patient/patient-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get today vital signs", async () => {
      const response = await request(app)
        .get("/api/vital-signs/today")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get vital signs stats", async () => {
      const response = await request(app)
        .get("/api/vital-signs/stats/nurse-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("Notification Routes", () => {
    const authToken = "mock-auth-token";

    it("should get notification templates", async () => {
      const response = await request(app)
        .get("/api/notifications/templates")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
    });

    it("should send notification", async () => {
      const notificationData = {
        userId: "user-1",
        templateId: "apt_reminder_24h",
        recipient: "user@example.com",
        variables: {
          patientName: "João Silva",
          appointmentDate: "2024-12-21",
        },
      };

      const response = await request(app)
        .post("/api/notifications/send")
        .set("Authorization", `Bearer ${authToken}`)
        .send(notificationData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get notification logs", async () => {
      const response = await request(app)
        .get("/api/notifications/logs?userId=user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get notification preferences", async () => {
      const response = await request(app)
        .get("/api/notifications/preferences/user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should update notification preferences", async () => {
      const preferences = {
        appointmentReminders: {
          email: true,
          sms: false,
          timing: 24,
        },
      };

      const response = await request(app)
        .put("/api/notifications/preferences/user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .send(preferences)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should send bulk notifications", async () => {
      const bulkData = {
        templateId: "general_announcement",
        recipients: [
          { userId: "user-1", address: "user1@example.com" },
          { userId: "user-2", address: "user2@example.com" },
        ],
        variables: {
          announcementTitle: "System Maintenance",
        },
      };

      const response = await request(app)
        .post("/api/notifications/send-bulk")
        .set("Authorization", `Bearer ${authToken}`)
        .send(bulkData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });

    it("should get notification stats", async () => {
      const response = await request(app)
        .get("/api/notifications/stats?userId=user-1")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 for unknown routes", async () => {
      const response = await request(app).get("/api/unknown-route").expect(404);

      expect(response.body).toHaveProperty("error");
    });

    it("should handle missing authentication", async () => {
      const response = await request(app)
        .get("/api/messaging/messages")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should validate request body", async () => {
      const response = await request(app)
        .post("/api/messaging/messages")
        .set("Authorization", "Bearer mock-token")
        .send({}) // Empty body
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("Rate Limiting", () => {
    it("should handle rapid requests gracefully", async () => {
      // Test multiple rapid requests
      const promises = Array(10)
        .fill(null)
        .map(() => request(app).get("/api/ping"));

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        expect(response.status).toBeLessThan(500);
      });
    });
  });

  describe("CORS Headers", () => {
    it("should include CORS headers", async () => {
      const response = await request(app).options("/api/ping").expect(204);

      // CORS headers should be present
      expect(response.headers).toHaveProperty("access-control-allow-origin");
    });
  });
});
