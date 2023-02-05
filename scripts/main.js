const {ipcRenderer} = require('electron')
let list = [];
let element = document.querySelector(".grid");
let closeButton = document.querySelector("#close")

closeButton.onclick = () =>{
    closeButton.parentElement.classList.add("hidden")
}


storeWindow.webContents.send('store-data', store);

firebase.database().ref("it-park-active").on("child_added", function(snapshot) {
    let node = document.createElement("div")
    node.innerHTML = `
    <h1>${snapshot.val().student.slice(0,1)}</h1>
    <h2>${snapshot.val().student}</h2>
    `;
    node.onclick = ()=>{
        closeButton.parentElement.classList.remove("hidden")
    }
    element.appendChild(node)
});


firebase.database().ref("it-park-active").on("child_removed", function(snapshot) {
    console.log(snapshot.val(), "removed")
});

let d = new Date();
d.getHours()