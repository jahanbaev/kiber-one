const {ipcMain, app, BrowserWindow } = require('electron')
const AutoLaunch = require('auto-launch');
const chokidar = require('chokidar');
const ipcRenderer = require('electron').ipcRenderer;
require('./services/server.js');



ipcRenderer.on('store-data', function (event,store) {
    console.log(store);
});

const autoLauncher = new AutoLaunch({
    name: "MyApp"
});

autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
   autoLauncher.enable();
}).catch(function (err) {
  throw err;
});

const createWindow = () => {
  const win = new BrowserWindow({
    autoHideMenuBar: true, 
    // skipTaskbar: true
})


  win.maximize()
  win.setFullScreen(true);
  win.loadFile('index.html');
  setTimeout(()=>{
    // win.hide()
  },4000)
}

const litenFs = () =>{
    let watcher = chokidar.watch('/Users', {ignored: /^\./, persistent: true});

    watcher
      .on('add', function(path) {
        if(path.includes(".pptx")){
        console.log('File', path, 'has been added');
      }
      })
      // .on('change', function(path) {console.log('File', path, 'has been changed');})
      // .on('unlink', function(path) {console.log('File', path, 'has been removed');})
      // .on('error', function(error) {console.error('Error happened', error);})
}

app.whenReady().then(() => {
  // litenFs()
  createWindow()
})