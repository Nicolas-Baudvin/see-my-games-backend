const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userShema = mongoose.Schema({
    username: {type: String, required: true, unique: true,},
    email: {type: String, required: true, unique: true,},
    password: {type: String, required: true,},
    steamid: {type: String, required: false,},
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);