const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/tempDB", { useNewUrlParser: true });

const companySchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    website: String,
    description: String
});

const jobSchema = new mongoose.Schema({
    company: companySchema,
    position: String,
    batches: [Number],
    degrees: [String],
    req_cpi: Number,
    ctc: Number,
    locations: [String]
});

const studentSchema = new mongoose.Schema({
    firstname: String,
    middlename: String,
    lastname: String,
    mobileNO: String,
    email: String,
    password: String,
    dob: Date,
    gender: String,
    college: String,
    degree: String,
    cpi: Number,
    batch: Number,
    skills: String,
    resume: String
});

const Student = mongoose.model("Student", studentSchema);
const Company = mongoose.model("Company", companySchema);
const Job = mongoose.model("Job", jobSchema);

const tempCompany = new Company;

app.get("/", cors(), function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/companyLogin", function (req, res) {
    res.sendFile(__dirname + "/companyLogin.html");
});

app.get("/studentLogin", function (req, res) {
    res.sendFile(__dirname + "/studentLogin.html");
});

app.get("/companySignup", function (req, res) {
    res.sendFile(__dirname + "/companySignup.html");
});

app.get("/studentSignup", function (req, res) {
    res.sendFile(__dirname + "/studentSignup.html");
});

app.get("/companyHome", function (req, res) {
    res.sendFile(__dirname + "/companyHome.html");
})

app.get("/studentHome", function (req, res) {
    res.sendFile(__dirname + "/studentHome.html");
})

app.get("/addJob", function (req, res) {
    res.sendFile(__dirname + "/addJob.html");
})

app.post("/companyLogin", function (req, res) {

    var x = req.body.email;
    var y = req.body.password;

    //console.log("company-login");

    Company.findOne({ email: x, password: y }, function (err, company) {
        if (company) {
            res.redirect("/companyHome");
        }
        else {
            res.redirect("/");
        }
    })

});

app.post("/studentLogin", function (req, res) {

    var x = req.body.email;
    var y = req.body.password;

    console.log("student-login");

    Student.findOne({ email: x, password: y }, function (err, student) {
        if (student) {
            res.redirect("/studentHome");
        }
        else {
            res.redirect("/");
        }
    })

});

app.post("/companySignup", function (req, res) {
    var pass = req.body.rePassword;
    const newCompany = new Company({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        website: req.body.website,
        description: req.body.description
    });

    if (pass != req.body.password)
        console.log("Passwords do not match!");

    else {
        newCompany.save();
        res.redirect("/");
    }
});

app.post("/studentSignup", function (req, res) {

    const newStudent = new Student({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        mobileNO: req.body.mobileNO,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob,
        gender: req.body.gender,
        college: req.body.institute,
        degree: req.body.degree,
        cpi: req.body.cpi,
        batch: req.body.batch,
        skills: req.body.skills,
        resume: req.body.resume
    });


    newStudent.save();
    res.redirect("/");

})

app.post("/addJob", function (req, res) {

    const newJob = new Job({
        company: companySchema,
        position: req.body.position,
        batches: req.body.year,
        degrees: req.body.degree,
        req_cpi: req.body.cpi,
        ctc: req.body.ctc,
        locations: req.body.location
    });
    
    console.log(newJob);
    newJob.save();
    res.redirect("/companyHome");
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});