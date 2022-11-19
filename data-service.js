const Sequelize = require('sequelize');

var sequelize = new Sequelize('dcgasbnl', 'dcgasbnl', 'AW7xMO0zJ2gsP0Ka_-5wIwWfmNshg38T', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
    , query: { raw: true }
});

const Student = sequelize.define('student', {
	studentID: {
		type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
	},

	firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
    email:Sequelize.STRING,
    phone:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressState:Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    isInternationalStudent:Sequelize.BOOLEAN,
    expectedCredential:Sequelize.INTEGER,
    status:Sequelize.STRING,
    registrationDate:Sequelize.STRING
});

const Program = sequelize.define('Program' {
	programCode: {
		type:Sequelize.STRING,
        primaryKey:true,
	},

	programName:Sequelize.STRING
});

Program.hasMany(Student, {foreignKey: 'programs'});

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(resolve('database synced'))
        .catch(reject('unable to sync the database')); 
	});
}

module.exports.getAllStudents = function(){
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(resolve(Student.findAll()))
        .catch(reject('no results returned'));
	});
}

module.exports.addStudent = function (studentData) {
    return new Promise(function (resolve, reject) {
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
        for (var i in studentData ) {
            if (studentData [i] == "") { studentData [i] = null; }
        }

        Student.create(studentData )
        .then(resolve(Student.findAll()))
        .catch(reject('unable to create student'))
	});
};

module.exports.updateStudent = function (studentData) {
    studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;
    return new Promise(function (resolve, reject) {
        studentData.isInternationalStudent = (studentData.isInternationalStudent) ? true : false;

        for (var i in studentData) {
            if (studentData[i] == "") { studentData[i] = null; }
        }

        sequelize.sync()
        .then(Student.update(studentData, {where: {
            studentID: studentData.studentID
        }}))
        .then(resolve(Student.update(studentData, { where: { studentID:studentData.studentID }})))
        .catch(reject('unable to update student'))
	});
};


module.exports.getStudentById = function (id) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where:{
                studentID : id
            }
        })
        .then(resolve(Student.findAll({ where: { studentID : id }})))
        .catch(reject('no results returned'))
	});
};

module.exports.getStudentsByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where:{
                status: status
            }
        })
        .then(resolve(Student.findAll({ where: { status: status }})))
        .catch(reject('no results returned'))
	});
};

module.exports.getStudentsByProgramCode = function (program) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where:{
                program: program
            }
        })
        .then(resolve(Student.findAll({ where: { program: program }})))
        .catch(reject('no results returned'))
	});
};

module.exports.getStudentsByExpectedCredential = function (credential) {
    return new Promise(function (resolve, reject) {
        Student.findAll({
            where:{
                expectedCredential : credential
            }
        })
        .then(resolve(Student.findAll({ where: { expectedCredential : credential }})))
        .catch(reject('no results returned'))
	});
};


module.exports.getInternationalStudents = function () {
    return new Promise(function (resolve, reject) {
        (students.length > 0) ? resolve(students.filter(s => s.isInternationalStudent)) : reject("no results returned");
    });
};

module.exports.getPrograms = function(){
	return new Promise(function (resolve, reject) {
        reject();
	});
}

exports.addProgram = (programData) => {
    return new Promise((resolve,reject) => {
        for (var i in programData) {
            if (programData[i] == "") { programData[i] = null; }
        }

        Program.create(programData)
        .then(resolve(Program.findAll()))
        .catch(reject('unable to add program'))
    })
};

exports.updateProgram = (programData) => {
    return new Promise((resolve,reject) => {
        for (var i in programData) {
            if (programData[i] == "") { programData[i] = null; }
        }

        sequelize.sync()
        .then(Program.update(programData, {where: { 
            programCode: programData.programCode
        }}))
        .then(resolve(Program.update(programData, {where: { programCode:programData.programCode }})))
        .catch(reject('unable to update program'))
    })
};

exports.getProgramByCode = pcode => {
    return new Promise((resolve,reject) => {
        Program.findAll({ 
            where: {
                programCode: pcode
            }
        })
        .then(resolve(Program.findAll({ where: { programCode: pcode }})))
        .catch(reject('no results returned'))
    })
};

exports.deleteProgramByCode(pcode) = num => {
    return new Promise((resolve,reject) => {
        Program.destroy({
            where: {
                programCode: pcode
            }
        })
        .then(resolve())
        .catch(reject('unable to delete program'))
    })
};