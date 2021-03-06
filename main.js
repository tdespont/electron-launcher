// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const { ipcMain } = require('electron')
const { exec } = require("child_process");
const fs = require('fs')

const getWorkingDir = () => {
  if (process.env.PORTABLE_EXECUTABLE_DIR) return process.env.PORTABLE_EXECUTABLE_DIR
  return __dirname
}

const executeCommand = (command, event) => {
  exec(command, (error, stout, sterr) => {
    event.reply('command-reply', stout)
  })
}

ipcMain.on('command-execute', (event, arg) => {
  console.log('main go ' + arg)
  executeCommand('ping ' + arg, event)
})

ipcMain.on('config-load', (event, _) => {
  process.getAppPath
  console.log('start read config')
  fs.readFile(getWorkingDir() + '/config.json', (err, data) => {
    if (err) console.log('error: ' + err)
    const config = JSON.parse(data)
    event.reply('config-value', config)
  })
})

