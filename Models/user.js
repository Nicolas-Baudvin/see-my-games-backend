const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userShema = mongoose.Schema({
    "username": { "type": String, "required": true, "unique": true },
    "email": { "type": String, "required": true, "unique": true },
    "password": { "type": String, "required": true },
    "avatar": { "type": String, "required": false },
    "steam_id": { "type": String, "required": false },
    "steam_username": { "type": String, "required": false },
    "steam_profileurl": { "type": String, "required": false },
    "steam_avatar": { "type": String, "required": false },
    "steam_avatarmedium": { "type": String, "required": false },
    "steam_avatarfull": { "type": String, "required": false },
    "steam_realname": { "type": String, "required": false },
    "steam_timecreated": { "type": Number, "required": false },
    "imported_games": { "type": Boolean, "required": false }
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userShema);
