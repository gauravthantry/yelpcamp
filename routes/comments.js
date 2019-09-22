const express = require('express'),
      router = express.Router({ mergeParams: true }),
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleware = require("../middleware");

var indexRoute = require("./index");
//New comment form route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comment/new", { campground: campground, currentUser: indexRoute.currentUser });
        }
    });
});

//Add new comment to database
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                    res.redirect("campground/index");
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment added");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });

        }
    });
});

//EDIT form Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                }
                else {
                    res.render("comment/edit", { campground: foundCampground, comment: foundComment, currentUser: indexRoute.currentUser });
                }
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("success","Comment Edited");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err,deletedComment)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }
        else{
            req.flash("deleteSuccess","Comment successfully deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

module.exports = router;