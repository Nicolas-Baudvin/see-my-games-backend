const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const postShema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    header_img: { type: String, required: true },
    desc: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    author_id: { type: String, required: true },
    short_desc: { type: String, required: true },
    category: { type: String, required: true },
});

module.exports = mongoose.model('Post', postShema);