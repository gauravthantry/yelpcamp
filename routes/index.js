const express = require('express'),
    router = express.Router({ mergeParam: true }),
    passport = require('passport'),
    User = require("../models/user"),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    crypto = require('crypto');
var randomstring = require('randomstring');
var isLoggedIn = false,
    currentUser = null;

/* -------------------------SMTP server details ------------------------------*/
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "gaurav.thantry@gmail.com",
        pass: "#Mamatha09"
    }
}));
var token, passwordResetToken, mailOptions, host, link;


router.get("/", (req, res) => {
    res.render("landing", { currentUser: currentUser });
});

router.get("/register", (req, res) => {
    if (!isLoggedIn) {
        res.render("register");
    }
    else {
        req.flash("success", "You have already logged in to your account");
        res.render("index", { currentUser: currentUser });
    }
});

router.post("/register", (req, res) => {
    token = randomstring.generate(30);
    var salt = crypto.randomBytes(16).toString('hex'),
        hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`);
    let newUser = new User();
    newUser.username = req.body.username,
        newUser.email = req.body.email,
        newUser.token = token,
        newUser.saltValue = salt,
        newUser.password = hash;
    newUser.save((err, user) => { //saves the user details
        if (err) {
            return res.status(400).send({
                message: "Failed to add user."
            });
        }
        else {
            host = req.get('host');
            link = "http://" + host + "/verify?id=" + token;
            mailOptions = {
                from: '"Vidya Speaks" <gaurav.thantry@gmail.com>',
                to: req.body.email,
                subject: "Please confirm your email account",
                html: "Hello " + req.body.username + "<br> Please on the following link link to verify your email account. <br> <a href=" + link + ">Click here to verify</a>"
            }
            transport.sendMail(mailOptions, (err, res) => {
                if (err) {
                    return console.log(err);
                }
            })
            req.flash("success", "A verification link has been sent to your email. Please click on it to confirm your account");
            res.redirect("/login");
        }
    });
});

/*---------------- change isVerified to true if the account is verified ------------------------- */
router.get("/verify", (req, res) => {
    User.findOne({ token: req.query.id }).exec((err, user) => {
        if (err) {
            return res.send(err);
        }
        user.isVerified = !user.isVerified;
        user.save();
        res.redirect("/login");
    });
});

router.get("/login", (req, res) => {
    if (!isLoggedIn) {
        res.render("login");
    }
    else {
        req.flash("success", "You have already logged In");
        res.redirect("/");
    }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {
});

router.get("/logout", (req, res) => {
    //const successMessage = "<div class=\"container\"><div class=\"alert alert-success\" role=\"alert\"></div></div>";
    req.logout();
    req.flash("success", "You have successfully Logged Out");
    res.redirect("/login");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}

module.exports = router;