const electron = require('electron');
const path = require('path');
const url = require('url');

const zelda = require('./zelda');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let mainContent;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 360, height: 600 });

  // and load the index.html of the app.
  const guiURL =
    process.env.NODE_ENV === 'development'
      ? url.format({
        hostname: '127.0.0.1',
        port: 8989,
        protocol: 'http'
      })
      : url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      });

  mainWindow.loadURL(guiURL);

  mainContent = mainWindow.webContents;

  // Open the DevTools.
  process.env.NODE_ENV === 'development' && mainContent.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('before-quit', function () {
  zelda.dev({
    type: 'stop'
  }, mainContent);
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('init-zelda', function (e, arg) {
  zelda.init(arg, mainContent);
});

ipcMain.on('init-zatlas', function (e, arg) {
  zelda.link(arg, mainContent);
});

ipcMain.on('generate-file', function (e, arg) {
  zelda.generate(arg, mainContent);
});

ipcMain.on('run-npm', function (e, arg) {
  zelda.npm(arg, mainContent);
});

ipcMain.on('run-dev', function (e, arg) {
  zelda.dev(arg, mainContent);
});
