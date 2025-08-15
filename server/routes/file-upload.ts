import { RequestHandler } from 'express';
import { fileUploadService, upload } from '../file-upload';
import path from 'path';
import fs from 'fs';

// Upload files
export const uploadFiles: RequestHandler = async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { userId, category = 'other' } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const processedFiles = [];

    for (const file of files) {
      try {
        const processedFile = await fileUploadService.processUploadedFile(
          file,
          userId,
          category as any
        );
        processedFiles.push(processedFile);
      } catch (error) {
        console.error('Error processing file:', error);
        // Continue with other files if one fails
      }
    }

    res.json({
      success: true,
      data: processedFiles,
      message: `${processedFiles.length} file(s) uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload files'
    });
  }
};

// Get file by ID
export const getFile: RequestHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileUploadService.getFile(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);

    // Stream the file
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve file'
    });
  }
};

// Get compressed version of image
export const getCompressedFile: RequestHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileUploadService.getCompressedFile(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'Compressed file not found'
      });
    }

    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Compressed file not found on disk'
      });
    }

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="compressed_${file.originalName}"`);

    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving compressed file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve compressed file'
    });
  }
};

// Get thumbnail of image
export const getThumbnail: RequestHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    const thumbnail = await fileUploadService.getThumbnail(fileId);

    if (!thumbnail) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found'
      });
    }

    if (!fs.existsSync(thumbnail.filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Thumbnail not found on disk'
      });
    }

    res.setHeader('Content-Type', thumbnail.mimeType);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day

    const fileStream = fs.createReadStream(thumbnail.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving thumbnail:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve thumbnail'
    });
  }
};

// Get user files
export const getUserFiles: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category } = req.query;

    const files = await fileUploadService.getUserFiles(
      userId,
      category as string | undefined
    );

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user files'
    });
  }
};

// Delete file
export const deleteFile: RequestHandler = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const success = await fileUploadService.deleteFile(fileId, userId);

    if (success) {
      res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'File not found or unauthorized'
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file'
    });
  }
};

// Upload profile picture
export const uploadProfilePicture: RequestHandler = async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if it's an image
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed for profile pictures'
      });
    }

    const processedFile = await fileUploadService.processUploadedFile(
      file,
      userId,
      'profile_picture'
    );

    res.json({
      success: true,
      data: processedFile,
      message: 'Profile picture uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture'
    });
  }
};

// Get storage statistics
export const getStorageStats: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await fileUploadService.getStorageStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch storage statistics'
    });
  }
};

// Middleware for handling upload errors
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files at once'
      });
    }
  }

  if (err.message && err.message.includes('not allowed')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
};
