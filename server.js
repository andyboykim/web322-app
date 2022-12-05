/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: junwan kim    Student ID: 152183216    Date: 11/4/2022
*
*  Online (Cyclic) Link: https://calm-ruby-lemming-coat.cyclic.app

********************************************************************************/ 
const express = require("express");
const path = require("path");
const data = require("./data-service.js");
const fs = require("fs");
const multer = require("multer");
const exphbs = require('express-handlebars');
const app = express();
const dataServiceAuth = require("./data-service-auth.js");
const clientSessions = require('client-sessions');


const HTTP_PORT = process.env.PORT || 8080;

const onHttpStart = () => {
    console.log("Express http server listening on port " + HTTP_PORT);
};

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    defaultLayout: "main",
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    } 
}));

app.set('view engine', '.hbs');

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      // we write the filename as the current date down to the millisecond
      // in a large web service this would possibly cause a problem if two people
      // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
      // this is a simple example.
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  // tell multer to use the diskStorage function for naming files instead of the default.
  const upload = multer({ storage: storage });

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.use(clientSessions( {
    cookieName: "session",
    secret: "web_a6_secret",
    duration: 2*60*1000,
    activeDuration: 1000*60
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
  
ensureLogin = (req,res,next) => {
    if (!(req.session.user)) {
        res.redirect("/login");
    }
    else { next(); }
};

app.get("/", (req,res) => {
    res.render("home");
});

app.get("/about", (req,res) => {
    res.render("about");
});


app.get("/images/add", ensureLogin, (req,res) => {
    res.render("addImage");
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), (req,res) =>{
    res.redirect("/images");
});

app.get("/images", ensureLogin, (req,res) => {
    fs.readdir("./public/images/uploaded", function(err, items) {
        res.render("images",{images:items});
    });
});




app.get("/students/add", ensureLogin, (req,res) => {
    
    data.getPrograms().then((data)=>{
        res.render("addStudent", {programs: data});
    }).catch((err) => {
    // set program list to empty array
    res.render("addStudent", {programs: [] });
    });

});

app.post("/students/add", ensureLogin, (req, res) => {
    data.addStudent(req.body).then(()=>{
      res.redirect("/students"); 
    }).catch((err)=>{
        res.status(500).send("Unable to Add the Student");
      });
});


app.get("/students", ensureLogin, (req, res) => {
    
   if (req.query.status) {
        data.getStudentsByStatus(req.query.status).then((data) => {
            res.render("students", {students:data});
        }).catch((err) => {
            res.render("students",{ message: "no results" });
        });
    } else if (req.query.program) {
        data.getStudentsByProgramCode(req.query.program).then((data) => {
            res.render("students", {students:data});
        }).catch((err) => {
            res.render("students",{ message: "no results" });
        });
    } else if (req.query.credential) {
        data.getStudentsByExpectedCredential(req.query.credential).then((data) => {
            res.render("students", {students:data});
        }).catch((err) => {
            res.render("students",{ message: "no results" });
        });
    } else {
        data.getAllStudents().then((data) => {
            res.render("students", {students:data});
        }).catch((err) => {
            res.render("students",{ message: "no results" });
        });
    }
});

app.get("/student/:studentId", ensureLogin, (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};

    data.getStudentById(req.params.studentId).then((data) => {
        if (data) {
            viewData.student = data; //store student data in the "viewData" object as "student"
        } else {
            viewData.student = null; // set student to null none were returned
        }
    }).catch(() => {
        viewData.student = null; // set student to null if there was an error 
    }).then(data.getPrograms)
    .then((data) => {
        viewData.programs = data; // store program data in the "viewData" object as "programs"

        // loop through viewData.programs and once we have found the programCode that matches
        // the student's "program" value, add a "selected" property to the matching 
        // viewData.programs object
        for (let i = 0; i < viewData.programs.length; i++) {
            if (viewData.programs[i].programCode == viewData.student.program) {
                viewData.programs[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.programs = []; // set programs to empty if there was an error
    }).then(() => {
        if (viewData.student == null) { // if no student - return an error
            res.status(404).send("Student Not Found");
        } else {
            res.render("student", { viewData: viewData }); // render the "student" view
        }
    }).catch((err)=>{
        res.status(500).send("Unable to Show Students");
      });
});

app.get("/intlstudents", ensureLogin, (req,res) => {
    data.getInternationalStudents().then((data)=>{
        res.json(data);
    });
});

app.post("/student/update", ensureLogin, (req, res) => {
    data.updateStudent(req.body).then(()=>{
    res.redirect("/students");
  }).catch((err)=>{
    res.status(500).send("Unable to Update the Student");
  });
  
});

app.get("/students/delete/:sid", (req,res)=>{
    data.deleteStudentById(req.params.sid).then(()=>{
        res.redirect("/students");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Student / Student Not Found");
    });
});



app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
    dataServiceAuth.registerUser(req.body)
    .then(() => res.render("register", {successMessage: "User created" } ))
    .catch (err => res.render("register", {errorMessage: err, userName:req.body.userName }) )
});

app.post("/login", (req,res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then(user => {
        req.session.user = {
            userName:user.userName,
            email:user.email,
            loginHistory:user.loginHistory
        }
        res.redirect("/employees");
    })
    .catch(err => {
        res.render("login", {errorMessage:err, userName:req.body.userName} )
    }) 
});

app.get("/logout", (req,res) => {
    req.session.reset();
    res.redirect("/login");
});

app.get("/userHistory", ensureLogin, (req,res) => {
    res.render("userHistory", {user:req.session.user} );
});





app.get("/programs/add", ensureLogin, (req,res) => {
    res.render("addProgram");
});
  
app.post("/programs/add", ensureLogin, (req, res) => {
    data.addProgram(req.body).then(()=>{
        res.redirect("/programs");
    }).catch((err)=>{
        res.status(500).send("Unable to Add the Program");
    });
});
  

app.get("/programs", ensureLogin, (req,res) => {
    data.getPrograms().then((data)=>{
        res.render("programs", (data.length > 0) ? {programs:data} : { message: "no results" });
    }).catch((err) => {
        res.render("programs",{message:"no results"});
    });
});

app.get("/program/:programCode", ensureLogin, (req, res) => {
    data.getProgramByCode(req.params.programCode).then((data) => {
        if(data){
            res.render("program", { data: data });
        }else{
            res.status(404).send("Program Not Found");
        }
     
    }).catch((err) => {
        res.status(404).send("Program Not Found");
    });
  
});


app.post("/program/update", ensureLogin, (req, res) => {
    data.updateProgram(req.body).then(()=>{
        res.redirect("/programs");
    }).catch((err)=>{
        res.status(500).send("Unable to Update the Program");
    });
});
  

app.get("/programs/delete/:programCode", ensureLogin, (req,res)=>{
    data.deleteProgramByCode (req.params.programCode).then(()=>{
        res.redirect("/programs");
    }).catch((err)=>{
        res.status(500).send("Unable to Remove Program / Program Not Found");
    });
});



data.initialize()
.then(dataServiceAuth.initialize())
.then(() => {
    app.listen(HTTP_PORT, onHttpStart)
}).catch ((err) => {
    console.log(err);
});


/*app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });

data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});*/