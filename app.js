const passportLocalMangoose = require('passport-local-mongoose'),
      methodOverride = require('method-override'),
      LocalStrategy = require('passport-local'),
      bodyParser = require('body-parser'),
      flash = require('connect-flash'),
      User = require('./models/user'),
      mongoose = require('mongoose'),
      passport = require('passport'),
      express = require('express'),
      seedDB = require('./seeds');
      

const campgroundRoute = require('./routes/campgrounds'),
      commentRoute = require('./routes/comments'),
      indexRoute = require('./routes/index');

app = express();

const databaseurl = process.env.DATABASEURL || "mongodb://localhost/yelpcampV11";
//mongoose.connect("mongodb://localhost/yelpcampV11", { useNewUrlParser: true });
mongoose.connect(databaseurl, { useNewUrlParser: true });


app.use(express.static('public'));
app.use(express.static('images'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");

mongoose.set('useFindAndModify',false);

app.use(require('express-session')({
    secret: "may the odds be ever in your favour",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.deleteSuccess = req.flash("deleteSuccess");
    next();
});

//seedDB();  //Seeds the DB

app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id/comment",commentRoute);
app.use(indexRoute);

app.listen(process.env.PORT, process.env.IP);