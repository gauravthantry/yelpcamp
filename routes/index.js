const express = require('express'),
    router = express.Router({ mergeParam: true }),
    User = require("../models/user"),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    crypto = require('crypto');
var randomstring = require('randomstring');
var isLoggedIn = false,
    currentUser = null;


/* -------------------------SMTP server details ------------------------------*/
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//------------ Under Construction method for authenticating using google API -------------------//
// var transport = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 25,
//     secure: true,
//     auth: {
//         type: 'OAuth2',
//         user: "yelpcampinggrounds@gmail.com",
//         clientId: '734610897335-uqpu8t3au1e231805ke9m6slk8p13dbv.apps.googleusercontent.com',
//         clientSecret: 'hDfhT2u63NSvnHB7wUzdcbbP',
//         refreshToken: '1//04NZTlxjmlkaECgYIARAAGAQSNwF-L9Iri0iqOP-k4y2o9bA-5GCKUuGkmMbgGcc0Wsa-tKJA1DYGtabb-6kGDb7UqYnsf_CMI24'
//     }

// });
//----------------------------------------------------------------------------------------------//

var transport = nodemailer.createTransport(smtpTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "yelpcampinggrounds@gmail.com",
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
            if(err.errmsg.includes("duplicate")){
                req.flash("error", "A user with this username/email already exists.");
                res.redirect("/register");
            }
        }
        //---------------------- Under construction loop for authentication using Google API -------------------------//
        // else {
        //     host = req.get('host');
        //     link = "http://" + host + "/verify?id=" + token;
        //     mailOptions = {
        //         from: '"Yelp camp" <yelpcampinggrounds@gmail.com>',
        //         to: req.body.email,
        //         subject: "Please confirm your email account",
        //         html: "Hello " + req.body.username + "<br> Please on the following link link to verify your email account. <br> <a href=" + link + ">Click here to verify</a>",
        //         auth: {
        //             user: "yelpcampinggrounds@gmail.com",
        //             refreshToken: '1//04NZTlxjmlkaECgYIARAAGAQSNwF-L9Iri0iqOP-k4y2o9bA-5GCKUuGkmMbgGcc0Wsa-tKJA1DYGtabb-6kGDb7UqYnsf_CMI24',
        //             accessToken: 'ya29.Il-4B39HWX6J190zO67kbDo9xWvzWmyuppl771fqePRkTssEK2fe-6k1DrqLT99DV3wLC83q1lKTNz-IbdOo23MmWKhv7dAkSu2CAR04PcjR5woZHeRITSHWINNUjRu0QQ',
        //         }
        //     }
        //     transport.sendMail(mailOptions, (err, res) => {
        //         if (err) {
        //             return console.log(err);
        //         }
        //     })
        //     req.flash("success", "A verification link has been sent to your email. Please click on it to confirm your account");
        //     res.redirect("/login");
        // }
        //--------------------------------------------------------------------------------------------------------------//
        else {
            host = req.get('host');
            link = "http://" + host + "/verify?id=" + token;
            mailOptions = {
                from: '"Yelp camp" <gaurav.thantry@gmail.com>',
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
        req.flash("success", "You are already logged In");
        res.redirect("/campgrounds");
    }
});

router.post("/login", (req, res) => {
    var username = req.body.username;
    User.findOne({ username: RegExp(username, "i") } , (err, user) => {
        if (user === null) {
            req.flash("error", "The provided username is incorrect. Please try again");
            res.redirect("/login");
        }
        else if (user.isVerified) {
            if (user.validPassword(user, req.body.password)) {
                isLoggedIn = true;
                currentUser = user;
                module.exports.currentUser = user;
                res.redirect("/campgrounds");
            }
            else {
                req.flash("error", "Incorrect password. Please try again");
                res.redirect("/login");
            }
        } else if (!user.isVerified) {
            req.flash("error", "Please confirm your email first by clicking on the activation link that was sent to you during registration");
            res.redirect("/login");
        }
    });
});

/*------------------------------------Logout Route------------------------------------------- */
router.get("/logout", (req, res) => {
    isLoggedIn = false;
    currentUser = null;
    module.exports.currentUser = currentUser;
    req.flash("success", "You have successfully logged out");
    res.redirect("/login");
});

/*------------------------------------forgot password route---------------------------------- */
router.get("/forgot", (req, res) => {
    res.render("forgot");
});

router.post("/forgot", (req, res) => {
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {
            req.flash("error", err);
        }
        else {
            token = randomstring.generate(30);
            User.update({ email: req.body.email }, {
                passwordResetToken: token
            }, (err, affected, resp) => {
                console.log();
            });
            host = req.get('host');
            link = "http://" + host + "/reset?id=" + token;
            mailOptions = {
                from: '"Yelp Camp" <gaurav.thantry@gmail.com>',
                to: req.body.email,
                subject: "Password Reset",
                html: "Hello " + user.username + "<br> Please click on the following link to reset the password for your account. <br> <a href=" + link + ">Click here to reset</a>"
            }
            transport.sendMail(mailOptions, (err, res) => {
                if (err) {
                    return console.log(err);
                }
            });
            req.flash("success", "Please click on the reset link sent to your email account to reset the password");
            res.redirect("/login");
        }
    });
});

/*-----------------------------------------Password reset route-----------------------------------------------*/
router.get("/reset", (req, res) => {
    passwordResetToken = req.query.id;
    if (passwordResetToken) {
        res.render("reset");
    }
    else if (!isLoggedIn) {
        req.flash("error", "You do not have the permission to access this page");
        res.redirect("/login");
    }
    else if (isLoggedIn) {
        req.flash("error", "You do not have the permission to access this page");
        res.redirect("/");
    }
});

router.post("/reset", (req, res) => {
    User.findOne({ passwordResetToken: passwordResetToken }, (err, user) => {
        if (err) {
            req.flash("error", err);
            res.redirect("/login");
        }
        else {
            var hash = crypto.pbkdf2Sync(req.body.newpassword, user.saltValue, 1000, 64, `sha512`).toString(`hex`);
            if (user.password !== hash && user.passwordOne !== hash && user.passwordTwo !== hash && user.passwordThree !== hash) {
                if (user.passwordOne == null) {
                    user.passwordOne = user.password;
                }
                else if (user.passwordTwo == null) {
                    user.passwordTwo = user.passwordOne;
                    user.passwordOne = user.password;
                }
                else if ((user.passwordThree == null) || !(user.passwordOne == null && user.passwordTwo == null && user.passwordThree == null)) {
                    user.passwordThree = user.passwordTwo;
                    user.passwordTwo = user.passwordOne;
                    user.passwordOne = user.password;
                }
                user.password = hash;
                user.save();
                req.flash("success", "Password has been reset successfully. Please login again");
                res.redirect("/login");
            }
            else if (user.password == hash || user.passwordOne == hash || user.passwordTwo == hash || user.passwordThree == hash) {
                req.flash("error", "Please choose a password that is not the same as your previous 3 passwords");
                res.redirect("/reset?id=" + passwordResetToken);
            }

        }
    });
});


module.exports = router;
