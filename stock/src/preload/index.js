const { contextBridge, ipcRenderer } = require('electron')
const fetch = require('electron-fetch').default

// Exponer funciones en el contexto de la ventana del renderer
contextBridge.exposeInMainWorld('api', {
  fetch: async (url, options) => {
    const response = await fetch(url, options)
    return response.json()
  },
  ipcRenderer: {
    send: (channel, data) => {
      // Los canales permitidos deben ser explícitamente listados
      const validChannels = ['check-token']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    on: (channel, func) => {
      const validChannels = ['token-status']
      if (validChannels.includes(channel)) {
        // Remueve cualquier listener previamente registrado
        ipcRenderer.removeAllListeners(channel)
        // Registra el nuevo listener
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args))
      }
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
})
