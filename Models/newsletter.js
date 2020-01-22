const mongoose = require( "mongoose" );

const uniqueValidator = require( "mongoose-unique-validator" );

const emailShema = mongoose.Schema( {
    "email": { "type": String, "required": true, "unique": true }
} );

emailShema.plugin( uniqueValidator );

module.exports = mongoose.model( "email_newsletters", emailShema );
