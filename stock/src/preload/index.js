const { contextBridge, ipcRenderer } = require('electron');
// Importar la función fetch desde electron-fetch si la necesitas
const fetch = require('electron-fetch').default;

// Exponer funciones en el contexto de la ventana del renderer
contextBridge.exposeInMainWorld('api', {
  fetch: async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error in fetch:', error);
      throw error; // Rethrow error so it can be handled in the renderer
    }
  },
  ipcRenderer: {
    send: (channel, data) => {
      // Los canales permitidos deben ser explícitamente listados
      const validChannels = ['check-token'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.warn(`Attempted to send to invalid channel: ${channel}`);
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
        console.warn(`Attempted to listen to invalid channel: ${channel}`);
      }
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  }
});
