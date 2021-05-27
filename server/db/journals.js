const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Sequence = require('./sequence')


const JournalSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        title: String,
        sourceContent: String,
        commentCount: Number,
        createTime: Date,
        content: String,
        likes: Number,
        type: String         // "INTIMATE" "PUBLIC"
    },
    { versionKey: false }
)

// 生成从0开始自增长的文章aid
JournalSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('Journal', function (err, result) {
            if (err) { throw err }
            self.id = result.value.next
            next()
        })
    } else {
        next()
    }
})


module.exports = JournalSchema