const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: '163',
    auth: {
        user: '18392628011@163.com',
        pass: '111030128'
    }
})

exports.send = function (to, subject, html, res) {
    const mailOptions = {
        from: '"博客小管家" <18392628011@163.com>',
        to: to,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            res.status(504).end('通知邮件发送失败')
        } else {
            console.log('Message sent: ' + info.response)
            res.status(200).send('send email successfully')
        }
    })
}
