const mongoose = require("mongoose");

const shortURLSchema =  new mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        unique: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    isSafe: {
        type: Boolean,
        required: true,
        default: true,
    },
})

module.exports = mongoose.model('urlDatabase', shortURLSchema);