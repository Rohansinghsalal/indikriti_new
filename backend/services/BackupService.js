/**
 * Backup Service
 * Handles database backups and restoration
 */
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const execPromise = promisify(exec);
const { Sequelize } = require('sequelize');
const db = require('../models').sequelize;
const logger = require('../utils/logger');
const appConfig = require('../config/app');

class BackupService {
  constructor() {
    this.backupDir = path.join(__dirname, '../storage/backups');
    this.dbConfig = db.config;
    
    // Ensure backup directory exists
    this._ensureBackupDirExists();
  }

  /**
   * Ensure backup directory exists
   * @private
   */
  async _ensureBackupDirExists() {
    try {
      await fs.access(this.backupDir);
    } catch (err) {
      await fs.mkdir(this.backupDir, { recursive: true });
      logger.info(`Created backup directory: ${this.backupDir}`);
    }
  }

  /**
   * Generate backup filename
   * @param {string} prefix - Optional prefix
   * @returns {string} - Filename
   * @private
   */
  _generateBackupFilename(prefix = 'backup') {
    const timestamp = new Date().toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .slice(0, -5);
    
    return `${prefix}_${timestamp}.sql`;
  }

  /**
   * Create database backup
   * @param {object} options - Backup options
   * @returns {Promise<object>} - Backup info
   */
  async createBackup(options = {}) {
    try {
      const { prefix, tables = [] } = options;
      
      const filename = this._generateBackupFilename(prefix);
      const filePath = path.join(this.backupDir, filename);
      
      // Get DB connection info
      const { host, port, username, password, database } = this.dbConfig;
      
      // Build mysqldump command
      let cmd = `mysqldump -h ${host} -P ${port} -u ${username}`;
      
      if (password) {
        cmd += ` -p${password}`;
      }
      
      // Add specific tables if requested
      if (tables.length > 0) {
        cmd += ` ${database} ${tables.join(' ')}`;
      } else {
        cmd += ` ${database}`;
      }
      
      // Add output redirection
      cmd += ` > ${filePath}`;

      // Execute backup command
      await execPromise(cmd);
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      logger.info(`Database backup created: ${filename} (${stats.size} bytes)`);
      
      return {
        success: true,
        filename,
        path: filePath,
        size: stats.size,
        timestamp: new Date(),
        tables: tables.length > 0 ? tables : 'all'
      };
    } catch (error) {
      logger.error('Error creating database backup:', error);
      throw new Error(`Failed to create database backup: ${error.message}`);
    }
  }

  /**
   * Restore database from backup
   * @param {string} filename - Backup filename
   * @returns {Promise<object>} - Restore info
   */
  async restoreBackup(filename) {
    try {
      const filePath = path.join(this.backupDir, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Get DB connection info
      const { host, port, username, password, database } = this.dbConfig;
      
      // Build mysql restore command
      let cmd = `mysql -h ${host} -P ${port} -u ${username}`;
      
      if (password) {
        cmd += ` -p${password}`;
      }
      
      cmd += ` ${database} < ${filePath}`;
      
      // Execute restore command
      await execPromise(cmd);
      
      logger.info(`Database restored from backup: ${filename}`);
      
      return {
        success: true,
        filename,
        timestamp: new Date()
      };
    } catch (error) {
      logger.error(`Error restoring database from backup ${filename}:`, error);
      throw new Error(`Failed to restore database: ${error.message}`);
    }
  }

  /**
   * List available backups
   * @returns {Promise<Array>} - List of backups
   */
  async listBackups() {
    try {
      // Get all files in backup directory
      const files = await fs.readdir(this.backupDir);
      
      // Filter SQL files and get details
      const backups = await Promise.all(
        files
          .filter(file => file.endsWith('.sql'))
          .sort((a, b) => b.localeCompare(a)) // Sort newest first
          .map(async (file) => {
            try {
              const filePath = path.join(this.backupDir, file);
              const stats = await fs.stat(filePath);
              
              // Extract timestamp from filename
              const timestampMatch = file.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})/);
              const timestamp = timestampMatch 
                ? timestampMatch[1].replace('_', 'T').replace(/-/g, (m, i) => i > 9 ? ':' : '-')
                : null;
              
              return {
                filename: file,
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                timestamp: timestamp ? new Date(timestamp) : stats.birthtime
              };
            } catch (err) {
              logger.error(`Error getting details for backup ${file}:`, err);
              return null;
            }
          })
      );
      
      // Remove any nulls from failed stats
      return backups.filter(backup => backup !== null);
    } catch (error) {
      logger.error('Error listing backups:', error);
      throw new Error(`Failed to list backups: ${error.message}`);
    }
  }

  /**
   * Delete a backup
   * @param {string} filename - Backup filename
   * @returns {Promise<boolean>} - Success status
   */
  async deleteBackup(filename) {
    try {
      const filePath = path.join(this.backupDir, filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Delete file
      await fs.unlink(filePath);
      
      logger.info(`Backup deleted: ${filename}`);
      
      return true;
    } catch (error) {
      logger.error(`Error deleting backup ${filename}:`, error);
      throw new Error(`Failed to delete backup: ${error.message}`);
    }
  }

  /**
   * Create scheduled backup
   * @returns {Promise<object>} - Backup info
   */
  async createScheduledBackup() {
    try {
      // Get current date for prefix
      const today = new Date().toISOString().slice(0, 10);
      
      return this.createBackup({
        prefix: `scheduled_${today}`
      });
    } catch (error) {
      logger.error('Error creating scheduled backup:', error);
      throw new Error(`Failed to create scheduled backup: ${error.message}`);
    }
  }

  /**
   * Clean up old backups
   * @param {number} daysToKeep - Number of days to keep backups for
   * @returns {Promise<object>} - Cleanup result
   */
  async cleanupOldBackups(daysToKeep = 30) {
    try {
      const backups = await this.listBackups();
      const now = new Date();
      const cutoffDate = new Date(now.setDate(now.getDate() - daysToKeep));
      
      const oldBackups = backups.filter(backup => backup.created < cutoffDate);
      
      // Delete old backups
      const deletedBackups = [];
      for (const backup of oldBackups) {
        await this.deleteBackup(backup.filename);
        deletedBackups.push(backup.filename);
      }
      
      logger.info(`Cleaned up ${deletedBackups.length} old backups`);
      
      return {
        success: true,
        deletedCount: deletedBackups.length,
        deletedBackups
      };
    } catch (error) {
      logger.error('Error cleaning up old backups:', error);
      throw new Error(`Failed to clean up old backups: ${error.message}`);
    }
  }

  /**
   * Export database tables to JSON
   * @param {Array} tables - Tables to export
   * @returns {Promise<object>} - Export info
   */
  async exportToJSON(tables = []) {
    try {
      const result = {};
      
      // If no tables specified, use all models
      const modelsToExport = tables.length > 0 
        ? tables 
        : Object.keys(db.models);
      
      // Export each table
      for (const modelName of modelsToExport) {
        if (db.models[modelName]) {
          const records = await db.models[modelName].findAll();
          result[modelName] = records.map(record => record.toJSON());
        }
      }
      
      // Write to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `export_${timestamp}.json`;
      const filePath = path.join(this.backupDir, filename);
      
      await fs.writeFile(filePath, JSON.stringify(result, null, 2));
      
      // Get file stats
      const stats = await fs.stat(filePath);
      
      logger.info(`Database exported to JSON: ${filename} (${stats.size} bytes)`);
      
      return {
        success: true,
        filename,
        path: filePath,
        size: stats.size,
        tables: modelsToExport,
        recordCount: Object.values(result).reduce((sum, records) => sum + records.length, 0)
      };
    } catch (error) {
      logger.error('Error exporting to JSON:', error);
      throw new Error(`Failed to export to JSON: ${error.message}`);
    }
  }

  /**
   * Import data from JSON
   * @param {string} filename - JSON filename
   * @param {boolean} clearExisting - Whether to clear existing data
   * @returns {Promise<object>} - Import info
   */
  async importFromJSON(filename, clearExisting = false) {
    try {
      const filePath = path.join(this.backupDir, filename);
      
      // Read JSON file
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const importedTables = [];
      const recordCounts = {};
      let totalRecords = 0;
      
      // Start transaction
      const transaction = await db.transaction();
      
      try {
        // Import each table
        for (const [tableName, records] of Object.entries(data)) {
          if (db.models[tableName] && Array.isArray(records)) {
            // Clear existing data if requested
            if (clearExisting) {
              await db.models[tableName].destroy({ 
                where: {}, 
                truncate: true, 
                cascade: true,
                transaction 
              });
            }
            
            // Insert records
            if (records.length > 0) {
              await db.models[tableName].bulkCreate(records, { 
                transaction,
                updateOnDuplicate: clearExisting ? undefined : Object.keys(records[0])
              });
            }
            
            importedTables.push(tableName);
            recordCounts[tableName] = records.length;
            totalRecords += records.length;
          }
        }
        
        // Commit transaction
        await transaction.commit();
        
        logger.info(`Data imported from JSON: ${filename} (${totalRecords} records)`);
        
        return {
          success: true,
          filename,
          tables: importedTables,
          recordCounts,
          totalRecords
        };
      } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      logger.error(`Error importing from JSON ${filename}:`, error);
      throw new Error(`Failed to import from JSON: ${error.message}`);
    }
  }
}

module.exports = new BackupService(); 