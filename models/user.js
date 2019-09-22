const mongoose = require('mongoose'),
    crypto = require('crypto');

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
    campgrounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campground"
        }
    ],
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

userSchema.methods.validPassword = function (user, password) {
    var salt = user.saltValue;
    var hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    if (this.password === hash) {
        console.log("validated");
        return true;
    }
    console.log("Not validated");
    return false;
};


module.exports = mongoose.model("User", userSchema);