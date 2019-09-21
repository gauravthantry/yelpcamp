const express = require('express'),
      router = express.Router({mergeParam: true}),
      passport = require('passport'),
      User = require("../models/user"),
      nodemailer = require('nodemailer'),
      smtpTransport = require('nodemailer-smtp-transport'),
      crypto = require('crypto');
var randomstring = require('randomstring');
var isLoggedIn = false,
    currentUser = null;

  router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register",(req,res)=>{
    res.render("register");
 });
 
 router.post("/register",(req,res)=>{
     const newUser = new User({username: req.body.username, email: req.body.email})
     console.log(req.body);
   User.register(newUser, req.body.password, (err, user)=>{
      if(err)
      {
          req.flash("error",err.message);
          res.redirect("/register");
      }
      passport.authenticate("local")(req,res,()=>{
          res.redirect("/campgrounds");
      });
   });
 });
 
 router.get("/login",(req,res)=>{
     res.render("login");
 });
 
 router.post("/login",passport.authenticate("local",{
     successRedirect: "/campgrounds",
     failureRedirect: "/login"
 }),(req,res)=>{
 });
 
 router.get("/logout",(req,res)=>{
     //const successMessage = "<div class=\"container\"><div class=\"alert alert-success\" role=\"alert\"></div></div>";
     req.logout();
     req.flash("success","You have successfully Logged Out");
     res.redirect("/login");
 });
 
 function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
       return next();
   }
   req.flash("error","You must be logged in to do that");
   res.redirect("/login");
 }

 module.exports = router;