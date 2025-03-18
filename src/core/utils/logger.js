const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class Logger {
  constructor() {
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}\n`;
  }

  _write(level, message) {
    const formattedMessage = this._formatMessage(level, message);
    
    // Log to console
    console.log(formattedMessage);
    
    // Log to file
    fs.appendFileSync(this.logFile, formattedMessage);
  }

  info(message) {
    this._write('INFO', message);
  }

  warn(message) {
    this._write('WARN', message);
  }

  error(message) {
    this._write('ERROR', message);
  }

  debug(message) {
    this._write('DEBUG', message);
  }
}

module.exports = new Logger();