const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const logger = require('./utils/logger');

class SetupManager {
  constructor() {
    this.configDir = path.join(app.getPath('userData'), 'config');
    this.questionsPath = path.join(__dirname, '../../config/setup-questions.json');
    this.userConfigPath = path.join(this.configDir, 'user-config.json');
    
    // Create config directory if it doesn't exist
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  // Get setup questions
  getSetupQuestions() {
    try {
      if (!fs.existsSync(this.questionsPath)) {
        logger.error(`Setup questions file not found at ${this.questionsPath}`);
        return [];
      }
      
      const questionsData = fs.readFileSync(this.questionsPath, 'utf8');
      return JSON.parse(questionsData).questions;
    } catch (error) {
      logger.error(`Error reading setup questions: ${error}`);
      return [];
    }
  }

  // Save user configuration
  saveUserConfig(config) {
    try {
      fs.writeFileSync(this.userConfigPath, JSON.stringify(config, null, 2));
      logger.info('User configuration saved successfully');
      return true;
    } catch (error) {
      logger.error(`Error saving user config: ${error}`);
      return false;
    }
  }

  // Get user configuration
  getUserConfig() {
    try {
      if (fs.existsSync(this.userConfigPath)) {
        const configData = fs.readFileSync(this.userConfigPath, 'utf8');
        return JSON.parse(configData);
      }
      logger.warn('User configuration file not found');
      return null;
    } catch (error) {
      logger.error(`Error reading user config: ${error}`);
      return null;
    }
  }

  // Check if setup has been completed
  isSetupCompleted() {
    return fs.existsSync(this.userConfigPath);
  }
  
  // Reset the setup (for debugging purposes)
  resetSetup() {
    try {
      if (fs.existsSync(this.userConfigPath)) {
        fs.unlinkSync(this.userConfigPath);
        logger.info('Setup reset successfully');
        return true;
      }
      return false;
    } catch (error) {
      logger.error(`Error resetting setup: ${error}`);
      return false;
    }
  }
}

module.exports = new SetupManager();