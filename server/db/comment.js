const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Sequence = require('./sequence')

const CommentSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        imgName: String,
        allowNotification: Boolean,
        author: String,
        authorUrl: String,
        content: String,
        email: String,
        parentId: Number,
        postId: Number,
        createTime: Date,
        status: String, // // Enum: "AUDITING" "PUBLISHED" "RECYCLE"
        like: Number
    },
    { versionKey: false }
)

CommentSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('Comment', function (err, result) {
            if (err) { throw err }
            self.id = result.value.next
            next()
        })
    } else {
        next()
    }
})

module.exports = CommentSchema