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
    res.status(404).send("Page Not Found");
  });
  
  // listen on port 8080\. The default port for http is 80, https is 443\. We use 8080 here
  // because sometimes port 80 is in use by other applications on the machine
  app.listen(HTTP_PORT, onHttpStart);