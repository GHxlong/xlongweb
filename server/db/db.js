const mongoose = require('mongoose')
const Schema = mongoose.Schema
const data = require('./data')
const sha1 = require('sha1')
const rand = require('csprng')
const Sequence = require('./sequence')

const UserSchema = new Schema(
    {
        name: String,
        password: String,
        salt: String            // 使用csprng随机生成的盐
    },
    { versionKey: false }
)

const ArticleSchema = new Schema(
    {
        aid: { type: Number, index: { unique: true } },
        title: String,
        content: String,
        tags: [String],
        date: Date,
        isPublish: Boolean,
        comment_n: Number
    },
    { versionKey: false }
)
const CommentSchema = new Schema(
    {
        imgName: String,
        name: String,
        address: String,
        content: String,
        articleId: Number,
        date: Date,
        like: Number
    },
    { versionKey: false }
)

// 生成从0开始自增长的文章aid
ArticleSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('Article', function (err, result) {
            if (err) { throw err }
            self.aid = result.value.next
            next()
        })
    } else {
        next()
    }
})

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

const FilesSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        name: String,
        type: String,
        desc: String,
        uploadDate: Date,
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
const Models = {
    User: mongoose.model('User', UserSchema),
    Article: mongoose.model('Article', ArticleSchema),
    Comment: mongoose.model('Comment', CommentSchema),
    LeaveMessage: mongoose.model('LeaveMessage', LeaveMsgSchema),
    Files: mongoose.model('Files', FilesSchema)
}

// 初始化数据
const initialize = () => {
    console.log('beginning to initialize data...')
    Models.User.find({}, (err, doc) => {
        if (err) {
            console.log(err)
            console.log('initialize failed')
        } else if (!doc.length) {
            const salt = rand(160, 36)
            // 第一次创建站长账户
            new Models['User']({ name: 'boss', password: sha1('123456' + salt), salt: salt }).save()
            Promise.all(data.map((item) => { new Models['Article'](item).save() }))
                .then(() => { console.log('initialize successfully') })
                .catch(() => { console.log('initialize failed') })
        } else {
            console.log('initialize successfully')
        }
    })
}

const db = mongoose.connection;
const dbAddress = 'mongodb://39.103.187.204/lenote-users';
mongoose.Promise = global.Promise
function connect () {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    mongoose.set('useCreateIndex', true)
    mongoose.connect(dbAddress, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    db.once('open', () => {
        console.log('mongodb connect successly')
        initialize()
    });
    db.on('error', err => {
        console.log(err);
    });
}

connect()

module.exports = Models
