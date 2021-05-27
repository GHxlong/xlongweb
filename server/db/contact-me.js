const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require('./data')
const sha1 = require('sha1')
const rand = require('csprng')
const Sequence = require('./sequence')

const LeaveMsgSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        subject: String,
        content: String,
        date: Date,
        paper: String
    },
    { versionKey: false }
)
LeaveMsgSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('LeaveMssage', function (err, result) {
            if (err) { throw err }
            self.id = result.value.next
            next()
        })
    } else {
        next()
    }
})


module.exports = LeaveMsgSchema