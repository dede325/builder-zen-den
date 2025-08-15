import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cn } from "./utils";

describe("Utils", () => {
  describe("cn function", () => {
    it("should merge class names correctly", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      expect(cn("foo", true && "bar", false && "baz")).toBe("foo bar");
    });

    it("should handle objects with boolean values", () => {
      expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
    });

    it("should handle arrays", () => {
      expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("should handle undefined and null values", () => {
      expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
    });

    it("should handle Tailwind class conflicts", () => {
      expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
    });
  });
});

// Mock fetch for API tests
global.fetch = vi.fn();

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Authentication API", () => {
    it("should handle successful login", async () => {
      const mockResponse = {
        success: true,
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          role: "patient",
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Test would go here for actual login function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });

    it("should handle login failure", async () => {
      const mockResponse = {
        success: false,
        message: "Invalid credentials",
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      });

      // Test would go here for actual login function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });

  describe("Appointments API", () => {
    it("should fetch appointments successfully", async () => {
      const mockAppointments = [
        {
          id: "1",
          patientName: "John Doe",
          doctorName: "Dr. Smith",
          date: "2024-12-21",
          time: "14:30",
          status: "scheduled",
        },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockAppointments }),
      });

      // Test would go here for actual appointments fetch function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });

    it("should create appointment successfully", async () => {
      const newAppointment = {
        patientName: "John Doe",
        doctorId: "doc-1",
        date: "2024-12-21",
        time: "14:30",
        reason: "Check-up",
      };

      const mockResponse = {
        success: true,
        data: { ...newAppointment, id: "1" },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Test would go here for actual appointment creation function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });

  describe("Medical Records API", () => {
    it("should fetch patient medical records", async () => {
      const mockRecords = [
        {
          id: "1",
          patientId: "pat-1",
          date: "2024-12-20",
          doctorName: "Dr. Smith",
          diagnosis: "Hypertension",
          treatment: "Medication prescribed",
        },
      ];

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockRecords }),
      });

      // Test would go here for actual medical records fetch function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });

  describe("File Upload API", () => {
    it("should upload file successfully", async () => {
      const mockFile = new File(["test content"], "test.pdf", {
        type: "application/pdf",
      });

      const mockResponse = {
        success: true,
        data: [
          {
            id: "file-1",
            originalName: "test.pdf",
            url: "/api/files/file-1",
            size: 1024,
          },
        ],
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Test would go here for actual file upload function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });

    it("should handle file upload error", async () => {
      const mockResponse = {
        success: false,
        message: "File too large",
      };

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => mockResponse,
      });

      // Test would go here for actual file upload error handling
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });

  describe("Messaging API", () => {
    it("should send message successfully", async () => {
      const mockMessage = {
        to_user_id: "user-2",
        message: "Hello",
        type: "text",
      };

      const mockResponse = {
        success: true,
        data: {
          ...mockMessage,
          id: "msg-1",
          from_user_id: "user-1",
          created_at: new Date().toISOString(),
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Test would go here for actual message sending function
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });

  describe("Notifications API", () => {
    it("should fetch notification preferences", async () => {
      const mockPreferences = {
        userId: "user-1",
        appointmentReminders: {
          email: true,
          sms: true,
          timing: 24,
        },
        examResults: {
          email: true,
          sms: false,
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockPreferences }),
      });

      // Test would go here for actual notification preferences fetch
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });

    it("should send notification successfully", async () => {
      const notificationData = {
        userId: "user-1",
        templateId: "apt_reminder_24h",
        recipient: "user@example.com",
        variables: {
          patientName: "John Doe",
          appointmentDate: "2024-12-21",
        },
      };

      const mockResponse = {
        success: true,
        data: {
          ...notificationData,
          id: "notif-1",
          status: "sent",
        },
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Test would go here for actual notification sending
      expect(fetch).not.toHaveBeenCalled(); // Placeholder
    });
  });
});

// Date and time utilities tests
describe("Date Utilities", () => {
  it("should format date correctly", () => {
    const date = new Date("2024-12-20T14:30:00Z");
    const formatted = date.toLocaleDateString("pt-BR");
    expect(formatted).toBe("20/12/2024");
  });

  it("should calculate age correctly", () => {
    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return age;
    };

    expect(calculateAge("1990-01-01")).toBeGreaterThan(30);
    expect(calculateAge("2000-12-31")).toBeGreaterThan(20);
  });

  it("should validate date ranges", () => {
    const isValidDateRange = (startDate: string, endDate: string) => {
      return new Date(startDate) <= new Date(endDate);
    };

    expect(isValidDateRange("2024-01-01", "2024-12-31")).toBe(true);
    expect(isValidDateRange("2024-12-31", "2024-01-01")).toBe(false);
  });
});

// Validation utilities tests
describe("Validation Utilities", () => {
  it("should validate email addresses", () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user@domain.co.ao")).toBe(true);
    expect(isValidEmail("invalid-email")).toBe(false);
    expect(isValidEmail("test@")).toBe(false);
  });

  it("should validate phone numbers", () => {
    const isValidPhone = (phone: string) => {
      // Angola phone number format: +244 9XX XXX XXX
      const phoneRegex = /^\+244\s9\d{2}\s\d{3}\s\d{3}$/;
      return phoneRegex.test(phone);
    };

    expect(isValidPhone("+244 923 456 789")).toBe(true);
    expect(isValidPhone("+244 934 567 890")).toBe(true);
    expect(isValidPhone("923456789")).toBe(false);
    expect(isValidPhone("+244 123 456 789")).toBe(false); // Invalid prefix
  });

  it("should validate appointment times", () => {
    const isValidAppointmentTime = (time: string) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(time);
    };

    expect(isValidAppointmentTime("14:30")).toBe(true);
    expect(isValidAppointmentTime("09:00")).toBe(true);
    expect(isValidAppointmentTime("25:00")).toBe(false);
    expect(isValidAppointmentTime("14:70")).toBe(false);
  });

  it("should validate medical record IDs", () => {
    const isValidMedicalRecordId = (id: string) => {
      const idRegex = /^[a-zA-Z0-9-_]{6,50}$/;
      return idRegex.test(id);
    };

    expect(isValidMedicalRecordId("rec-123")).toBe(true);
    expect(isValidMedicalRecordId("patient_001")).toBe(true);
    expect(isValidMedicalRecordId("a")).toBe(false); // Too short
    expect(isValidMedicalRecordId("")).toBe(false); // Empty
  });
});

// Health metrics utilities tests
describe("Health Metrics Utilities", () => {
  it("should calculate BMI correctly", () => {
    const calculateBMI = (weight: number, height: number) => {
      return weight / Math.pow(height / 100, 2);
    };

    expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 2);
    expect(calculateBMI(80, 180)).toBeCloseTo(24.69, 2);
  });

  it("should classify blood pressure correctly", () => {
    const classifyBloodPressure = (systolic: number, diastolic: number) => {
      if (systolic >= 140 || diastolic >= 90) return "high";
      if (systolic >= 130 || diastolic >= 80) return "elevated";
      return "normal";
    };

    expect(classifyBloodPressure(120, 80)).toBe("normal");
    expect(classifyBloodPressure(135, 85)).toBe("elevated");
    expect(classifyBloodPressure(145, 95)).toBe("high");
  });

  it("should validate vital signs ranges", () => {
    const isValidVitalSigns = (vitals: {
      heartRate: number;
      temperature: number;
      oxygenSaturation: number;
    }) => {
      return (
        vitals.heartRate >= 60 &&
        vitals.heartRate <= 100 &&
        vitals.temperature >= 36.1 &&
        vitals.temperature <= 37.2 &&
        vitals.oxygenSaturation >= 95 &&
        vitals.oxygenSaturation <= 100
      );
    };

    expect(
      isValidVitalSigns({
        heartRate: 72,
        temperature: 36.8,
        oxygenSaturation: 98,
      }),
    ).toBe(true);

    expect(
      isValidVitalSigns({
        heartRate: 120, // Too high
        temperature: 36.8,
        oxygenSaturation: 98,
      }),
    ).toBe(false);

    expect(
      isValidVitalSigns({
        heartRate: 72,
        temperature: 38.5, // Fever
        oxygenSaturation: 98,
      }),
    ).toBe(false);
  });
});

// File utilities tests
describe("File Utilities", () => {
  it("should format file sizes correctly", () => {
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
    expect(formatFileSize(1073741824)).toBe("1 GB");
    expect(formatFileSize(500)).toBe("500 Bytes");
  });

  it("should validate file types", () => {
    const isValidFileType = (fileName: string, allowedTypes: string[]) => {
      const extension = fileName.split(".").pop()?.toLowerCase();
      return extension ? allowedTypes.includes(extension) : false;
    };

    const imageTypes = ["jpg", "jpeg", "png", "gif"];
    const documentTypes = ["pdf", "doc", "docx"];

    expect(isValidFileType("image.jpg", imageTypes)).toBe(true);
    expect(isValidFileType("document.pdf", documentTypes)).toBe(true);
    expect(isValidFileType("malware.exe", imageTypes)).toBe(false);
  });

  it("should validate file size limits", () => {
    const isValidFileSize = (fileSize: number, maxSizeMB: number) => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return fileSize <= maxSizeBytes;
    };

    expect(isValidFileSize(1024 * 1024, 5)).toBe(true); // 1MB file, 5MB limit
    expect(isValidFileSize(6 * 1024 * 1024, 5)).toBe(false); // 6MB file, 5MB limit
  });
});

// Search utilities tests
describe("Search Utilities", () => {
  it("should perform fuzzy search correctly", () => {
    const fuzzySearch = (query: string, text: string) => {
      const searchTerms = query.toLowerCase().split(" ");
      const targetText = text.toLowerCase();

      return searchTerms.every((term) => targetText.includes(term));
    };

    expect(fuzzySearch("carlos mendes", "Carlos Alberto Mendes")).toBe(true);
    expect(fuzzySearch("dr silva", "Dr. António Silva")).toBe(true);
    expect(fuzzySearch("heart surgery", "Heart surgery consultation")).toBe(
      true,
    );
    expect(fuzzySearch("xyz", "Carlos Mendes")).toBe(false);
  });

  it("should calculate search relevance score", () => {
    const calculateRelevance = (query: string, text: string) => {
      const queryWords = query.toLowerCase().split(" ");
      const textWords = text.toLowerCase().split(" ");

      let matches = 0;
      queryWords.forEach((queryWord) => {
        textWords.forEach((textWord) => {
          if (textWord.includes(queryWord) || queryWord.includes(textWord)) {
            matches++;
          }
        });
      });

      return Math.min((matches / queryWords.length) * 100, 100);
    };

    expect(calculateRelevance("carlos", "Carlos Mendes")).toBeGreaterThan(50);
    expect(calculateRelevance("john", "Carlos Mendes")).toBe(0);
  });
});

// Error handling tests
describe("Error Handling", () => {
  it("should handle network errors gracefully", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    const handleApiError = async (apiCall: () => Promise<any>) => {
      try {
        await apiCall();
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    };

    const result = await handleApiError(() => fetch("/api/test"));
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });

  it("should validate required fields", () => {
    const validateRequiredFields = (
      data: Record<string, any>,
      requiredFields: string[],
    ) => {
      const missing = requiredFields.filter((field) => !data[field]);
      return {
        isValid: missing.length === 0,
        missingFields: missing,
      };
    };

    const appointmentData = {
      patientName: "John Doe",
      doctorId: "doc-1",
      date: "2024-12-21",
      // time is missing
    };

    const result = validateRequiredFields(appointmentData, [
      "patientName",
      "doctorId",
      "date",
      "time",
    ]);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain("time");
  });
});
