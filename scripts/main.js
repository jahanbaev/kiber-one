let list = [];
let element = document.querySelector(".grid")
firebase.database().ref("it-park-active").on("child_added", function(snapshot) {
    console.log(snapshot.val())
    let node = document.createElement("div")
    node.innerHTML = `
    <h1>${snapshot.val().student.slice(0,1)}</h1>
    <h2>${snapshot.val().student}</h2>
    `
    element.appendChild(node)
});

firebase.database().ref("it-park-active").on("child_removed", function(snapshot) {
    console.log(snapshot.val(), "removed")
});

let d = new Date();
d.getHours()