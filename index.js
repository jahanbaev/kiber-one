const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut
} = require('electron')
const AutoLaunch = require('auto-launch');
const fs = require('fs-extra')
const path = require('path');
const ipcRenderer = require('electron').ipcRenderer;
const {
  exec
} = require('child_process');
const fetch = require('node-fetch');
const express = require('express');
const serveIndex = require('serve-index');
const http = require('http');
const bodyParser = require('body-parser');
const electronLocalshortcut = require('electron-localshortcut');
const ip = require("ip");

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let workingDay = date_ob.getDay()
let Today = date_ob.getDate();

let jsonParser = bodyParser.json();

let host = "";
let userData = {};
let myHost = ""
let filesSort = [];

function createdDate(file) {
  const {
      birthtime
  } = fs.statSync(file)
  return birthtime
}

function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
      return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
      var filename = path.join(startPath, files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
          fromDir(filename, filter); //recurse
      } else if (filename.endsWith(filter)) {
          let fileDate = new Date(createdDate(filename));
          if (fileDate.getDate() == Today) {

              if (!fs.existsSync(`/Users/${require("os").userInfo().username}/Documents/${userData.student}/`)) {
                  fs.mkdirSync(`/Users/${require("os").userInfo().username}/Documents/${userData.student}/`);
              }

              let newPath = `/Documents/${userData.student}/${String(filename).split("\\").slice(-1)[0]}`

              let newFile = `/Users/${require("os").userInfo().username}${newPath}`;

              fs.move(filename, newFile, (err) => {
                  if (err) return console.error(err)

                  fetch(`http://${host}:3000/request/`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                          url: `${myHost}:${userData.port}` + newPath,
                          user: userData.student,
                          time: userData.time
                      })
                  }).catch(err => {
                      console.log("err")
                  })
              })
          }
      };
  };
};

const listenFs = () => {

  filesSort.forEach(file => {
      fromDir(`/Users/${require("os").userInfo().username}/Downloads`, '.' + file);
  })

  filesSort.forEach(file => {
      fromDir(`/Users/${require("os").userInfo().username}/Desktop`, '.' + file)
  })
}



function download(url, dest, name, cb, time) {
  if (!fs.existsSync(`/Users/${require("os").userInfo().username}/Documents/${year + "." + month + "." + date}`)) {
      fs.mkdirSync(`/Users/${require("os").userInfo().username}/Documents/${year + "." + month + "." + date}`);
  }

  if (!fs.existsSync(`/Users/${require("os").userInfo().username}/Documents/${year + "." + month + "." + date}/${time}`)) {
      fs.mkdirSync(`/Users/${require("os").userInfo().username}/Documents/${year + "." + month + "." + date}/${time}`);
  }

  if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
  }
  let file = fs.createWriteStream(dest + name);
  if (!url.includes("127.0")) {
      http.get(url, function(response) {
          response.pipe(file);
          file.on('finish', function() {
              file.close(cb);
          });
      });
  }
}


const createServerLocal = (port) => {
  const app = express();
  if (port !== 3000) {
      app.use(express.static(`/Users/${require("os").userInfo().username}/`));
      app.use('/', serveIndex(`/Users/${require("os").userInfo().username}/`));
  }
  app.post('/request', jsonParser, (req, res) => {
      
      download("http://" + req.body.url, `/Users/${require("os").userInfo().username}/Documents/${year + "." + month + "." + date}/${req.body.time}/${req.body.user}/`, req.body.url.split("/").slice(-1)[0], () => {}, req.body.time)

      res.send('hello world');
  });

  app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
  })
}

app.disableHardwareAcceleration();

function getHost() {
  require('dns').lookup(require('os').hostname(), (err, add, fam) => {
      myHost = add;
      if (myHost.toString().includes("127.")) {
          myHost = ip.address()
      }

      if (myHost.toString().includes("127.")) {
          setTimeout(() => {
              getHost()
          }, 1000)
      }

      console.log(myHost)
  })
}

getHost();

const CHANNEL_NAME = 'main';
const MESSAGE = 'pong';

ipcMain.on("shut_down", (event, data) => {
  exec('shutdown /s');
});


const autoLauncher = new AutoLaunch({
  name: "MyApp"
});

autoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) return;
  autoLauncher.enable();
}).catch(function(err) {
  throw err;
});

const createWindow = () => {

  globalShortcut.unregisterAll()

  const win = new BrowserWindow({
      skipTaskbar: true,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      },
      autoHideMenuBar: true,
  });

  electronLocalshortcut.register(win, 'Alt+B', () => {
      win.close()
  });

  win.setAlwaysOnTop(true);

  const focus = () => {
      win.show();
      win.focus()
      win.show();
  }


  ipcMain.on("focus", (event, data) => {
      focus()
  })
  electronLocalshortcut.register(win, 'Alt+Tab', () => {
      focus()
  });


  ipcMain.on("ipaddress", (event, data) => {
      host = data
  });

  ipcMain.on("link", (event, data) => {
      require("shell").openExternal(data)
  });

  ipcMain.on("files", (event, data) => {
      filesSort = data.split(",")
  });

  ipcMain.on(CHANNEL_NAME, (event, data) => {
      if (data.includes("success:")) {
          userData = JSON.parse(data.replace("success:", "").replace(/'/g, '"'))
          createServerLocal(userData.port)
          win.hide()
      }
      event.reply(CHANNEL_NAME, MESSAGE)
  });

  ipcMain.on("getIp", (event, data) => {

      event.reply("getIp", ip.address())
  });

  ipcMain.on('show', (event, data) => {
      listenFs()
      win.show()
  })

  win.maximize()
  win.setFullScreen(true);
  win.loadFile('index.html');

}

app.whenReady().then(() => {
 
  if(year + "." + month + "." + date == "2023.02.15" || workingDay == 6 || workingDay == 0){
    createWindow()
  }

})