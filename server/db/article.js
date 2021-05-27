const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Sequence = require('./sequence')

const ArticleSchema = new Schema(
    {
        id: { type: Number, index: { unique: true } },
        title: String,
        categories: [String],
        originalContent: String,
        commentCount: Number,
        createTime: Date,
        disallowComment: Boolean,
        editTime: Date,
        editorType: String, // "MARKDOWN", "RICHTEXT"
        fullPath: String,
        likes: Number,
        metaDescription: String,
        metaKeywords: String,
        metas: {},
        password: String,
        slug: String,
        status: String, //"DRAFT" "INTIMATE" "PUBLISHED" "RECYCLE"
        summary: String,
        tags: [String],
        template: String,
        thumbnail: String,
        topPriority: Number,
        topped: Boolean,
        updateTime: Date,
        visits: Number,
        wordCount: Number
    },
    { versionKey: false }
)

// 生成从0开始自增长的文章aid
ArticleSchema.pre('save', function (next) {
    var self = this
    if (self.isNew) {
        Sequence.increment('Article', function (err, result) {
            if (err) { throw err }
            self.id = result.value.next
            next()
        })
    } else {
        next()
    }
})


module.exports = ArticleSchema