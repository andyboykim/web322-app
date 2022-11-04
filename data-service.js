const fs = require('fs')
var students = []
var programs = []


const initialize = () =>
	new Promise((resolve, reject) => {
		try {
			fs.readFile('./data/students.json', 'utf8', (err, data) => {
				if (err) throw err;
				students = JSON.parse(data)
			});

			fs.readFile('./data/programs.json', 'utf8', (err, data) => {
				if (err) throw err;
				programs = JSON.parse(data)
			});
		} catch (err) {
			reject('Unable to read file')
		}

		resolve()
	})


    const getAllStudents = () =>
	new Promise((resolve, reject) => {
		if (!students || students.length === 0) reject('no results returned')
		resolve(students)
	})

const getInternationalStudents = () =>
	new Promise((resolve, reject) => {
		const interStudents = students.filter((s) => s.isInternationalStudent === true)
		if (!interStudents || interStudents.length === 0) reject('no results returned')
		resolve(interStudents)
	})


const addStudent = (studentData) =>
	new Promise((resolve, reject) => {
		if (studentData.isInternationalStudent === undefined) {
			studentData.isInternationalStudent = false
		} else {
			studentData.isInternationalStudent = true
		}
        const maxStudentId = Math.max(...students.map(o => o.studentID))
		const newStudentId = (maxStudentId + 1).toString()
		studentData.studentID = newStudentId
		students.push(studentData)
		resolve(students)
	})
const getPrograms = () =>
	new Promise((resolve, reject) => {
		if (!programs || programs.length === 0) reject('no results returned')
		resolve(programs)
	})

const getStudentById = (sid) =>
	new Promise((resolve, reject) => {
		const student = students.find(o => o.studentID === sid)
		if (!student) reject('no results returned')
		resolve(student)
	})

const getStudentsByProgramCode = (programCode) =>
	new Promise((resolve, reject) => {
		const studentsByProgramCode = students.filter(o => o.program === programCode)
		if (studentsByProgramCode.length === 0) reject('no results returned')
		resolve(studentsByProgramCode)
	})

const getStudentsByExpectedCredential = (credential) =>
	new Promise((resolve, reject) => {
		const studentsByExpectedCredential = students.filter(o => o.expectedCredential === credential)
		if (studentsByExpectedCredential.length === 0) reject('no results returned')
		resolve(studentsByExpectedCredential)
	})

const getStudentsByStatus = (status) =>
	new Promise((resolve, reject) => {
		const studentsByStatus = students.filter(o => o.status === status)
		if (studentsByStatus.length === 0) reject('no results returned')
		resolve(studentsByStatus)
	})

module.exports.updateStudent = function (studentData) {
	var found = false;
	var promise = new Promise((resolve, reject) => {	
		for (var i=0; i < students.length; i++){
			if (students[i].studentID == studentData.studentID) {
				students[i] = studentData;
				found = true;
			}
		}
		if(found === false) {
		var err = "Cannot find student to update.";
		reject({message: err});
		}  
		resolve (students);
		})
		return promise;
};
	
module.exports = {
	initialize,
	getAllStudents,
	getInternationalStudents,
	getPrograms,
	addStudent,
	getStudentsByStatus,
	getStudentsByProgramCode,
	getStudentsByExpectedCredential,
	getStudentById,
}