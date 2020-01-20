const mongoose = require('mongoose');

const gameShema = mongoose.Schema({
    name: { type: String, required: true },
    release_date: { type: String, required: true },
    imageURI: { type: String, required: true },
    desc: { type: String, required: true },
    ownerId: { type: Number, required: true },
});

module.exports = mongoose.model('Game', gameShema);