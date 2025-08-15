/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: 'consulta' | 'duvida' | 'sugestao';
  message: string;
}

/**
 * Contact form submission response
 */
export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: number;
  errors?: Record<string, string[]>;
}

/**
 * Contact submission with metadata
 */
export interface ContactSubmission extends ContactFormData {
  id: number;
  submitted_at: string;
  status: 'pending' | 'responded' | 'archived';
}

/**
 * Server date response
 */
export interface ServerDateResponse {
  currentDate: string;
  year: number;
  timestamp: number;
}
