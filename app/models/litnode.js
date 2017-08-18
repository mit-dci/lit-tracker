var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('litnode', new Schema({
    addr: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    }
}));