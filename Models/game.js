const mongoose = require('mongoose');

const gameShema = mongoose.Schema({
    name: { type: String, required: true },
    header_img: { type: String, required: false },
    playtime_forever: { type: Number, required: false },
    ownerId: { type: String, required: false },
    appid: { type: Number, required: false },
    desc: { type: String, required: false },
    release_date: { type: String, required: false },
});

module.exports = mongoose.model('Game', gameShema);