const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
app.use(cors());
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
    company: [String],
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
    Company.find({email : x, password :y},function (err, company) {
        console.log(company);
        res.json(company);
    })
})

app.get("/studentHome", function (req, res) {
    Student.find({email : a, password :b},function (err, student) {
        //console.log(student);
        res.json(student);
    })
})

app.get("/addJob", function (req, res) {
    res.sendFile(__dirname + "/addJob.html");
})

app.get("/allJobs", function (req, res) {
    Job.find({}, function (err, job) {
        //console.log(job);
        res.json(job);
    })

    // res.sendFile(__dirname + "/allJobs.html");
})

app.get("/allCompanies", function (req, res) {
    res.sendFile(__dirname + "/allCompanies.html");
})

var x,y;

app.post("/companyLogin", function (req, res) {

    x = req.body.email;
    y = req.body.password;

    console.log("company-login");

    Company.findOne({ email: x, password: y }, function (err, company) {
        if (company) {
            console.log("sacho");
            // res.redirect("/companyHome");
        }
        else {
            console.log("khoto");
            //res.redirect("/");
        }
    })
});

var a,b;

app.post("/studentLogin", function (req, res) {

    var a = req.body.email;
    var b = req.body.password;

    console.log("student-login");

    Student.findOne({ email: a, password: b }, function (err, student) {
        if (student) {
            console.log("sacho");
        }
        else {
            console.log("khoto");
        }
    })

});

app.post("/companySignup", function (req, res) {

    console.log("company-added");
    const newCompany = new Company({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        website: req.body.website,
        description: req.body.description
    });

    // if (pass != req.body.password)
    //     console.log("Passwords do not match!");

    // else {
    newCompany.save();
    
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

    console.log("student-added");
    newStudent.save();

})

app.post("/addJob", function (req, res) {

    const newJob = new Job({
        company: "google",
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