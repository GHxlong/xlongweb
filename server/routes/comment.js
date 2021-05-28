const express = require('express')
const router = express.Router()
const mail = require('../controller/email')
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')

const emailForm = (title, name, otherName, message, content, url) => {
    let string = `<div style="width: 90%; border: 2px solid lightgreen; margin: 1rem auto; padding: 1rem; text-align: center;">
        <p style="border-bottom: 1px dashed lightgreen; margin: 0;padding-bottom: 1rem; color: lightgreen; font-size: 1.25rem;">${title}</p>
        <p style="margin: 1rem 0 0;">hello,${name} &#x1f608</p>
        <p style="margin: 0 0 1rem;">${otherName}${message}</p>
        <p style="width: 70%; border-left: 4px solid lightgreen; padding: 1rem; margin: 0 auto 2rem; text-align: left;white-space: pre-line;">${content}</p>
    <a href= ${url} style="text-decoration: none; background: lightgreen;color: #fff; height: 2rem; line-height: 2rem; padding: 0 1rem; display: inline-block; border-radius: 0.2rem;">前往查看</a>
        </div>
    `
    return string
}

/**
allowNotification: true,
author: "Xlong",
authorUrl: "/authorUrl/Xlong/",
avatar: "/authorUrl/Xlong/",
content: "test comments content",
createTime: new Date(),
email: "Xlong email",
gravatarMd5: "test gravatarMd5",
id: 1,
ipAddress: "1.1.1.1",
isAdmin: true,
parent: {},
parentId: 123,
status: "RECYCLE", // "AUDITING" "PUBLISHED" "RECYCLE"
userAgent: "andriod",
imgName: "reviewer",
like: 0
*/
function SendComment (comments, res) {
    let size = comments.length
    res.status(200).send({
        data: {
            content: comments,
            hasContent: true,
            hasNext: true,
            hasPrevious: true,
            isEmpty: false,
            isFirst: false,
            page: 1,
            pages: 2,
            rpp: 1,
            total: size
        }
    })
}

// 更新评论的点赞数
router.patch('/api/content/comments/:id', (req, res) => {
    const id = req.params.id
    if (req.body.option === 'add') {
        db.Comment.updateOne({ _id: id }, { $inc: { like: 1 } }, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send('succeed in updating like')
            }
        })
    } else if (req.body.option === 'drop') {
        db.Comment.updateOne({ _id: id }, { $inc: { like: -1 } }, (err, data) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send('succeed in updating like')
            }
        })
    }
})

router.get('/api/content/options/keys/comment_api_enabled', (req, res) => {
    res.status(200).send({
        data: true
    })
})

// add Commont, not admin 
router.post('/api/content/posts/comments', (req, res) => {
    let comment = {
        imgName: req.body.imgName,
        allowNotification: true,
        author: req.body.author,
        authorUrl: "",
        content: req.body.content,
        email: req.body.email,
        parentId: 0,
        postId: req.body.postId,
        createTime: new Date(),
        status: "AUDITING",
        like: 0
    }
    if (/^@(.*):/.test(req.body.content)) {
        const reviewer = /^@(.*):/.exec(req.body.content)[1]                // 评论者的名字
        db.Comment.findOne({ author: reviewer, postId: req.body.postId }, (err, doc) => {
            const url = 'https://www.xxx.cn' + req.body.curPath
            const replyEmail = doc.email
            const content = emailForm('欢迎常来我的博客', reviewer, req.body.author, '回复了你的评论', req.body.content, url)
            // mail.send(replyEmail, '您在FatDong的博客有一条新评论', content, res)
        })
    }
    db.Comment(comment).save().then(() => {
        const url = 'https://www.xxx.cn' + req.body.curPath
        const content = emailForm('MyBlog Message', '站长', req.body.author, '评论了你的文章', req.body.content, url)
        // mail.send('xxx@qq.com', '您的博客有一条新评论', content, res)
        // res.status(200).send('send email successfully')
        db.Article.updateMany({ id: req.body.postId },
            { $inc: { commentCount: 1 } }, (err, data) => {
                if (err) {
                    console.log(err)
                }
            }
        )
        res.status(200).send({
            data: {
                comment
            }
        })
    }).catch(err => { 
        console.log(err) 
        res.status(200).send({
            data: {
                code: 10001,
                err
            }
        })
    })
})

// adming replay
// /api/admin/posts/comments
router.post('/api/admin/posts/comments', (req, res) => {
    let comment = {
        imgName: req.body.imgName,
        allowNotification: true,
        author: req.body.author,
        authorUrl: "",
        content: req.body.content,
        email: req.body.email,
        parentId: req.body.id,
        postId: req.body.postId,
        createTime: new Date(),
        status: "AUDITING",
        like: 0
    }
    let repalys = /^@(.*):/.exec(req.body.content)
    const reviewer = repalys[1]  ? repalys[1] : ""
    db.Comment.findOne({ author: reviewer, postId: req.body.postId,  }, (err, doc) => {
        const url = 'https://www.xxx.cn' + req.body.curPath
        const replyEmail = doc.email
        const content = emailForm('欢迎常来我的博客', reviewer, req.body.author, '回复了你的评论', req.body.content, url)
        // mail.send(replyEmail, '您在FatDong的博客有一条新评论', content, res)
    })

    db.Comment(comment).save()
    res.status(200).send({
        data: {
            comment
        }
    })
})

// add Commont         
router.post('/api/admin/content/posts/comments', (req, res) => {
    let comment = {
        imgName: req.body.imgName,
        allowNotification: true,
        author: req.body.author,
        authorUrl: "",
        content: req.body.content,
        email: req.body.email,
        parentId: 0,
        postId: req.body.postId,
        createTime: new Date(),
        status: "AUDITING",
        like: 0
    }
    if (/^@(.*):/.test(req.body.content)) {
        const reviewer = /^@(.*):/.exec(req.body.content)[1]                // 评论者的名字
        db.Comment.findOne({ author: reviewer, postId: req.body.postId }, (err, doc) => {
            const url = 'https://www.xxx.cn' + req.body.curPath
            const replyEmail = doc.email
            const content = emailForm('欢迎常来我的博客', reviewer, req.body.author, '回复了你的评论', req.body.content, url)
            // mail.send(replyEmail, '您在FatDong的博客有一条新评论', content, res)
        })
    }
    db.Comment(comment).save().then(() => {
        const url = 'https://www.xxx.cn' + req.body.curPath
        const content = emailForm('MyBlog Message', '站长', req.body.author, '评论了你的文章', req.body.content, url)
        // mail.send('xxx@qq.com', '您的博客有一条新评论', content, res)
        // res.status(200).send('send email successfully')
        db.Article.updateMany({ id: req.body.postId },
            { $inc: { commentCount: 1 } }, (err, data) => {
                if (err) {
                    console.log(err)
                }
            }
        )
        res.status(200).send({
            data: {
                comment
            }
        })
    }).catch(err => { 
        console.log(err) 
        res.status(200).send({
            data: {
                code: 10001,
                err
            }
        })
    })
})

const returnCommentCols = "author authorUrl email avatar content createTime id isAdmin status imgName like postId"

/**
top	
integer <int32>
top
status	
string
Enum: "AUDITING" "PUBLISHED" "RECYCLE"
status
*/
// get Commont list, admin
router.get('/api/admin/posts/comments/latest', (req, res) => {
    let top = req.query.top ? parseInt(req.query.top) : 10 
    db.Comment.find({}, returnCommentCols).sort({ createTime: -1 }).limit(top).exec()
    .then((comments) => {
        comments.forEach(comment => {
            let id = comment.postId;
            db.Article.findOne({id: id}, (err, doc) => {
                if (err) {
                    console.log(err)
                } else {
                    comment.post = doc
                }
            })
        });
        res.status(200).send({
            data: comments
        })
    })
})
router.get('/api/content/posts/:id/comments/list_view', (req, res) => {
    let articleId = null
    let sortKey = null
    if (req.query.payload) {
        articleId = req.query.payload.id
        sortKey = req.query.payload.sort
    } else {
        articleId = req.params.id
        sortKey = req.query.sort
    }
    if (!articleId || articleId === undefined) {
        articleId = null
    }
    if (sortKey === 'date') {
        db.Comment.find({ postId: articleId }, returnCommentCols).sort({ createTime: -1 }).exec()
            .then((comments) => {
                SendComment(comments, res)
            })
    } else if (sortKey === 'like') {
        db.Comment.find({ postId: articleId }, returnCommentCols).sort({ like: -1 }).exec()
            .then((comments) => {
                SendComment(comments, res)
            })
    } else {
        db.Comment.find({ postId: articleId }, returnCommentCols).exec().then((comments) => {
            let size = comments.length
            res.status(200).send({
                data: {
                    content: comments,
                    hasContent: true,
                    hasNext: true,
                    hasPrevious: true,
                    isEmpty: false,
                    isFirst: false,
                    page: 1,
                    pages: 2,
                    rpp: 1,
                    total: size
                }
            })
        })
    }
})

router.get('/api/admin/posts/comments/{postId}/tree_view', (req, res) => {
    let articleId = null
    let sortKey = null
    if (req.query.payload) {
        articleId = req.query.payload.id
        sortKey = req.query.payload.sort
    } else {
        articleId = req.params.id
        sortKey = req.query.sort
    }
    if (!articleId || articleId === undefined) {
        articleId = null
    }
    if (sortKey === 'date') {
        db.Comment.find({ postId: articleId }, returnCommentCols).sort({ createTime: -1 }).exec()
            .then((comments) => {
                SendComment(comments, res)
            })
    } else if (sortKey === 'like') {
        db.Comment.find({ postId: articleId }, returnCommentCols).sort({ like: -1 }).exec()
            .then((comments) => {
                SendComment(comments, res)
            })
    } else {
        db.Comment.find({ postId: articleId }, returnCommentCols).exec().then((comments) => {
            let size = comments.length
            res.status(200).send({
                data: {
                    content: comments,
                    hasContent: true,
                    hasNext: true,
                    hasPrevious: true,
                    isEmpty: false,
                    isFirst: false,
                    page: 1,
                    pages: 2,
                    rpp: 1,
                    total: size
                }
            })
        })
    }
})

module.exports = router
