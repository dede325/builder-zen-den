import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { createServer } from "../../server/index";
import { database } from "../../server/database";
import fs from "fs";
import path from "path";

// Global test variables
declare global {
  var testApp: any;
  var testServer: any;
  var testDatabase: any;
}

beforeAll(async () => {
  // Setup test database
  const testDbPath = path.join(process.cwd(), "tests/test.db");

  // Remove existing test database
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  // Initialize test server
  const { app, server } = createServer();
  global.testApp = app;
  global.testServer = server;
  global.testDatabase = database;

  // Wait for server to be ready
  await new Promise((resolve) => setTimeout(resolve, 1000));
});

afterAll(async () => {
  // Cleanup
  if (global.testDatabase) {
    global.testDatabase.close();
  }

  if (global.testServer) {
    global.testServer.close();
  }

  // Remove test database
  const testDbPath = path.join(process.cwd(), "tests/test.db");
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

beforeEach(async () => {
  // Clear test data before each test
  // In a real implementation, you would reset the database state
});

afterEach(async () => {
  // Cleanup after each test
  // Reset any modified state
});

// Test utilities
export const createTestUser = (overrides = {}) => ({
  id: `test-user-${Date.now()}`,
  email: "test@example.com",
  name: "Test User",
  role: "patient",
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createTestAppointment = (overrides = {}) => ({
  id: `test-apt-${Date.now()}`,
  patientId: "test-patient-1",
  doctorId: "test-doctor-1",
  doctorName: "Dr. Test",
  specialty: "Cardiologia",
  date: "2024-12-21",
  time: "14:30",
  status: "scheduled",
  reason: "Test appointment",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createTestMessage = (overrides = {}) => ({
  id: `test-msg-${Date.now()}`,
  from_user_id: "test-user-1",
  to_user_id: "test-user-2",
  message: "Test message",
  type: "text",
  read: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createTestExamResult = (overrides = {}) => ({
  id: `test-exam-${Date.now()}`,
  patientId: "test-patient-1",
  name: "Test Exam",
  type: "Blood Test",
  date: "2024-12-20",
  status: "ready",
  results: "Normal",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createTestVitalSigns = (overrides = {}) => ({
  id: `test-vital-${Date.now()}`,
  patient_id: "test-patient-1",
  recorded_by_user_id: "test-nurse-1",
  blood_pressure_systolic: 120,
  blood_pressure_diastolic: 80,
  heart_rate: 72,
  temperature: 36.8,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

// Mock data generators
export const generateMockPatients = (count = 5) => {
  return Array.from({ length: count }, (_, i) =>
    createTestUser({
      id: `patient-${i + 1}`,
      email: `patient${i + 1}@example.com`,
      name: `Patient ${i + 1}`,
      role: "patient",
    }),
  );
};

export const generateMockDoctors = (count = 3) => {
  const specialties = ["Cardiologia", "Pediatria", "Dermatologia"];
  return Array.from({ length: count }, (_, i) =>
    createTestUser({
      id: `doctor-${i + 1}`,
      email: `doctor${i + 1}@bemcuidar.co.ao`,
      name: `Dr. Doctor ${i + 1}`,
      role: "doctor",
      specialty: specialties[i % specialties.length],
    }),
  );
};

export const generateMockAppointments = (count = 10) => {
  const statuses = ["scheduled", "confirmed", "completed", "cancelled"];
  const specialties = ["Cardiologia", "Pediatria", "Dermatologia"];

  return Array.from({ length: count }, (_, i) =>
    createTestAppointment({
      id: `appointment-${i + 1}`,
      patientId: `patient-${(i % 5) + 1}`,
      doctorId: `doctor-${(i % 3) + 1}`,
      doctorName: `Dr. Doctor ${(i % 3) + 1}`,
      specialty: specialties[i % specialties.length],
      status: statuses[i % statuses.length],
      date: new Date(Date.now() + (i - 5) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: `${9 + (i % 8)}:${(i % 2) * 30}0`,
    }),
  );
};

// API test helpers
export const makeAuthenticatedRequest = async (
  method: string,
  path: string,
  data?: any,
) => {
  const token = "test-auth-token"; // Mock token
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // This would use your test app to make requests
  // Implementation depends on your testing framework
  return { method, path, data, headers };
};

// Database test helpers
export const seedTestDatabase = async () => {
  // Seed the test database with initial data
  const patients = generateMockPatients(10);
  const doctors = generateMockDoctors(5);
  const appointments = generateMockAppointments(20);

  // In a real implementation, you would insert this data into the test database
  console.log("Seeding test database with:", {
    patients: patients.length,
    doctors: doctors.length,
    appointments: appointments.length,
  });
};

export const clearTestDatabase = async () => {
  // Clear all test data from the database
  // In a real implementation, you would truncate or delete test tables
  console.log("Clearing test database");
};

// WebSocket test helpers
export const createMockWebSocket = () => {
  const events: Record<string, Function[]> = {};

  return {
    on: (event: string, handler: Function) => {
      if (!events[event]) events[event] = [];
      events[event].push(handler);
    },
    emit: (event: string, ...args: any[]) => {
      if (events[event]) {
        events[event].forEach((handler) => handler(...args));
      }
    },
    send: (data: any) => {
      console.log("Mock WebSocket send:", data);
    },
    close: () => {
      console.log("Mock WebSocket closed");
    },
  };
};

// File upload test helpers
export const createTestFile = (
  name = "test.pdf",
  type = "application/pdf",
  content = "test content",
) => {
  return new File([content], name, { type });
};

export const createTestImage = (name = "test.jpg", type = "image/jpeg") => {
  // Create a minimal JPEG header for testing
  const content = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46,
  ]);
  return new File([content], name, { type });
};

// Time simulation helpers
export const mockCurrentTime = (timestamp: string) => {
  const mockDate = new Date(timestamp);
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
};

export const restoreTime = () => {
  vi.useRealTimers();
};
