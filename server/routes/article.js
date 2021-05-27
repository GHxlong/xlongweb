const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

// 创建文章
router.post('/api/content/create', (req, res) => {
    const article = {
        "title": req.body.title,
        "categories": req.body.categories || [],
        "originalContent": req.body.content,
        "commentCount": 0,
        "createTime": new Date(),
        "disallowComment": false,
        "editTime": new Date(),
        "editorType": "MARKDOWN",
        "fullPath": "",
        "likes": 0,
        "metaDescription": "metaDescription",
        "metaKeywords": "metaKeywords",
        "password": "password",
        "slug": "slug",
        "status": req.body.status || "PUBLISHED",
        "summary": "summary",
        "tags": req.body.tags,
        "template": "",
        "thumbnail": "",
        "topPriority": 1,
        "topped": true,
        "updateTime": new Date(),
        "visits": 1
    }
    new db.Article(article).save()
    res.status(200).send('succeed in saving new passage.')
})

router.delete('/api/content/:id', confirmToken, (req, res) => {
    db.Article.remove({ id: req.params.id }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            db.Comment.deleteMany({ postId: req.params.id }, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.status(200).send('succeed in deleting ---' + data)
                }
            })
        }
    })

})

// 更新文章
router.patch('/api/content/:id', confirmToken, (req, res) => {
    const id = req.params.id
    const article = {
        title: req.body.title,
        tags: req.body.tags,
        editTime: Date(),
        updateTime: Date(),
        originalContent: req.body.content,
        status: "PUBLISHED"
    }
    db.Article.updateMany({ id: id }, article, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send('succeed in updating ---' + data.title)
        }
    })
})

/**
page	integer <int32>
size	integer <int32>
sort	Array of strings
 */
router.get('/api/content/posts', (req, res) => {
    // page, size, sort
    let status = ''
    let page = 1
    let limit = 100
    let skip = 0
    if (req.query.payload) {
        page = req.query.payload.page
        limit = req.query.payload.limit - 0 || 4
        status = req.query.payload.status || "PUBLISHED"
    } else {
        page = req.query.page < 1 ? 1 : req.query.page
        limit = req.query.size - 0 || 4
        status = req.query.status || "PUBLISHED"
    }
    skip = limit * (page - 1)

    db.Article.find({ status: status }).sort({ createTime: -1 }).limit(limit).skip(skip).exec()
        .then((articles) => {
            let size = articles.length > 0 ? articles.length : 0
            let pages = parseInt(size / limit) + 1
            res.send({
                data: {
                    content: articles,
                    hasContent: size > 0,
                    hasNext: page < pages,
                    hasPrevious: page != 1,
                    isEmpty: false,
                    isFirst: page == 1,
                    page: page,
                    pages: pages,
                    rpp: 1,
                    total: size
                }
            })
        })
})

router.get('/api/content/posts/:id', (req, res) => {
    db.Article.findOne({ id: req.params.id }, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send({
                data: doc
            })
        }
    })
})

router.get('/api/content/posts_search', (req, res) => {
    // page, size, sort
    let status = ''
    let page = 1
    let limit = 100
    let skip = 0
    let key = null
    let value = null
    if (req.query.payload) {
        page = req.query.payload.page
        limit = req.query.payload.limit - 0 || 4
        status = req.query.payload.status || "PUBLISHED"
        key = req.query.payload.key
        value = req.query.payload.value
    } else {
        page = req.query.page < 1 ? 1 : req.query.page
        limit = req.query.size - 0 || 4
        status = req.query.status || "PUBLISHED"
        key = req.query.key
        value = req.query.value
    }
    skip = limit * (page - 1)
    const re = new RegExp(value, 'i')
    if (key === 'tags') {                                       // 根据标签来搜索文章
        const arr = value.split(' ')
        db.Article.find({ tags: { $all: arr } })
            .sort({ createTime: -1 }).limit(4).skip(skip).exec()
            .then((articles) => {
                res.send({
                    data: {
                        content: articles
                    }
                })
            })
    } else if (key === 'title') {                               // 根据标题的部分内容来搜索文章
        db.Article.find({ title: re })
            .sort({ createTime: -1 }).limit(4).skip(skip).exec()
            .then((articles) => {
                res.send({
                    data: {
                        content: articles
                    }
                })
            })
    } else if (key === 'date') {                                // 根据日期来搜索文章
        const nextDay = value + 'T24:00:00'
        db.Article.find({ createTime: { $gte: new Date(value), $lt: new Date(nextDay) } })
            .sort({ createTime: -1 }).limit(4).skip(skip).exec()
            .then((articles) => {
                res.send({
                    data: {
                        content: articles
                    }
                })
            })
    } else if (key === 'categories') {                                       // 根据标签来搜索文章
        const arr = value.split(' ')
        db.Article.find({ categories: { $all: arr } })
            .sort({ createTime: -1 }).limit(4).skip(skip).exec()
            .then((articles) => {
                res.send({
                    data: {
                        content: articles
                    }
                })
            })
    }
})

router.get('/api/content/links', (req, res) => {
    const id = req.params.id
    res.status(200).send({
        data: [
            {
                description: "",
                id: 11,
                logo: "",
                name: "welcome welcome welcome !!!",
                priority: 1,
                team: "team",
                url: ""
            }
        ]
    })
})

/**
keyword
page	
size 
sort:
type: "INTIMATE" "PUBLIC"
*/
router.get('/api/content/journals', (req, res) => {
    let keyword = req.query.keyword
    let page = parseInt(req.query.page || 1)
    let size = parseInt(req.query.size || 100)
    let sort = req.query.sort || "createTime"
    let type = req.query.type || "PUBLIC"
    let skip = size * (page - 1)
    db.Journal.find({ type: type, }).sort({ createTime: -1 }).limit(size).skip(skip).exec()
        .then((journals) => {
            let journalsSize = journals.length > 0 ? journals.length : 0
            let pages = parseInt(journalsSize / size) + 1
            res.send({
                data: {
                    content: journals,
                    hasContent: journalsSize > 0,
                    hasNext: page < pages,
                    hasPrevious: page != 1,
                    isEmpty: false,
                    isFirst: page == 1,
                    page: page,
                    pages: pages,
                    rpp: 1,
                    total: journalsSize
                }
            })
        })
})

router.post('/api/content/journals', (req, res) => {
    let j = {
        title: req.body.title,
        sourceContent: req.body.title,
        commentCount: 0,
        createTime: new Date(),
        content: req.body.title,
        likes: 0,
        type: "PUBLIC"
    }
    db.Journal(j).save()
    res.send({
        data: j
    })
})

// likes
router.put('/api/content/posts/{postId}/likes', (req, res) => {
    const id = req.params.id
    db.Article.updateOne({ id: id }, { $inc: { likes: 1 } }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send('succeed in updating like')
        }
    })
})
module.exports = router
