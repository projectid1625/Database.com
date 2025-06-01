const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  sendToPython: (msg) => ipcRenderer.send('to-python', msg),

    onPythonResponse: (callback) => ipcRenderer.on(

        'from-python', (event, data) => callback(data)

    )

});