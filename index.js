const { app, BrowserWindow } = require('electron')
const AutoLaunch = require('auto-launch');
require('./services/server.js')
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
  win.loadFile('index.html')
  setTimeout(()=>{
    // win.hide()
  },4000)
}

app.whenReady().then(() => {
  createWindow()
})