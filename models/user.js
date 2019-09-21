const passportLocalMongoose = require('passport-local-mongoose'),
    mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        unique: true, 
        required: true
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    password: {
        type: String,
        required: true
    },
    saltValue: String,
    //-------Previous password-------------//
    passwordOne: String,
    //-------2nd Previous password---------//
    passwordTwo: String,
    //-------3rd Previous password---------//
    passwordThree: String,
    //-------------------------------------//
    token: String,
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);