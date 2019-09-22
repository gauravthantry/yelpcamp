const Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      middleWareObj = {};

var indexRoute = require("../routes/index");

middleWareObj.checkCampgroundOwnership = (req,res,next)=>{
    if( indexRoute.currentUser!=null){
        Campground.findById(req.params.id,(err,foundCampground)=>{
            if(err){
                console.log(err);
            }
            else{
                if(foundCampground.author.id.equals(indexRoute.currentUser._id)){
                    next();
                }
                else{
                    res.redirect("back");
                }
            }
        });
    }
    else{
        res.redirect("back");
    }
}

middleWareObj.checkCommentOwnership = (req,res,next) =>{
    if (indexRoute.currentUser!=null) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
            }
            else {
                if (foundComment.author.id.equals(indexRoute.currentUser._id)) {
                    next();
                }
                else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
}

    middleWareObj.isLoggedIn = (req,res,next) =>{
    //const errorMessage = "<div class=\"container\"><div class=\"alert alert-danger\" role=\"alert\">Please login first</div></div>"
    if (indexRoute.currentUser!=null) {
        return next();
    }
    req.flash("error","Please login first");
    res.redirect("/login");
}

module.exports = middleWareObj;

