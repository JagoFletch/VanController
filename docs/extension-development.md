# VanController Extension Development Guide

This guide explains how to create custom extensions for VanController. Extensions allow you to add new functionality to the VanController system without modifying the core application.

## Extension Structure

Each extension should be in its own directory with the following structure:

my-extension/
├── index.js        # Main extension entry point (required)
├── components/     # React components (optional)
├── utils/          # Utility functions (optional)
├── assets/         # Images, icons, etc. (optional)
└── README.md       # Documentation (optional but recommended)

## Creating an Extension

### Step 1: Create the Extension Directory

Create a new directory for your extension:

```bash
mkdir -p my-extension
Step 2: Create the Extension Entry Point
Create an index.js file in your extension directory:
import React from 'react';

// This is your main extension component
const MyExtension = () => {
  return (
    <div>
      <h2>My Extension</h2>
      <p>This is a custom extension for VanController.</p>
      
      {/* Add your extension UI elements here */}
    </div>
  );
};

// Export the extension properties
module.exports = {
  name: 'My Extension',           // Display name of your extension
  description: 'Description of what your extension does',
  component: MyExtension,         // The React component to render
  version: '1.0.0',               // Version string
  author: 'Your Name'             // Author name
};
Step 3: Testing Your Extension
During development, you can test your extension by placing it in the src/extensions directory of the VanController project.
Step 4: Packaging Your Extension
To distribute your extension, simply zip the entire extension directory. Users can install your extension through the VanController settings panel.
Extension API
React Props
Your extension component will not receive any props by default. If your extension needs to interact with the system, you can use the provided APIs.
System APIs
VanController provides APIs for extensions to interact with the system:
Hardware Communication
To interact with hardware (GPIO, I2C, etc.), you can use the Node.js modules provided by Electron:const { remote } = window.require('electron');
const fs = remote.require('fs');
const { exec } = remote.require('child_process');

// Example: Read CPU temperature
const readCpuTemp = () => {
  return new Promise((resolve, reject) => {
    exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      const temp = parseInt(stdout) / 1000;
      resolve(temp);
    });
  });
};
Persistent Storage
For saving extension settings or data:
const { remote } = window.require('electron');
const path = remote.require('path');
const fs = remote.require('fs');
const app = remote.app;

// Example: Save extension settings
const saveSettings = (settings) => {
  const dataDir = path.join(app.getPath('userData'), 'extensions', 'my-extension');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filePath = path.join(dataDir, 'settings.json');
  fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
};

// Example: Load extension settings
const loadSettings = () => {
  const filePath = path.join(app.getPath('userData'), 'extensions', 'my-extension', 'settings.json');
  
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  
  return {}; // Default empty settings
};
User Interface Guidelines
To maintain a consistent user experience, please follow these guidelines:

Use the built-in styles: Utilize the VanController's color scheme and styling.
Support touch interfaces: Make interactive elements at least 44×44 pixels in size.
Responsive design: Your extension should adapt to different screen sizes.
Dark theme: Design your extension with a dark theme that matches the VanController UI.
Error handling: Handle errors gracefully and provide user feedback.

Example Extensions
Check out the following extensions for reference:

Temperature Monitor
Battery Monitor
Lighting Control
System Info

These examples demonstrate best practices for extension development.
Submitting Extensions
To share your extension with the VanController community, you can:

Host it on your own GitHub repository
Submit a pull request to the VanController extensions repository

Make sure to include a detailed README.md file explaining what your extension does and how to use it.
## Improving the Main Entry Point

Let's enhance the main.js file to handle hardware access for extensions:

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { initialize, enable } = require('@electron/remote/main');
const fs = require('fs');
const { exec } = require('child_process');

// Import managers
const extensionManager = require('./core/extensionManager');
const setupManager = require('./core/setupManager');
const logger = require('./core/utils/logger');

// Initialize @electron/remote
initialize();

let mainWindow;

function createWindow() {
  logger.info('Creating main window');
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 480, // Common resolution for Raspberry Pi touch screens
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    fullscreen: !isDev, // Fullscreen in production (Kiosk mode)
    autoHideMenuBar: !isDev, // Hide menu bar in production
    backgroundColor: '#121212', // Dark background color to match the UI
    show: false // Don't show until ready
  });

  enable(mainWindow.webContents);

  // Load the index.html
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open the DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  // Handle the window being minimized (important for kiosk applications)
  mainWindow.on('minimize', (event) => {
    if (!isDev) {
      event.preventDefault();
      mainWindow.restore();
    }
  });
  
  logger.info('Main window created');
}

// Check if another instance is already running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logger.info('Another instance is already running, quitting...');
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus the main window if a second instance tries to launch
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create window when Electron is ready
  app.whenReady().then(() => {
    createWindow();
    
    // Set up IPC handlers
    setupIpcHandlers();
  });
}

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    logger.info('All windows closed, quitting application');
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Set up IPC handlers for communication with the renderer process
function setupIpcHandlers() {
  // Extension management
  ipcMain.handle('get-extensions', () => {
    return extensionManager.getExtensions();
  });
  
  ipcMain.handle('install-extension', (event, sourcePath) => {
    return extensionManager.installExtension(sourcePath);
  });
  
  ipcMain.handle('uninstall-extension', (event, extensionName) => {
    return extensionManager.uninstallExtension(extensionName);
  });
  
  // Setup management
  ipcMain.handle('get-setup-questions', () => {
    return setupManager.getSetupQuestions();
  });
  
  ipcMain.handle('save-user-config', (event, config) => {
    return setupManager.saveUserConfig(config);
  });
  
  ipcMain.handle('get-user-config', () => {
    return setupManager.getUserConfig();
  });
  
  ipcMain.handle('is-setup-completed', () => {
    return setupManager.isSetupCompleted();
  });
  
  ipcMain.handle('reset-setup', () => {
    return setupManager.resetSetup();
  });
  
  // System information
  ipcMain.handle('get-system-info', async () => {
    // This should only work on Linux (Raspberry Pi)
    if (process.platform !== 'linux') {
      return {
        cpuTemp: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        totalMemory: 0,
        uptime: 0,
        diskUsage: 0,
        totalDisk: 0
      };
    }
    
    try {
      // Get CPU temperature
      const cpuTemp = await new Promise((resolve, reject) => {
        exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const temp = parseInt(stdout) / 1000;
          resolve(temp);
        });
      });
      
      // Get CPU usage
      const cpuUsage = await new Promise((resolve, reject) => {
        exec("top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\\([0-9.]*\\)%* id.*/\\1/' | awk '{print 100 - $1}'", (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(parseFloat(stdout));
        });
      });
      
      // Get memory info
      const memInfo = await new Promise((resolve, reject) => {
        exec("free -m | grep Mem", (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const parts = stdout.split(/\s+/);
          resolve({
            total: parseInt(parts[1]),
            used: parseInt(parts[2])
          });
        });
      });
      
      // Get uptime
      const uptime = await new Promise((resolve, reject) => {
        exec("cat /proc/uptime", (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const uptimeSeconds = parseFloat(stdout.split(' ')[0]);
          resolve(uptimeSeconds / 3600); // Convert to hours
        });
      });
      
      // Get disk usage
      const diskUsage = await new Promise((resolve, reject) => {
        exec("df -h / | tail -1", (error, stdout) => {
          if (error) {
            reject(error);
            return;
          }
          const parts = stdout.split(/\s+/);
          resolve({
            total: parseFloat(parts[1].replace('G', '')),
            used: parseFloat(parts[2].replace('G', ''))
          });
        });
      });
      
      return {
        cpuTemp,
        cpuUsage,
        memoryUsage: memInfo.used,
        totalMemory: memInfo.total,
        uptime,
        diskUsage: diskUsage.used,
        totalDisk: diskUsage.total
      };
    } catch (error) {
      logger.error(`Error getting system info: ${error}`);
      return {
        cpuTemp: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        totalMemory: 0,
        uptime: 0,
        diskUsage: 0,
        totalDisk: 0
      };
    }
  });
  
  // GPIO handling (for Raspberry Pi hardware access)
  ipcMain.handle('gpio-access', async (event, { pin, mode, value }) => {
    // This should only work on Linux (Raspberry Pi)
    if (process.platform !== 'linux') {
      return { success: false, error: 'GPIO access only available on Raspberry Pi' };
    }
    
    try {
      // Example using command line for GPIO access
      // In a production app, you would use a proper GPIO library
      if (mode === 'read') {
        const result = await new Promise((resolve, reject) => {
          exec(`gpio -g read ${pin}`, (error, stdout) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(parseInt(stdout.trim()));
          });
        });
        return { success: true, value: result };
      } else if (mode === 'write') {
        await new Promise((resolve, reject) => {
          exec(`gpio -g mode ${pin} out && gpio -g write ${pin} ${value}`, (error) => {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
        return { success: true };
      }
      
      return { success: false, error: 'Invalid GPIO mode' };
    } catch (error) {
      logger.error(`Error accessing GPIO: ${error}`);
      return { success: false, error: error.message };
    }
  });
  
  logger.info('IPC handlers set up');
}