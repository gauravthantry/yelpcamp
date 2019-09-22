const express = require('express'),
    router = express.Router({ mergeParams: true }),
    Campground = require("../models/campground"),
    middleware = require("../middleware"),
    User = require("../models/user");
var indexRoute = require("./index");

//routing for campground


//Displays all campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/index", { campgrounds: allCampgrounds,currentUser: indexRoute.currentUser });
        }
    });
});

//form for creating new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campground/new",{currentUser: indexRoute.currentUser});
});

//List campgrounds based on search
router.get("/search", (req, res) => {
    const searchString = req.query.searchKey;
    Campground.find({ name: { "$regex": searchString, "$options": "i" } }, (err, campgrounds) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/index", { campgrounds: campgrounds, currentUser: indexRoute.currentUser });
        }
    });
});

//Creates the new campground
router.post("/", middleware.isLoggedIn, (req, res) => {

    const name = req.body.name,
        price = req.body.price,
        image = req.body.image,
        description = req.body.description;
    const author = {
        id: indexRoute.currentUser._id,
        username: indexRoute.currentUser.username
    };

    const newCampground = {
        name: name,
        price: price,
        image: image,
        description: description,
        author: author
    };

    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log("Error: Couldn't create the dynamically created campground");
            console.log(err);
        }
        else {
            User.findById(indexRoute.currentUser._id, (err, foundUser) => {
                if (err) {
                    console.log(err);
                }
                else {
                    foundUser.campgrounds.push(campground);
                    foundUser.save();
                    req.flash("success", "Campground posted successfully");
                    res.redirect("/campgrounds");
                }
            });
        }
    }
    )
});

//Displays information of a particular campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, found) => {
        if (err) {
            console.log(err);
        }
        else {
            found.description = req.sanitize(found.description);
            res.render("campground/show", { campground: found, currentUser: indexRoute.currentUser });
        }
    });
});

//Displays form for editting the campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/edit", { campground: foundCampground, currentUser: indexRoute.currentUser });
        }
    });
});

//UPDATE the campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//Delete campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, deletedCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            req.flash("deleteSuccess", "Campground Deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;