const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mongoProcess = null;
let backendProcess = null;
let mainWindow = null;

function getResourcePath(relativePath) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, relativePath);
  }
  return path.join(__dirname, relativePath);
}

function ensureLogDir() {
  const logDir = path.join(app.getPath('userData'), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  return path.join(logDir, 'app.log');
}

function writeLog(msg) {
  try {
    const logFile = ensureLogDir();
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (e) {}
}

function startMongoDB() {
  return new Promise((resolve, reject) => {
    const mongodPath = getResourcePath('bin/mongod.exe');
    const dbPath = path.join(app.getPath('userData'), 'db');

    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

    writeLog('Starting MongoDB from: ' + mongodPath);

    mongoProcess = spawn(mongodPath, [
      '--dbpath', dbPath,
      '--port', '27017',
      '--bind_ip', '127.0.0.1'
    ]);

    mongoProcess.stdout.on('data', (data) => writeLog('MongoDB: ' + data));
    mongoProcess.stderr.on('data', (data) => writeLog('MongoDB ERR: ' + data));

    mongoProcess.on('error', (err) => {
      writeLog('MongoDB failed: ' + err.message);
      reject(err);
    });

    setTimeout(() => resolve(), 2000);
  });
}

function startBackend() {
  return new Promise((resolve, reject) => {
    const serverPath = app.isPackaged
      ? path.join(process.resourcesPath, 'backend', 'server.js')
      : path.join(__dirname, '../backend', 'server.js');

    writeLog('Starting backend from: ' + serverPath);

    backendProcess = spawn(process.execPath, [serverPath], {
      env: {
        ...process.env,
        MONGODB_URI: 'mongodb://127.0.0.1:27017/plant2tree_clinic',
        PORT: '5000'
      }
    });

    backendProcess.stdout.on('data', (data) => writeLog('Backend: ' + data));
    backendProcess.stderr.on('data', (data) => writeLog('Backend ERR: ' + data));

    backendProcess.on('error', (err) => {
      writeLog('Backend failed: ' + err.message);
      reject(err);
    });

    setTimeout(() => resolve(), 3000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: 'Plant2Tree Doctor Software',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = !app.isPackaged;
  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

  mainWindow.loadURL(url).catch((err) => {
    writeLog('Window load error: ' + err.message);
    dialog.showErrorBox('Load Error', 
      'Failed to load the application. Please restart.');
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
}

function killProcesses() {
  if (backendProcess) { backendProcess.kill(); backendProcess = null; }
  if (mongoProcess) { mongoProcess.kill(); mongoProcess = null; }
}

app.whenReady().then(async () => {
  try {
    await startMongoDB();
    writeLog('MongoDB started successfully');
  } catch (err) {
    dialog.showErrorBox('Database Error', 
      'Database failed to start. Please restart the application.');
    app.quit();
    return;
  }

  try {
    await startBackend();
    writeLog('Backend started successfully');
  } catch (err) {
    dialog.showErrorBox('Server Error', 
      'Server failed to start. Please restart the application.');
    killProcesses();
    app.quit();
    return;
  }

  createWindow();
});

app.on('window-all-closed', () => {
  killProcesses();
  app.quit();
});

app.on('before-quit', () => killProcesses());
