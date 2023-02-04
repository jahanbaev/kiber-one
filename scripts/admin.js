const addStudent = () =>{
    let name = document.querySelector("#name").value
    let time = document.querySelector("#time").value
    let color = document.querySelector("#color").value
    let password = document.querySelector("#password").value
    firebase.database().ref("it-park-active").push().set({
        "student": name,
        "time": time,
        "color": color,
        "password": password
    })
}

document.querySelector(".set-name-btn").onclick = ()=> {
    addStudent()
}