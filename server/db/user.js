const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Sequence = require('./sequence')

const UserSchema = new Schema(
    {
        uid: Number,
        name: String,
        password: String,
        salt: String            // 使用csprng随机生成的盐
    },
    { versionKey: false }
)

// 生成从0开始自增长的文章aid
UserSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('User', function (err, result) {
            if (err) { throw err }
            self.uid = result.value.next
            next()
        })
    } else {
        next()
    }
})

module.exports = UserSchema