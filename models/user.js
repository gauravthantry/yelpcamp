const passportLocalMongoose = require('passport-local-mongoose'),
    mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        campgrounds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Campground"
            }
        ]
    }
)

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);