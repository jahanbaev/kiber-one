const { ipcRenderer } = require('electron');
let list = [];
let element = document.querySelector(".grid");
let closeButton = document.querySelector("#close");
let nextButton = document.querySelector("#next");
let passwordInput = document.querySelector("#password")
let userPassword = null;
let userName = null;
let userData = {};
const CHANNEL_NAME = 'main';
const MESSAGE = 'ping';

ipcRenderer.on(CHANNEL_NAME, (event, data) => { 
  console.log(data); 
});

if(localStorage.getItem("deviceId") == null){
    let res = prompt("deviceId","");

    localStorage.setItem("deviceId", res)
}

// nextButton.onclick = () => {
//     if(userPassword == passwordInput.value){
//         ipcRenderer.send(CHANNEL_NAME, "success:"+userData);
//         passwordInput.value = ""
//     }
// }

console.log("my ip is: ", ipcRenderer.send('getIp', ""))

ipcRenderer.on("getIp", (event, data) => {
    console.log(data);
  });

closeButton.onclick = () => {
    closeButton.parentElement.classList.add("hidden")
}

firebase.database().ref("it-park-shutdown").on("child_added", function(snapshot) {
    ipcRenderer.send('shut_down', "shutdown");
});


firebase.database().ref("it-park-files").on("child_added", function(snapshot) {
    ipcRenderer.send('files', snapshot.val());
});

firebase.database().ref("it-park-ip").on("child_added", function(snapshot) {
    ipcRenderer.send('ipaddress', snapshot.val());
});


firebase.database().ref("it-park-link").on("child_added", function(snapshot) {
    // ipcRenderer.send('link', snapshot.val());
});


firebase.database().ref("it-park-active").on("child_removed", (snapshot) => {
    closeButton.parentElement.classList.add("hidden")
    element.innerHTML = ''
    ipcRenderer.send('show', ":");
});

firebase.database().ref("it-park-active").on("child_added", (snapshot) => {
    if(localStorage.getItem("deviceId") == snapshot.val().id){
        ipcRenderer.send(CHANNEL_NAME, "success:"+ snapshot.val().student);
    }
});


document.addEventListener("keydown",(e) => {
    ipcRenderer.send('focus', ":");
})

let d = new Date();
d.getHours()