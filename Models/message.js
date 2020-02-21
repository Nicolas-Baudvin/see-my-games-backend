const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    "message": { "type": String, "isRequired": true },
    "user": { "type": String, "isRequired": true },
    "time": { "type": String, "isRequired": true },
    "avatar": { "type": String, "isRequired": false },
    "chan": { "type": String, "isRequired": true },
    "socketId": { "type": String, "isRequired": true },
    "isPrivate": { "type": Boolean, "isRequired": true },
    "to": { "type": String, "isRequired": false },
    "toUsername": { "type": String, "isRequired": false }
});

module.exports = mongoose.model("message", messageSchema);
