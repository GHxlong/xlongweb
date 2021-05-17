const express = require('express')
const router = express.Router()
const db = require('../db/db.js')
const confirmToken = require('../middlewares/confirmToken')
const rand = require('csprng')
const sha1 = require('sha1')

// 修改账户
router.post('/api/user', confirmToken, (req, res) => {
    const salt = rand(160, 36)
    const user = {
        salt: salt,
        name: req.body.name,
        password: sha1(req.body.password + salt)
    }
    db.User.update({_id: req.body.id}, user, (err) => {
        if (err) {
            console.log(err)
        } else {
            res.status(200).send('update successfully')
        }
    })
})

router.post('/api/singup', confirmToken, (req, res) => {
    db.User.findOne({name: req.body.name}, (err, doc) => {
        if (doc) return;
        const salt = rand(160, 36)
        const user = {
            salt: salt,
            name: req.body.name,
            password: sha1(req.body.password + salt)
        }
        db.User.insertMany({_id: req.body.id}, user, (err) => {
            if (err) {
                console.log(err)
            } else {
                res.status(200).send('singup successfully')
            }
        })
    })
})

router.post('/api/admin/login', (req, res) => {
    res.status(200).send('singup successfully')
})

router.get('/api/content/posts', (req, res) => {
    res.status(200).send({
        content: ''
    })
})

module.exports = router
