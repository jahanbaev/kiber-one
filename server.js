const express     = require('express');

const http = require('http');

const fetch = require('node-fetch');


fetch(`http://192.168.100.72:3000/request/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: `{"url":"192.168.100.72:3015/Desktop/Saloxiddin/тАФPngtreeтАФpurple circle free illustration_4688810.png","user":"Saloxiddin","time":"Киберсила"}`
              })
              .then(e=>e.text())
              .then(e=>console.log("dwad",e))
              .catch(err => {
                console.log("error saman:", err )
              })