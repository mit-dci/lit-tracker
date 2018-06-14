var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('litnode', new Schema({
    addr: {
        type: String,
        required: true,
        unique: true
    },
    ipv4: {
        type: String,
        required: true
    },
    ipv6: {
        type: String
    }
}));
