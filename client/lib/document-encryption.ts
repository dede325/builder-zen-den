/**
 * Document Encryption and Management System
 * Implements AES-256-GCM encryption for medical documents
 * Complies with Angola data protection laws and medical record regulations
 */

interface EncryptedDocument {
  id: string;
  filename: string;
  originalSize: number;
  encryptedSize: number;
  mimeType: string;
  category:
    | "medical_record"
    | "exam_result"
    | "prescription"
    | "identity"
    | "insurance"
    | "consent";
  uploadDate: Date;
  lastAccess?: Date;
  accessCount: number;
  patientId: string;
  doctorId?: string;
  encryptionMetadata: {
    algorithm: "AES-256-GCM";
    keyDerivation: "PBKDF2";
    iterations: number;
    salt: string;
    iv: string;
  };
  accessLog: Array<{
    userId: string;
    userRole: string;
    action: "view" | "download" | "share" | "delete";
    timestamp: Date;
    ipAddress?: string;
  }>;
  retention: {
    retentionPeriod: number; // days
    autoDelete: boolean;
    legalBasis: string;
  };
  permissions: {
    [userId: string]: {
      canView: boolean;
      canDownload: boolean;
      canShare: boolean;
      canDelete: boolean;
      expiresAt?: Date;
    };
  };
}

interface EncryptionKey {
  keyId: string;
  derivedKey: CryptoKey;
  salt: Uint8Array;
  createdAt: Date;
}

class DocumentEncryptionManager {
  private keyCache = new Map<string, EncryptionKey>();
  private readonly algorithm = "AES-256-GCM";
  private readonly keyDerivationIterations = 100000;
  private readonly maxFileSize = 50 * 1024 * 1024; // 50MB

  // Initialize crypto subsystem
  async init(): Promise<void> {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Web Crypto API not supported");
    }

    console.log("[DocumentEncryption] Encryption manager initialized");
  }

  // Encrypt a file with AES-256-GCM
  async encryptFile(
    file: File,
    patientId: string,
    category: EncryptedDocument["category"],
    password?: string,
  ): Promise<{ encryptedData: ArrayBuffer; metadata: EncryptedDocument }> {
    if (file.size > this.maxFileSize) {
      throw new Error(
        `Arquivo muito grande. Máximo permitido: ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Validate file type
    this.validateFileType(file, category);

    // Generate encryption key
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const derivedKey = await this.deriveKey(
      password || this.generatePatientKey(patientId),
      salt,
    );

    // Read file data
    const fileData = await this.readFileAsArrayBuffer(file);

    // Encrypt the file
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      derivedKey,
      fileData,
    );

    // Create metadata
    const metadata: EncryptedDocument = {
      id: this.generateDocumentId(),
      filename: file.name,
      originalSize: file.size,
      encryptedSize: encryptedData.byteLength,
      mimeType: file.type,
      category,
      uploadDate: new Date(),
      accessCount: 0,
      patientId,
      encryptionMetadata: {
        algorithm: "AES-256-GCM",
        keyDerivation: "PBKDF2",
        iterations: this.keyDerivationIterations,
        salt: this.arrayBufferToBase64(salt),
        iv: this.arrayBufferToBase64(iv),
      },
      accessLog: [],
      retention: this.getRetentionPolicy(category),
      permissions: {},
    };

    // Log the encryption
    this.logAccess(metadata, "upload", "system");

    return { encryptedData, metadata };
  }

  // Decrypt a file
  async decryptFile(
    encryptedData: ArrayBuffer,
    metadata: EncryptedDocument,
    password?: string,
    userId?: string,
  ): Promise<Blob> {
    // Check permissions
    if (userId && !this.hasPermission(metadata, userId, "view")) {
      throw new Error("Acesso negado ao documento");
    }

    try {
      // Derive the key
      const salt = this.base64ToArrayBuffer(metadata.encryptionMetadata.salt);
      const iv = this.base64ToArrayBuffer(metadata.encryptionMetadata.iv);

      const derivedKey = await this.deriveKey(
        password || this.generatePatientKey(metadata.patientId),
        salt,
      );

      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        derivedKey,
        encryptedData,
      );

      // Log the access
      if (userId) {
        this.logAccess(metadata, "view", userId);
      }

      // Create blob with original mime type
      return new Blob([decryptedData], { type: metadata.mimeType });
    } catch (error) {
      console.error("[DocumentEncryption] Decryption failed:", error);
      throw new Error(
        "Falha na desencriptação. Senha incorreta ou arquivo corrompido.",
      );
    }
  }

  // Upload encrypted document to server
  async uploadEncryptedDocument(
    encryptedData: ArrayBuffer,
    metadata: EncryptedDocument,
  ): Promise<string> {
    const formData = new FormData();
    const encryptedBlob = new Blob([encryptedData], {
      type: "application/octet-stream",
    });

    formData.append("file", encryptedBlob, `${metadata.id}.encrypted`);
    formData.append("metadata", JSON.stringify(metadata));
    formData.append("category", metadata.category);
    formData.append("patientId", metadata.patientId);

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
        "X-Document-Encrypted": "true",
        "X-Angola-Compliance": "true",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Falha no upload: ${response.statusText}`);
    }

    const result = await response.json();
    return result.documentId;
  }

  // Download and decrypt document
  async downloadDocument(
    documentId: string,
    password?: string,
    userId?: string,
  ): Promise<{ blob: Blob; metadata: EncryptedDocument }> {
    // Get document metadata
    const metadataResponse = await fetch(
      `/api/documents/${documentId}/metadata`,
      {
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
      },
    );

    if (!metadataResponse.ok) {
      throw new Error("Documento não encontrado");
    }

    const metadata: EncryptedDocument = await metadataResponse.json();

    // Check if document has expired
    if (this.isDocumentExpired(metadata)) {
      throw new Error("Documento expirado e foi removido automaticamente");
    }

    // Download encrypted file
    const fileResponse = await fetch(`/api/documents/${documentId}/download`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!fileResponse.ok) {
      throw new Error("Falha no download do documento");
    }

    const encryptedData = await fileResponse.arrayBuffer();

    // Decrypt the file
    const decryptedBlob = await this.decryptFile(
      encryptedData,
      metadata,
      password,
      userId,
    );

    // Update access count and last access
    await this.updateDocumentAccess(documentId, userId);

    return { blob: decryptedBlob, metadata };
  }

  // Share document with specific user
  async shareDocument(
    documentId: string,
    targetUserId: string,
    permissions: Partial<EncryptedDocument["permissions"][string]>,
    expiresInDays?: number,
  ): Promise<void> {
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const response = await fetch(`/api/documents/${documentId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({
        targetUserId,
        permissions: {
          canView: true,
          canDownload: false,
          canShare: false,
          canDelete: false,
          ...permissions,
          expiresAt,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao partilhar documento");
    }
  }

  // Delete document (with audit trail)
  async deleteDocument(
    documentId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    const response = await fetch(`/api/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({
        reason,
        deletedBy: userId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Falha ao eliminar documento");
    }
  }

  // Generate secure patient-specific key
  private generatePatientKey(patientId: string): string {
    // In production, this would use a more secure method
    // combining patient ID with a master key stored securely
    return `patient_${patientId}_${Date.now()}`;
  }

  // Derive encryption key using PBKDF2
  private async deriveKey(
    password: string,
    salt: Uint8Array,
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);

    // Import the password as a key
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"],
    );

    // Derive the actual encryption key
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: this.keyDerivationIterations,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    );
  }

  // Validate file type based on category
  private validateFileType(
    file: File,
    category: EncryptedDocument["category"],
  ): void {
    const allowedTypes: Record<EncryptedDocument["category"], string[]> = {
      medical_record: [
        "application/pdf",
        "text/plain",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      exam_result: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "application/dicom",
        "text/plain",
      ],
      prescription: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "text/plain",
      ],
      identity: ["application/pdf", "image/jpeg", "image/png"],
      insurance: ["application/pdf", "image/jpeg", "image/png", "text/plain"],
      consent: ["application/pdf", "image/jpeg", "image/png"],
    };

    const allowed = allowedTypes[category];
    if (!allowed.includes(file.type)) {
      throw new Error(
        `Tipo de arquivo não permitido para a categoria ${category}`,
      );
    }
  }

  // Get retention policy based on document category
  private getRetentionPolicy(
    category: EncryptedDocument["category"],
  ): EncryptedDocument["retention"] {
    const policies = {
      medical_record: {
        retentionPeriod: 3650,
        autoDelete: true,
        legalBasis: "Lei de Registos Médicos Angola",
      }, // 10 years
      exam_result: {
        retentionPeriod: 2555,
        autoDelete: true,
        legalBasis: "Normas Sanitárias Nacionais",
      }, // 7 years
      prescription: {
        retentionPeriod: 1825,
        autoDelete: true,
        legalBasis: "Regulamento Farmacêutico",
      }, // 5 years
      identity: {
        retentionPeriod: 365,
        autoDelete: false,
        legalBasis: "Lei 22/11 Proteção Dados",
      }, // 1 year
      insurance: {
        retentionPeriod: 1095,
        autoDelete: true,
        legalBasis: "Normas Seguradoras",
      }, // 3 years
      consent: {
        retentionPeriod: 2555,
        autoDelete: false,
        legalBasis: "Lei Consentimento Informado",
      }, // 7 years
    };

    return policies[category];
  }

  // Check if user has permission for specific action
  private hasPermission(
    metadata: EncryptedDocument,
    userId: string,
    action: keyof EncryptedDocument["permissions"][string],
  ): boolean {
    const userPermissions = metadata.permissions[userId];
    if (!userPermissions) return false;

    // Check if permission has expired
    if (userPermissions.expiresAt && new Date() > userPermissions.expiresAt) {
      return false;
    }

    return userPermissions[action] === true;
  }

  // Log document access for audit trail
  private logAccess(
    metadata: EncryptedDocument,
    action: "view" | "download" | "share" | "delete" | "upload",
    userId: string,
  ): void {
    const logEntry = {
      userId,
      userRole: this.getUserRole(userId),
      action,
      timestamp: new Date(),
      ipAddress: this.getClientIP(),
    };

    metadata.accessLog.push(logEntry);
    metadata.lastAccess = new Date();
    metadata.accessCount++;

    // Send to audit service
    this.sendAuditLog(metadata.id, logEntry);
  }

  // Check if document has expired based on retention policy
  private isDocumentExpired(metadata: EncryptedDocument): boolean {
    const expiryDate = new Date(metadata.uploadDate);
    expiryDate.setDate(
      expiryDate.getDate() + metadata.retention.retentionPeriod,
    );

    return metadata.retention.autoDelete && new Date() > expiryDate;
  }

  // Update document access statistics
  private async updateDocumentAccess(
    documentId: string,
    userId?: string,
  ): Promise<void> {
    if (!userId) return;

    try {
      await fetch(`/api/documents/${documentId}/access`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          userId,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("[DocumentEncryption] Failed to update access log:", error);
    }
  }

  // Send audit log to compliance service
  private async sendAuditLog(documentId: string, logEntry: any): Promise<void> {
    try {
      await fetch("/api/audit/document-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          documentId,
          ...logEntry,
          compliance: "Lei 22/11 Angola",
        }),
      });
    } catch (error) {
      console.error("[DocumentEncryption] Failed to send audit log:", error);
    }
  }

  // Utility functions
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private generateDocumentId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getAuthToken(): string {
    const auth = localStorage.getItem("bem-cuidar-auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        return parsed.state?.session?.access_token || "";
      } catch {
        return "";
      }
    }
    return "";
  }

  private getUserRole(userId: string): string {
    // Get from auth store or API
    return "unknown";
  }

  private getClientIP(): string {
    // In a real implementation, this would be determined server-side
    return "unknown";
  }
}

// Export singleton instance
export const documentEncryption = new DocumentEncryptionManager();

// Auto-initialize
documentEncryption.init().catch(console.error);

export default documentEncryption;
export type { EncryptedDocument };
