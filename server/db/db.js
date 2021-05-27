const mongoose = require('mongoose')
const data = require('./data')
const sha1 = require('sha1')
const rand = require('csprng')

var CommentSchema = require('./comment')
var UserSchema = require('./user')
var ArticleSchema = require('./article')
var FilesSchema = require('./doucment')
var LeaveMsgSchema = require('./contact-me')
var JournalSchema = require('./journals')

const Models = {
    User: mongoose.model('User', UserSchema),
    Article: mongoose.model('Article', ArticleSchema),
    Comment: mongoose.model('Comment', CommentSchema),
    LeaveMessage: mongoose.model('LeaveMessage', LeaveMsgSchema),
    Files: mongoose.model('Files', FilesSchema),
    Journal: mongoose.model('Journal', JournalSchema)
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
