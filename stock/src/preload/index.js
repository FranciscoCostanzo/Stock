const { contextBridge, ipcRenderer } = require('electron');

// Exponer funciones seguras en el contexto de la ventana del renderer
contextBridge.exposeInMainWorld('api', {
  ipcRenderer: {
    send: (channel, data) => {
      // Los canales permitidos deben ser explícitamente listados
      const validChannels = ['check-token'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.warn(`Intento de enviar a un canal inválido: ${channel}`);
      }
    },
    on: (channel, func) => {
      const validChannels = ['token-status'];
      if (validChannels.includes(channel)) {
        // Remueve cualquier listener previamente registrado
        ipcRenderer.removeAllListeners(channel);
        // Registra el nuevo listener
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      } else {
        console.warn(`Intento de escuchar un canal inválido: ${channel}`);
      }
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  }
});
