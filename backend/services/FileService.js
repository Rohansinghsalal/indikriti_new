/**
 * File Service
 * Handles file uploads, retrievals, and management
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const { pipeline } = require('stream');
const pipelineAsync = promisify(pipeline);
const appConfig = require('../config/app');
const logger = require('../utils/logger');

class FileService {
  constructor() {
    this.storageConfig = appConfig.storage || {};
    this.baseUploadPath = this.storageConfig.uploadPath || path.join(__dirname, '../storage/uploads');
    
    // Initialize directories
    this._initDirectories();
  }

  /**
   * Initialize required directories
   * @private
   */
  async _initDirectories() {
    try {
      await this._ensureDirectoryExists(this.baseUploadPath);
      
      // Create subdirectories for different file types
      const subdirs = ['images', 'documents', 'products', 'avatars', 'exports', 'temp'];
      
      for (const dir of subdirs) {
        await this._ensureDirectoryExists(path.join(this.baseUploadPath, dir));
      }
    } catch (error) {
      logger.error('Error initializing upload directories:', error);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   * @param {string} directory - Directory path
   * @returns {Promise<void>}
   * @private
   */
  async _ensureDirectoryExists(directory) {
    try {
      await fs.access(directory);
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(directory, { recursive: true });
      logger.info(`Created directory: ${directory}`);
    }
  }

  /**
   * Generate a unique filename
   * @param {string} originalName - Original file name
   * @returns {string} - Unique filename
   * @private
   */
  _generateUniqueFilename(originalName) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const sanitizedName = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    
    return `${sanitizedName}-${timestamp}-${randomString}${extension}`;
  }

  /**
   * Get MIME type from file extension
   * @param {string} filename - Filename with extension
   * @returns {string} - MIME type
   * @private
   */
  _getMimeType(filename) {
    const extension = path.extname(filename).toLowerCase();
    
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.csv': 'text/csv',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
      '.json': 'application/json',
      '.xml': 'application/xml'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Store a file from a form upload
   * @param {object} file - File object from multer
   * @param {string} subdir - Subdirectory within uploads folder
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Stored file info
   */
  async storeFile(file, subdir = 'temp', options = {}) {
    try {
      // Ensure the subdirectory exists
      const uploadDir = path.join(this.baseUploadPath, subdir);
      await this._ensureDirectoryExists(uploadDir);
      
      // Generate unique filename
      const uniqueFilename = options.filename || this._generateUniqueFilename(file.originalname);
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Write file to disk
      await fs.writeFile(filePath, file.buffer);
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      // Generate URL path
      const urlPath = `${this.storageConfig.urlPrefix || '/uploads'}/${subdir}/${uniqueFilename}`;
      
      // Return file info
      return {
        filename: uniqueFilename,
        originalname: file.originalname,
        mimetype: file.mimetype || this._getMimeType(file.originalname),
        size: stats.size,
        path: filePath,
        url: urlPath,
        metadata: options.metadata || {}
      };
    } catch (error) {
      logger.error('Error storing file:', error);
      throw new Error(`Failed to store file: ${error.message}`);
    }
  }

  /**
   * Store a file from a stream
   * @param {ReadableStream} stream - File stream
   * @param {string} filename - Original filename
   * @param {string} subdir - Subdirectory within uploads folder
   * @param {object} options - Additional options
   * @returns {Promise<object>} - Stored file info
   */
  async storeFileFromStream(stream, filename, subdir = 'temp', options = {}) {
    try {
      // Ensure the subdirectory exists
      const uploadDir = path.join(this.baseUploadPath, subdir);
      await this._ensureDirectoryExists(uploadDir);
      
      // Generate unique filename
      const uniqueFilename = options.filename || this._generateUniqueFilename(filename);
      const filePath = path.join(uploadDir, uniqueFilename);
      
      // Write stream to file
      const writeStream = createWriteStream(filePath);
      await pipelineAsync(stream, writeStream);
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      // Generate URL path
      const urlPath = `${this.storageConfig.urlPrefix || '/uploads'}/${subdir}/${uniqueFilename}`;
      
      // Return file info
      return {
        filename: uniqueFilename,
        originalname: filename,
        mimetype: this._getMimeType(filename),
        size: stats.size,
        path: filePath,
        url: urlPath,
        metadata: options.metadata || {}
      };
    } catch (error) {
      logger.error('Error storing file from stream:', error);
      throw new Error(`Failed to store file from stream: ${error.message}`);
    }
  }

  /**
   * Get file by filename
   * @param {string} filename - Filename to get
   * @param {string} subdir - Subdirectory within uploads folder
   * @returns {Promise<object>} - File info and content
   */
  async getFile(filename, subdir = 'temp') {
    try {
      const filePath = path.join(this.baseUploadPath, subdir, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      // Get file content
      const content = await fs.readFile(filePath);
      
      // Generate URL path
      const urlPath = `${this.storageConfig.urlPrefix || '/uploads'}/${subdir}/${filename}`;
      
      // Return file info and content
      return {
        filename,
        mimetype: this._getMimeType(filename),
        size: stats.size,
        path: filePath,
        url: urlPath,
        content
      };
    } catch (error) {
      logger.error(`Error getting file ${filename}:`, error);
      throw new Error(`Failed to get file: ${error.message}`);
    }
  }

  /**
   * Delete file by filename
   * @param {string} filename - Filename to delete
   * @param {string} subdir - Subdirectory within uploads folder
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(filename, subdir = 'temp') {
    try {
      const filePath = path.join(this.baseUploadPath, subdir, filename);
      
      // Check if file exists and delete
      await fs.unlink(filePath);
      
      logger.info(`File deleted: ${filePath}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting file ${filename}:`, error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * List files in a directory
   * @param {string} subdir - Subdirectory within uploads folder
   * @returns {Promise<Array>} - List of files
   */
  async listFiles(subdir = 'temp') {
    try {
      const dirPath = path.join(this.baseUploadPath, subdir);
      
      // Ensure directory exists
      await this._ensureDirectoryExists(dirPath);
      
      // Read directory
      const files = await fs.readdir(dirPath);
      
      // Get detailed file info
      const fileInfoPromises = files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stats = await fs.stat(filePath);
        
        return {
          filename: file,
          path: filePath,
          url: `${this.storageConfig.urlPrefix || '/uploads'}/${subdir}/${file}`,
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime
        };
      });
      
      return Promise.all(fileInfoPromises);
    } catch (error) {
      logger.error(`Error listing files in ${subdir}:`, error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Move file to another location
   * @param {string} filename - Source filename
   * @param {string} srcSubdir - Source subdirectory
   * @param {string} destSubdir - Destination subdirectory
   * @param {string} newFilename - Optional new filename
   * @returns {Promise<object>} - Moved file info
   */
  async moveFile(filename, srcSubdir, destSubdir, newFilename = null) {
    try {
      const srcPath = path.join(this.baseUploadPath, srcSubdir, filename);
      const destFilename = newFilename || filename;
      const destPath = path.join(this.baseUploadPath, destSubdir, destFilename);
      
      // Ensure destination directory exists
      await this._ensureDirectoryExists(path.join(this.baseUploadPath, destSubdir));
      
      // Move file
      await fs.rename(srcPath, destPath);
      
      // Get file stats
      const stats = await fs.stat(destPath);
      
      // Generate URL path
      const urlPath = `${this.storageConfig.urlPrefix || '/uploads'}/${destSubdir}/${destFilename}`;
      
      // Return file info
      return {
        filename: destFilename,
        originalname: filename,
        mimetype: this._getMimeType(destFilename),
        size: stats.size,
        path: destPath,
        url: urlPath
      };
    } catch (error) {
      logger.error(`Error moving file ${filename}:`, error);
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  /**
   * Generate a presigned URL for file uploads (useful for direct browser uploads)
   * @param {object} options - Options for presigned URL
   * @returns {Promise<object>} - Presigned URL info
   */
  async getPresignedUploadUrl(options = {}) {
    // In a real environment, this would integrate with S3 or other object storage
    // This is a placeholder implementation for the interface
    
    const filename = options.filename || `upload-${Date.now()}`;
    const subdir = options.subdir || 'temp';
    const expiresIn = options.expiresIn || 3600; // 1 hour
    
    // Generate upload token
    const token = crypto.randomBytes(16).toString('hex');
    
    // Return mock presigned URL info
    return {
      url: `${appConfig.app.url}/api/v1/uploads/presigned`,
      method: 'POST',
      fields: {
        key: `${subdir}/${this._generateUniqueFilename(filename)}`,
        token,
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-date': new Date().toISOString(),
        'x-amz-expires': expiresIn
      },
      expires: new Date(Date.now() + expiresIn * 1000).toISOString()
    };
  }
}

module.exports = new FileService(); 