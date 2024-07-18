import { contextBridge } from 'electron';
import fetch from 'electron-fetch';

// Exponer la función fetch en el contexto de la ventana del renderer
contextBridge.exposeInMainWorld('api', {
  fetch: async (url, options) => {
    const response = await fetch(url, options);
    return response.json();
  }
});


