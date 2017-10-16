const electron = require('electron');
const fs = require('fs');
const path = require('path');
const Store = require('electron-store');

const ipcRenderer = electron.ipcRenderer;
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const dialog = remote.dialog;
const shell = electron.shell;
const store = new Store();

function handleSelectFolder() {
  const dir = dialog.showOpenDialog(win, {
    title: '选择目录',
    properties: ['openDirectory', 'createDirectory']
  });

  return dir;
}

function handleSelectFile() {
  const dir = dialog.showOpenDialog(win, {
    title: '选择文件',
    properties: ['openFile']
  });

  return dir;
}

function handleOpenDirectory(dir) {
  shell.showItemInFolder(dir);
}

function handleOpenFile(dir) {
  shell.openItem(dir);
}

function handleOpenLink(url) {
  shell.openExternal(url);
}

function handleRemovePath(dir) {
  shell.moveItemToTrash(dir);
}

function writeFile(opts) {
  if (!fs.existsSync(opts.directory)) {
    fs.mkdirSync(opts.directory);
  }

  const content = window.js_beautify(opts.data, {
    indent_size: 2,
    end_with_newline: true
  });

  fs.writeFile(`${opts.directory}/${opts.fileName}`, content, err => {
    if (err) {
      if (opts.error) opts.error(err);
      return false;
    }
    if (opts.success) opts.success();
  });
}

function initZelda(opts) {
  ipcRenderer.send('init-zelda', {
    dest: path.resolve(opts.dest, opts.name),
    install: opts.install
  });
}

function initZatlas(opts) {
  ipcRenderer.send('init-zatlas', {
    dest: path.resolve(opts.dest, opts.name),
    config: opts.zcfg,
    install: opts.install
  });
}

function generateFile(opts) {
  let extra = '';
  if (opts.noCss) {
    extra = '--no-css';
  }
  if (opts.noTpl) {
    extra = '--no-tpl';
  }

  ipcRenderer.send('generate-file', {
    dest: path.resolve(opts.config.dest, opts.config.name),
    type: opts.type,
    name: opts.name,
    option: extra
  });
}

function runNPM(opts) {
  ipcRenderer.send('run-npm', {
    dest: path.resolve(opts.dest, opts.name),
    type: opts.type
  });
}

function runDev(opts) {
  ipcRenderer.send('run-dev', {
    dest: path.resolve(opts.dest, opts.name),
    type: opts.type
  });
}

function addConsoleListener(cb) {
  ipcRenderer.on('z-log', (e, arg) => {
    cb && cb(arg);
  });
}

function rmConsoleListener() {
  ipcRenderer.removeAllListeners(['z-log']);
}

function readStore(key) {
  return store.get(key);
}

function writeStore(key, value) {
  store.set(key, value);
}

module.exports = {
  handleSelectFolder,
  handleSelectFile,
  handleOpenDirectory,
  handleOpenFile,
  handleOpenLink,
  handleRemovePath,
  writeFile,
  initZelda,
  initZatlas,
  generateFile,
  addConsoleListener,
  rmConsoleListener,
  runNPM,
  runDev,
  readStore,
  writeStore
};
