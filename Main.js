const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow () {
  
    const win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
                    preload: path.join(__dirname, 'preload.js'), } });

    win.loadFile('index.html');

}

app.whenReady().then(() => {
                              
  // Start Python backend
                                
  const py = spawn('python', ['python/First_Page.py']);

  py.stdout.on('data', (data) => {
                                      
    console.log(`Python says: ${data}`);
                                      
  });

  createWindow();
                                          
});