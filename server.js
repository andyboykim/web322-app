/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Edward Vuong Student ID: 120246186 Date: Feb 1, 2019 *
* Online (Heroku) Link: https://tranquil-chamber-71287.herokuapp.com/
* ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');

var blogService = require(__dirname + "/blog-service.js");


onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

//otherwise /home would return an error
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.use((req, res) => {
    res.status(404).send(path.join(_dirname,"views/error404.html"));
  });

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('promises unfulfilled');
});