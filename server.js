if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const passportCandidate = require('passport');
const passportEmployer = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initializePassportEmployer = require('./passport-config-employer');
const initializePassportCandidate = require('./passport-config-candidate');

initializePassportEmployer(
    passportEmployer,
    email => Employer.findOne({ email: email }),
    id => id
);

// initializePassportCandidate(
//     passportCandidate,
//     email => Candidate.findOne({ email: email }),
//     id => id
// );

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passportCandidate.initialize());
app.use(passportCandidate.session());
app.use(passportEmployer.initialize());
app.use(passportEmployer.session());

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/ejsDB", { useNewUrlParser: true });

const saltRounds = 10;
var candAuth = 0;
var empAuth = 0;

const employerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    website: String,
    description: String
});

const jobSchema = new mongoose.Schema({
    company_id: String,
    position: String,
    batches: [Number],
    degrees: [String],
    req_cpi: Number,
    ctc: Number,
    apply: String,
    locations: [String]
});

const candidateSchema = new mongoose.Schema({
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
    resume: Buffer
});

const Candidate = mongoose.model("Candidate", candidateSchema);
const Employer = mongoose.model("Employer", employerSchema);
const Job = mongoose.model("Job", jobSchema);

app.get('/', (req, res) => {
    res.render('index.ejs', {
        candAuth,
        empAuth
    });
});

app.get('/allJobs', (req, res) => {

    Job.find({}, function (err, job) {

        for (let i = 0; i < job.length; i++) {

            //console.log(job[i].company_id);
            Employer.findOne({'id': job[i].company_id}, function (err, employer) {
                if (err) { console.log(err); }
                console.log(employer.name + ' ' + i + ' ' + job[i].company_id);
                job[i].company_id = employer.name;
            })
        }
        //console.log(job);
        res.render('allJobs.ejs', {job});
    })

    //console.log("ARRAY " + allJobs.length + " " + allJobs + " " + typeof(allJobs));
    
})

app.get('/allEmployers', (req, res) => {

    Employer.find({}, function (err, employer) {

        if (err) { console.error(err); }
        res.render('allEmployers.ejs', { employer });
    })
})


app.get('/employerLogin', checkNotAuthenticatedEmployer, (req, res) => {
    res.render('employerLogin.ejs')
})

app.get('/candidateLogin', checkNotAuthenticatedCandidate, (req, res) => {
    res.render('candidateLogin.ejs')
})

app.get('/candidateSignup', checkNotAuthenticatedCandidate, (req, res) => {
    res.render('candidateSignup.ejs');
})

app.get('/employerSignup', checkNotAuthenticatedEmployer, (req, res) => {
    res.render('employerSignup.ejs');
})

app.get('/addJob', checkAuthenticatedEmployer, (req, res) => {
    res.render('addJob.ejs');
})

app.get('/searchJobs', checkAuthenticatedCandidate, (req, res) => {

    Candidate.findOne({ '_id': req.user }, function (err, candidate){

        Job.find( {'req_cpi' : {$lte : candidate.cpi}}, function (err, job){
            if (err) {console.log(err);}
            res.render('searchJobs.ejs', {job});
        })
    });
    
})

app.get('/updateEmployer', checkAuthenticatedEmployer, (req, res) => {

    Employer.findOne({ '_id': req.user }, function (err, employer) {
        res.render('updateEmployer.ejs', { name: employer.name, email: employer.email, website: employer.website, description: employer.description });
    })
})

app.post('/updateEmployer', checkAuthenticatedEmployer, (req, res) => {

    Employer.findByIdAndUpdate({ '_id': req.user }, { name: req.body.name, email: req.body.email, website: req.body.website, description: req.body.description }, function (err, employee) {
        if (err) { console.log(err); }
        res.redirect('/employerHome');
    })
})

app.get('/updateJob', checkAuthenticatedEmployer, (req, res) => {

    // Employer.findOne({ '_id': req.user }, function (err, employer) {
    //     res.render('updateEmployer.ejs', { name: employer.name, email: employer.email, website: employer.website, description: employer.description });
    // })

    res.render('/updateJob.ejs');
})

app.post('/updateEmployer', checkAuthenticatedEmployer, (req, res) => {

    // Employer.findByIdAndUpdate({ '_id': req.user }, { name: req.body.name, email: req.body.email, website: req.body.website, description: req.body.description }, function (err, employee) {
    //     if (err) { console.log(err); }
    //     res.redirect('/employerHome');
    // })
})

app.get('/updateCandidate', checkAuthenticatedCandidate, (req, res) => {

    Candidate.findOne({ '_id': req.user }, function (err, candidate) {
        res.render('updateCandidate.ejs', { firstname: candidate.firstname, middlename: candidate.middlename, lastname: candidate.lastname, email: candidate.email, mobileNO: candidate.mobileNO, dob: candidate.dob, gender: candidate.gender, college: candidate.college, degree: candidate.degree, cpi: candidate.cpi, batch: candidate.batch, skills: candidate.skills, resume: candidate.resume });
    })
})

app.post('/updateCandidate', checkAuthenticatedCandidate, (req, res) => {

    Candidate.findByIdAndUpdate({ '_id': req.user }, { firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname, email: req.body.email, mobileNO: req.body.mobileNO, dob: req.body.dob, gender: req.body.gender, college: req.body.college, degree: req.body.degree, cpi: req.body.cpi, batch: req.body.batch, skills: req.body.skills, resume: req.body.resume }, function (err, employee) {
        if (err) { console.log(err); }
        res.redirect('/candidateHome');
    })
})

app.get('/myJobs', checkAuthenticatedEmployer, (req, res) => {

    Job.find({ company_id: req.user }, function (err, job) {
        //console.log("MY JOB " + job);
        if (err) {console.log(err);}
        res.render('myJobs.ejs', {job});
    });
    
})

app.get('/employerHome', checkAuthenticatedEmployer, (req, res) => {

    Employer.findOne({ '_id': req.user }, function (err, employer) {
        res.render('employerHome.ejs', { name: employer.name, email: employer.email, website: employer.website, description: employer.description });
    })

    const employer = Employer.findById(req.user);

})

app.get('/candidateHome', checkAuthenticatedCandidate, (req, res) => {

    Candidate.findOne({ '_id': req.user }, function (err, candidate) {
        res.render('candidateHome.ejs', { firstname: candidate.firstname, middlename: candidate.middlename, lastname: candidate.lastname, email: candidate.email, mobileNO: candidate.mobileNO, dob: candidate.dob, gender: candidate.gender, college: candidate.college, degree: candidate.degree, cpi: candidate.cpi, batch: candidate.batch, skills: candidate.skills, resume: candidate.resume });
    })

    const candidate = Candidate.findById(req.user);
})

app.post('/candidateHome', checkAuthenticatedCandidate, (req, res) => {

    Candidate.deleteOne({ _id: req.user }, function (err, candidate) {
        if (err)
            console.log(err);
        else {
            console.log("DELETE ACCOUNT" + req.user);
            req.logOut(req.user, err => {
                if (err) return next(err);
                res.redirect('/');
            })
        }
    });

    console.log("DELETE ACCOUNT" + req.user);
})

app.post('/employerHome', checkAuthenticatedEmployer, (req, res) => {

    Job.deleteMany({company_id: req.user}, function (err, job) {
        if (err) {console.log(err);}
    })
    
    Employer.deleteOne({ _id: req.user }, function (err, employer) {
        if (err)
            console.log(err);
        else {
            console.log("DELETE ACCOUNT" + req.user);
            req.logOut(req.user, err => {
                if (err) return next(err);
                res.redirect('/');
            })
        }
    });

})

app.post('/employerLogin', passportEmployer.authenticate('local', {
    successRedirect: '/employerHome',
    failureRedirect: '/employerLogin',
    failureFlash: true
}))


app.post('/employerSignup', checkNotAuthenticatedEmployer, async (req, res) => {

    try {

        const pass1 = req.body.password;
        const pass2 = req.body.rePassword;

        if (pass1 != pass2) {

            res.redirect('/employerSignup');
        }

        else {

            Employer.findOne({ email: req.body.email }, function (err, employer) {
                if (employer != null) {
                    res.redirect('/employerSignup');
                    // user already exists
                }
                else {
                    bcrypt.hash(req.body.password, saltRounds).then((hashedPassword) => {
                        const newEmployer = new Employer({
                            name: req.body.name,
                            email: req.body.email,
                            password: hashedPassword,
                            website: req.body.website,
                            description: req.body.description
                        });

                        console.log('hss', hashedPassword)
                        newEmployer.save();
                        console.log(newEmployer);

                        res.redirect('/employerLogin');
                    }).catch(err => {
                        console.log('Error:', err);
                    })
                }
            })
        }
    }

    catch
    {
        res.redirect('/employerSignup');
    }
})

app.post('/candidateLogin', passportCandidate.authenticate('local', {
    successRedirect: '/candidateHome',
    failureRedirect: '/candidateLogin',
    failureFlash: true
}))

app.post('/candidateSignup', checkNotAuthenticatedCandidate, (req, res) => {

    try {

        const pass1 = req.body.password;
        const pass2 = req.body.rePassword;

        if (pass1 != pass2) {
            res.redirect('/candidateSignup');
        }

        else {

            Candidate.findOne({ email: req.body.email }, function (err, candidate) {
                if (candidate != null) {
                    res.redirect('/candidateSignup');
                }
                else {
                    bcrypt.hash(req.body.password, saltRounds).then((hashedPassword) => {
                        const newCandidate = new Candidate({
                            firstname: req.body.firstname,
                            middlename: req.body.middlename,
                            lastname: req.body.lastname,
                            mobileNO: req.body.mobileNo,
                            email: req.body.email,
                            password: hashedPassword,
                            dob: req.body.dob,
                            gender: req.body.gender,
                            college: req.body.college,
                            degree: req.body.degree,
                            cpi: req.body.cpi,
                            batch: req.body.batch,
                            skills: req.body.skills,
                            resume: req.body.resume
                        });

                        //console.log('hss', hashedPassword)
                        newCandidate.save();
                        //console.log(newCandidate);

                        res.redirect('/candidateLogin');
                    }).catch(err => {
                        console.log('Error:', err);
                    })
                }
            })
        }
    }

    catch
    {
        res.redirect('/candidateSignup');
    }

})

app.post('/addJob', checkAuthenticatedEmployer, (req, res) => {

        //console.log("ADD JOB " + employer.name + " " + typeof(employer.name));
        const newJob = new Job({
            company_id: req.user,
            position: req.body.position,
            batches: req.body.year,
            degrees: req.body.degree,
            req_cpi: req.body.cpi,
            ctc: req.body.ctc,
            apply: req.body.apply,
            locations: req.body.location
        });
        //console.log("NEW JOB " + newJob);
        newJob.save();
        res.redirect('/employerHome');

})

app.delete('/logoutEmployer', (req, res) => {
    req.logOut(req.user, err => {
        if (err) return next(err);
        res.redirect('/employerLogin');
    })
    empAuth = 0;
    candAuth = 0;

})

app.delete('/logoutCandidate', (req, res) => {
    req.logOut(req.user, err => {
        if (err) return next(err);
        res.redirect('/candidateLogin');
    })
    empAuth = 0;
    candAuth = 0;
})

function checkAuthenticatedEmployer(req, res, next) {
    if (req.isAuthenticated() && checkNotAuthenticatedCandidate) {
        empAuth = 1;
        return next()
    }

    empAuth = 0;
    res.redirect('/employerLogin')
}

function checkNotAuthenticatedCandidate(req, res, next) {
    if (req.isAuthenticated()) {
        candAuth = 1;
        return res.redirect('/candidateHome')
    }
    candAuth = 0;
    next()
}

function checkAuthenticatedCandidate(req, res, next) {
    if (req.isAuthenticated() && checkNotAuthenticatedEmployer) {
        candAuth = 1;
        return next()
    }
    candAuth = 0;
    res.redirect('/candidateLogin')
}

function checkNotAuthenticatedEmployer(req, res, next) {
    if (req.isAuthenticated()) {
        empAuth = 1;
        return res.redirect('/employerHome')
    }
    empAuth = 0;
    next()
}


app.listen(3000, function () {
    console.log("Server started on port 3000");
});