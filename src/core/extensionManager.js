const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const logger = require('./utils/logger');

class ExtensionManager {
  constructor() {
    this.extensions = {};
    this.extensionsDir = path.join(__dirname, '../extensions');
    this.userExtensionsDir = path.join(app.getPath('userData'), 'extensions');
    
    // Create user extensions directory if it doesn't exist
    if (!fs.existsSync(this.userExtensionsDir)) {
      fs.mkdirSync(this.userExtensionsDir, { recursive: true });
    }
  }

  // Load all extensions from both the built-in and user directories
  loadAllExtensions() {
    logger.info('Loading all extensions');
    this.extensions = {};
    
    // Load built-in extensions
    this._loadExtensionsFromDirectory(this.extensionsDir);
    
    // Load user extensions
    this._loadExtensionsFromDirectory(this.userExtensionsDir);
    
    logger.info(`Loaded ${Object.keys(this.extensions).length} extensions`);
    return this.extensions;
  }
  
  // Helper method to load extensions from a directory
  _loadExtensionsFromDirectory(directory) {
    if (!fs.existsSync(directory)) {
      logger.warn(`Extensions directory does not exist: ${directory}`);
      return;
    }
    
    const extensionFolders = fs.readdirSync(directory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const folder of extensionFolders) {
      const extensionPath = path.join(directory, folder);
      this._loadExtension(folder, extensionPath);
    }
  }

  // Load a specific extension by name and path
  _loadExtension(extensionName, extensionPath) {
    const indexPath = path.join(extensionPath, 'index.js');
    
    if (!fs.existsSync(indexPath)) {
      logger.error(`Extension ${extensionName} does not have an index.js file`);
      return null;
    }

    try {
      // Clear cache to ensure we get the latest version
      delete require.cache[require.resolve(indexPath)];
      const extension = require(indexPath);
      
      if (!this._validateExtension(extension)) {
        logger.error(`Extension ${extensionName} is missing required properties`);
        return null;
      }

      this.extensions[extensionName] = {
        ...extension,
        path: extensionPath
      };
      
      logger.info(`Loaded extension: ${extension.name} (v${extension.version})`);
      return extension;
    } catch (error) {
      logger.error(`Error loading extension ${extensionName}: ${error}`);
      return null;
    }
  }
  
  // Validate that an extension has all required properties
  _validateExtension(extension) {
    return (
      extension.name && 
      extension.description && 
      extension.component && 
      extension.version && 
      extension.author
    );
  }

  // Install a new extension from a directory
  installExtension(sourcePath) {
    try {
      // Get the extension name from the directory
      const extensionName = path.basename(sourcePath);
      const targetPath = path.join(this.userExtensionsDir, extensionName);
      
      // Check if extension already exists
      if (fs.existsSync(targetPath)) {
        logger.warn(`Extension ${extensionName} already exists`);
        return false;
      }
      
      // Copy extension files
      this._copyDirectory(sourcePath, targetPath);
      
      // Load the newly installed extension
      const extension = this._loadExtension(extensionName, targetPath);
      return extension !== null;
    } catch (error) {
      logger.error(`Error installing extension: ${error}`);
      return false;
    }
  }
  
  // Helper method to copy a directory recursively
  _copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }
    
    const entries = fs.readdirSync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      
      if (entry.isDirectory()) {
        this._copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  // Uninstall an extension
  uninstallExtension(extensionName) {
    const extensionPath = path.join(this.userExtensionsDir, extensionName);
    
    if (!fs.existsSync(extensionPath)) {
      logger.warn(`Extension ${extensionName} does not exist`);
      return false;
    }
    
    try {
      // Delete the extension directory
      this._deleteDirectory(extensionPath);
      
      // Remove from loaded extensions
      delete this.extensions[extensionName];
      
      logger.info(`Uninstalled extension: ${extensionName}`);
      return true;
    } catch (error) {
      logger.error(`Error uninstalling extension ${extensionName}: ${error}`);
      return false;
    }
  }
  
  // Helper method to delete a directory recursively
  _deleteDirectory(directory) {
    if (fs.existsSync(directory)) {
      const entries = fs.readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
          this._deleteDirectory(entryPath);
        } else {
          fs.unlinkSync(entryPath);
        }
      }
      
      fs.rmdirSync(directory);
    }
  }

  // Get all loaded extensions
  getExtensions() {
    return this.extensions;
  }

  // Get a specific extension by name
  getExtension(extensionName) {
    return this.extensions[extensionName] || null;
  }
}

module.exports = new ExtensionManager();