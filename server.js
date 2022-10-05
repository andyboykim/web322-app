/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Edward Vuong Student ID: 120246186 Date: Feb 1, 2019 *
* Online (Heroku) Link: https://tranquil-chamber-71287.herokuapp.com/
* ********************************************************************************/
/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: junwan kim    Student ID: 152183216    Date: 09/30/2022
*
*  Online (Cyclic) Link: https://calm-ruby-lemming-coat.cyclic.app
*
********************************************************************************/ 


var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
app.use(express.static('img'));
const multer = require("multer");


app.use(express.static('public'));

var blogService = require("./blog-service.js");

onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}

const imgPath = "/public/images/uploaded";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, imgPath))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});

app.get("/images", function (req, res) {
    fs.readdir(path.join(__dirname, imgPath), function (err, items) {
  
      var obj = { images: [] };
      var size = items.length;
      for (var i = 0; i < items.length; i++) {
        obj.images.push(items[i]);
      }
      res.json(obj);
    });
});
  

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

app.get("/students/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addStudents.html"));
});

app.get("/images/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addImages.html"));
});
  
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"views/error404.html"));
});

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('promises unfulfilled');
});