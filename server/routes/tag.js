const express = require('express')
const router = express.Router()
const db = require('../db/db.js')

router.get('/api/content/tags', (req, res) => {
    db.Article.find({ "status": "PUBLISHED" }).distinct('tags', (err, doc) => {
        if (err) {
            console.log(err)
        } else if (doc) {
            res.send(doc)
        }
    })
})

module.exports = router
