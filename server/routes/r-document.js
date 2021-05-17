var express = require('express');
const confirmToken = require('../middlewares/confirmToken')
var router = express.Router();
const db = require('../db/db.js')

router.get('/api/document/all', (req, res) => {
    res.status(200).send(
        [
            {
                id: 1,
                name: 'freeculture',
                type: 'pdf',
                desc: 'freeculture any one',
                src: 'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/freeculture.pdf',
            },
            {
                id: 2,
                name: 'relativity.protected',
                type: 'pdf',
                desc: 'test password of pdf, relativity protected',
                src: 'https://cdn.rawgit.com/sayanee/angularjs-pdf/68066e85/example/pdf/relativity.protected.pdf',
            },
            {
                id: 3,
                name: 'NCOworkFlow',
                type: 'pdf',
                desc: 'NCO work Flow',
                src: 'https://xlonglong.xyz/files/NCOworkFlow.pdf',
            },
        ]
    )
})

module.exports = router;