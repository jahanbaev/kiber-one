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

nextButton.onclick = () => {
    if(userPassword == passwordInput.value){
        ipcRenderer.send(CHANNEL_NAME, "success:"+userData);
        passwordInput.value = ""
    }
} 

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


firebase.database().ref("it-park-active").on("child_removed", function (snapshot) {
    closeButton.parentElement.classList.add("hidden")
    element.innerHTML = ''
    ipcRenderer.send('show', ":");
});

firebase.database().ref("it-park-active").on("child_added", function(snapshot) {
    console.log(snapshot.val())
    let node = document.createElement("div")
    node.style = 'background: ' + snapshot.val().color
    node.innerHTML = `
    <input class="hidden input" value="${snapshot.val().password}">
    <input class="hidden name" value="${JSON.stringify(snapshot.val()).replace(/"/g,"'")}">
    <h1>${snapshot.val().student.slice(0,1)}</h1>
    <h2>${snapshot.val().student}</h2>`;
    node.onclick = ()=>{
        userData = node.querySelector('.name').value
        userPassword = node.querySelector('.input').value
        closeButton.parentElement.classList.remove("hidden")
    }
    element.appendChild(node)
});




let d = new Date();
d.getHours()