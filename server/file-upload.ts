import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import { database } from './database';

// Conditional imports to prevent build issues
let multer: any;
let sharp: any;
let uuidv4: any;

try {
  multer = require('multer');
  sharp = require('sharp');
  const uuid = require('uuid');
  uuidv4 = uuid.v4;
} catch (error) {
  console.warn('Some file upload dependencies not available, using fallbacks');
  // Provide fallbacks
  uuidv4 = () => `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Ensure upload directories exist
const UPLOAD_DIR = 'uploads';
const IMAGES_DIR = path.join(UPLOAD_DIR, 'images');
const DOCUMENTS_DIR = path.join(UPLOAD_DIR, 'documents');
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, 'thumbnails');
const COMPRESSED_DIR = path.join(UPLOAD_DIR, 'compressed');

async function ensureDirectories() {
  const dirs = [UPLOAD_DIR, IMAGES_DIR, DOCUMENTS_DIR, THUMBNAILS_DIR, COMPRESSED_DIR];
  
  for (const dir of dirs) {
    if (!existsSync(dir)) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// Initialize directories
ensureDirectories();

// Multer configuration
const storage = multer ? multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const uploadPath = isImage ? IMAGES_DIR : DOCUMENTS_DIR;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
}) : null;

// File filter
const fileFilter = multer ? (req: any, file: Express.Multer.File, cb: any) => {
  // Define allowed file types
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocumentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const isAllowed = allowedImageTypes.includes(file.mimetype) || 
                   allowedDocumentTypes.includes(file.mimetype);

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
} : null;

// Create multer instance
export const upload = multer ? multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files at once
  }
}) : null;

export interface ProcessedFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  category: string;
  compressedPath?: string;
  thumbnailPath?: string;
  url: string;
  thumbnailUrl?: string;
  compressedUrl?: string;
}

export class FileUploadService {
  
  async processUploadedFile(
    file: Express.Multer.File,
    userId: string,
    category: 'document' | 'image' | 'exam_result' | 'profile_picture' | 'other' = 'other'
  ): Promise<ProcessedFile> {
    
    const isImage = file.mimetype.startsWith('image/');
    let compressedPath: string | undefined;
    let thumbnailPath: string | undefined;

    // Process images
    if (isImage && sharp) {
      const compressedName = `compressed_${file.filename}`;
      const thumbnailName = `thumb_${file.filename}`;

      compressedPath = path.join(COMPRESSED_DIR, compressedName);
      thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailName);

      try {
        // Create compressed version (max 1920x1920, 80% quality)
        await sharp(file.path)
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80 })
          .toFile(compressedPath);

        // Create thumbnail (300x300)
        await sharp(file.path)
          .resize(300, 300, {
            fit: 'cover'
          })
          .jpeg({ quality: 70 })
          .toFile(thumbnailPath);

      } catch (error) {
        console.error('Error processing image:', error);
        // If image processing fails, continue without compressed versions
        compressedPath = undefined;
        thumbnailPath = undefined;
      }
    }

    // Save to database
    const fileRecord = database.createFileUpload({
      user_id: userId,
      original_name: file.originalname,
      file_name: file.filename,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
      category,
      compressed_path: compressedPath,
      thumbnail_path: thumbnailPath
    });

    const processedFile: ProcessedFile = {
      id: fileRecord.id,
      originalName: file.originalname,
      fileName: file.filename,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      category,
      compressedPath,
      thumbnailPath,
      url: `/api/files/${fileRecord.id}`,
      thumbnailUrl: thumbnailPath ? `/api/files/${fileRecord.id}/thumbnail` : undefined,
      compressedUrl: compressedPath ? `/api/files/${fileRecord.id}/compressed` : undefined
    };

    return processedFile;
  }

  async getFile(fileId: string): Promise<{ filePath: string; mimeType: string; originalName: string } | null> {
    const fileRecord = database.getFileUpload(fileId);
    if (!fileRecord) {
      return null;
    }

    return {
      filePath: fileRecord.file_path,
      mimeType: fileRecord.mime_type,
      originalName: fileRecord.original_name
    };
  }

  async getCompressedFile(fileId: string): Promise<{ filePath: string; mimeType: string; originalName: string } | null> {
    const fileRecord = database.getFileUpload(fileId);
    if (!fileRecord || !fileRecord.compressed_path) {
      return null;
    }

    return {
      filePath: fileRecord.compressed_path,
      mimeType: fileRecord.mime_type,
      originalName: fileRecord.original_name
    };
  }

  async getThumbnail(fileId: string): Promise<{ filePath: string; mimeType: string } | null> {
    const fileRecord = database.getFileUpload(fileId);
    if (!fileRecord || !fileRecord.thumbnail_path) {
      return null;
    }

    return {
      filePath: fileRecord.thumbnail_path,
      mimeType: 'image/jpeg' // Thumbnails are always JPEG
    };
  }

  async getUserFiles(userId: string, category?: string): Promise<ProcessedFile[]> {
    const files = database.getUserFiles(userId, category);
    
    return files.map(file => ({
      id: file.id,
      originalName: file.original_name,
      fileName: file.file_name,
      filePath: file.file_path,
      fileSize: file.file_size,
      mimeType: file.mime_type,
      category: file.category,
      compressedPath: file.compressed_path,
      thumbnailPath: file.thumbnail_path,
      url: `/api/files/${file.id}`,
      thumbnailUrl: file.thumbnail_path ? `/api/files/${file.id}/thumbnail` : undefined,
      compressedUrl: file.compressed_path ? `/api/files/${file.id}/compressed` : undefined
    }));
  }

  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    const fileRecord = database.getFileUpload(fileId);
    if (!fileRecord || fileRecord.user_id !== userId) {
      return false;
    }

    try {
      // Delete physical files
      await this.deletePhysicalFile(fileRecord.file_path);
      
      if (fileRecord.compressed_path) {
        await this.deletePhysicalFile(fileRecord.compressed_path);
      }
      
      if (fileRecord.thumbnail_path) {
        await this.deletePhysicalFile(fileRecord.thumbnail_path);
      }

      // Delete from database
      // Note: You'd need to add a delete method to the database class
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  private async deletePhysicalFile(filePath: string): Promise<void> {
    try {
      if (existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error('Error deleting physical file:', error);
    }
  }

  async getStorageStats(userId?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    byCategory: Record<string, { count: number; size: number }>;
  }> {
    // This would require additional database queries
    // For now, return mock data
    return {
      totalFiles: 0,
      totalSize: 0,
      byCategory: {}
    };
  }
}

export const fileUploadService = new FileUploadService();

// Helper function to validate image dimensions
export async function validateImageDimensions(
  filePath: string,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): Promise<boolean> {
  if (!sharp) return true; // Skip validation if sharp not available

  try {
    const metadata = await sharp(filePath).metadata();
    return (metadata.width || 0) <= maxWidth && (metadata.height || 0) <= maxHeight;
  } catch (error) {
    return false;
  }
}

// Helper function to get image metadata
export async function getImageMetadata(filePath: string): Promise<{
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}> {
  if (!sharp) return {}; // Skip if sharp not available

  try {
    const metadata = await sharp(filePath).metadata();
    const stats = await fs.stat(filePath);

    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: stats.size
    };
  } catch (error) {
    return {};
  }
}
