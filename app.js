const expressSanitizer = require("express-sanitizer"),
      methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      flash = require('connect-flash'),
      User = require('./models/user'),
      mongoose = require('mongoose'),
      express = require('express'),
      seedDB = require('./seeds');
      

const campgroundRoute = require('./routes/campgrounds'),
      commentRoute = require('./routes/comments'),
      indexRoute = require('./routes/index');

app = express();

const databaseurl = process.env.DATABASEURL || "mongodb://localhost/yelpcampV11";
mongoose.connect(databaseurl, { useNewUrlParser: true });


app.use(express.static('public'));
app.use(express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.set("view engine", "ejs");

mongoose.set('useFindAndModify',false);

app.use(require('express-session')({
    secret: "may the odds be ever in your favour",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.deleteSuccess = req.flash("deleteSuccess");
    next();
});

seedDB();  //Seeds the DB
app.use(indexRoute);
app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comment",commentRoute);


app.listen(process.env.PORT || 3000);