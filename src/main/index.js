import { app, shell, BrowserWindow, ipcMain, screen, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    width,
    height,
    show: true,
    fullscreen: false,
    fullscreenable: true,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setMinimumSize(width, height)

  // Plantilla del menú
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Minimizar',
          role: 'minimize'
        },
        {
          label: 'Recargar',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload()
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          click: () => {
            app.quit()
          }
        }
      ]
    },

    {
      label: 'Ver',
      submenu: [
        {
          label: 'Alternar Herramientas de Desarrollo',
          click: () => {
            mainWindow.webContents.toggleDevTools()
          }
        },
        { type: 'separator' },
        {
          label: 'Pantalla completa',
          type: 'checkbox',
          click: () => {
            const isFullScreen = mainWindow.isFullScreen()
            mainWindow.setFullScreen(!isFullScreen)
          }
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Bienvenidos',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
            alert("Bienvenidos a Stock, esta app fue hecha por Francisco Costanzo");
          `)
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  app.applicationIcon = icon
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
