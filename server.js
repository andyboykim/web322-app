/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: junwan kim    Student ID: 152183216    Date: 10/12/2022
*
*  Online (Cyclic) Link: https://calm-ruby-lemming-coat.cyclic.app

********************************************************************************/ 

/*
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require('path');
app.use(express.static('img'));
const multer = require("multer");
const upload = multer({ storage: storage });
app.use(express.static('public'));
var blogService = require("./blog-service.js");
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');


onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
}

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
});

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
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.get("/images/add", function (req, res) {
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});
  
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err,items) {
        res.json(items);
    })
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"views/error404.html"));
});

blogService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart());
}).catch (() => {
    console.log('promises unfulfilled');
});
*/

const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const dataService = require('./data-service.js')
const app = express()
const PORT = process.env.PORT || 8080
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
	filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
	}
})

const upload = multer({ storage: storage })

app.get('/', (_, res) => {
	res.sendFile(__dirname + '/views/home.html')
})

app.get('/about', (_, res) => {
	res.sendFile(__dirname + '/views/about.html')
})

app.get('/students', (req, res) => {
	const { status, program, credential } = req.query
	if (status !== undefined) {
		dataService.getStudentsByStatus(status).then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json({ message: err })
		})
	} else if (program !== undefined) {
		dataService.getStudentsByProgramCode(program).then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json({ message: err })
		})
	} else if (credential !== undefined) {
		dataService.getStudentsByExpectedCredential(credential).then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json({ message: err })
		})
	} else {
		dataService.getAllStudents().then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json({ message: err })
		})
	}
})

app.get('/student/:value', (req, res) => {
	const { value } = req.params
	dataService.getStudentById(value).then((data) => {
		res.json(data)
	}).catch((err) => {
		res.json({ message: err })
	})
})

app.get('/students/add', (_, res) => {
	res.sendFile(__dirname + '/views/addStudent.html')
})

app.post('/students/add', (req, res) => {
	dataService.addStudent(req.body).then(() => {
		res.redirect('/students')
	}).catch((err) => {
		res.json({ message: err })
	})
})

app.get('/intlstudents', (_, res) => {
	dataService.getInternationalStudents().then((data) => {
		res.json(data)
	}).catch((err) => {
		res.json({ message: err })
	})
})

app.get('/programs', (_, res) => {
	dataService.getPrograms().then((data) => {
		res.json(data)
	}).catch((err) => {
		res.json({ message: err })
	})
})

app.get('/images/add', (_, res) => {
	res.sendFile(__dirname + '/views/addImage.html')
})

app.post('/images/add', upload.single("imageFile"), (_, res) => {
	res.redirect('/images')
})

app.get('/images', (_, res) => {
	const images = []
	fs.readdir('./public/images/uploaded', function (err, items) {
		images.push(items)
		res.json({ images })
	});
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname,"views/error404.html"));
});

dataService.initialize().then(() => {
	app.listen(PORT, () => {
		console.log(`Express http server listening on ${PORT}`)
	})
})
.catch((err) => {
	console.log(err)
})