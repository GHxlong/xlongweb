const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Sequence = require('./sequence')

const FilesSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        name: String,
        type: String,
        desc: String,
        uploadDate: Date,
        createdBy: Number,
        isShare: Boolean,
        src: String,
        tags: [String]
    },
    { versionKey: false }
)
FilesSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('Files', function (err, result) {
            if (err) { throw err }
            self.id = result.value.next
            next()
        })
    } else {
        next()
    }
})

module.exports = FilesSchema