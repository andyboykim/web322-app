
//fs module provides an API for interacting with the file system
const fs = require("fs");

var students = [];
var programs = [];

//------------------------------------------------------------------------------------------
// FUNCTION INITIALIZE
// loads JSON data into global arrays
//------------------------------------------------------------------------------------------
module.exports.initialize = function () {

    var promise = new Promise((resolve, reject) => {
       
        try {
            fs.readFile('./data/students.json', (err, data) => {
                if (err) throw err;

                students = JSON.parse(data);
                console.log("INITIALIZE - load students.");
            })

            fs.readFile('./data/programs.json', (err, data) => {
                if (err) throw err;

                programs = JSON.parse(data);
                console.log("INITIALIZE - load programs.");
            })

        } catch (ex) {
                      console.log("INITIALIZE - FAILURE.");
                      reject("INITIALIZE - FAILURE.");
                     }
        console.log("INITIALIZE - SUCCESS.");
        resolve("INITIALIZE - SUCCESS.");
    })

    return promise;
};


module.exports.getAllStudents= function () {

    var promise = new Promise((resolve, reject) => {
        
       if(students.length === 0) {
        var err = "getAllStudents() does not have any data.";
        reject({message: err});
       }  

    resolve (students);
    })
    return promise;
};


module.exports.getInternationalStudents = function () {

    var InternationalStudents = [];
    var promise = new Promise((resolve, reject) => {
      
       for (var i=0; i < students.length; i++){
           if (students[i].IsInternationalStudents == true) {
            InternationalStudents.push(students[i]);
           }
       }

       if(InternationalStudents.length === 0) {
        var err = "getInternationalStudents() does not have any data.";
        reject({message: err});
       }  

    resolve (InternationalStudents);
    })
    return promise;
};


module.exports.getPrograms = function () {

    var promise = new Promise((resolve, reject) => {
        if(programs.length === 0) {
         var err = "getPrograms() does not have any data.";
         reject({message: err});
        }  
 
     resolve (programs);
     })
     return promise;
};