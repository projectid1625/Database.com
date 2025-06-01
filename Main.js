const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {

  const win = new BrowserWindow({

    width: 800, height: 600,

    webPreferences: {

      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false

    }

  });

  win.loadFile('index.html');

  ipcMain.on('to-python', (event, data) => {

    const py = spawn('python', ['First_Page.py', data]);

    py.stdout.on('data', (output) => {

      event.sender.send('from-python', output.toString());

    });

  });

}

app.whenReady().then(createWindow);