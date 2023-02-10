var http = require('http');
var fs = require('fs');

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();

const download = (url, dest,name, cb) => {
    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest);
    }
    var file = fs.createWriteStream(dest + name);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(cb);
      });
    });
  }
  
  download("http://localhost:3000/Downloads/Abstract%203D%20shapes%20(Community)/29.png", `/Users/User/Desktop/${year + "." + month + "." + date}/`,'29.png', ()=>{})