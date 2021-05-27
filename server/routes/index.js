const article = require('./article.js')
const tag = require('./tag.js')
const comment = require('./comment')
const login = require('./login')
const user = require('./user')
const email = require('./r-email')
const document = require('./r-document')

module.exports = (app) => {
    app.use(article)
    app.use(tag)
    app.use(comment)
    app.use(login)
    app.use(user)
    app.use(email)
    app.use(document)
}