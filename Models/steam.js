const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
    id: {type: String, required: true, unique: true,},
    name: {type: String, required: true},
    avatar: {type: String, required: true},
    steamid: {type: String, required: true},
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('SteamUser', userShema);