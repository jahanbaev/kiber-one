let students = []
firebase.database().ref("it-park-students").on("child_added", function(snapshot) {
    students.push(snapshot.val())
    document.querySelector("#count").innerHTML = students.length
})



const addStudent = () =>{
    let student = document.querySelector("#name").value
    let time = document.querySelector("#time").value
    let color = document.querySelector("#color").value
    let password = document.querySelector("#password").value
    let port = 3002
    firebase.database().ref("it-park-students").push().set({
        student,
        time,
        color,
        password,
        port: (port +  students.length * 1)
    })
}

document.querySelector(".set-name-btn").onclick = ()=> {
    addStudent()
}