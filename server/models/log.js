var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var LogSchema = new Schema({
    date: { type: Date, default: Date.now },
    requestIP: { type: String, default: null },
    userQuestion: String,
    matchedQuestion: { type: String, default: null },
    questionID: { type: Number, default: null },
    accuracy: { type: Number, default: null }
})

module.exports = mongoose.model('Log', LogSchema)