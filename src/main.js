const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { initialize, enable } = require('@electron/remote/main');

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
    autoHideMenuBar: !isDev // Hide menu bar in production
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
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  
  logger.info('Main window created');
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();
  
  // Set up IPC handlers
  setupIpcHandlers();
});

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
  
  logger.info('IPC handlers set up');
}