var express = require('express');
const confirmToken = require('../middlewares/confirmToken')
var router = express.Router();
const db = require('../db/db.js')
const doucmentPath = require('../config').doucmentPath

var multiparty = require('multiparty');
var path = require('path');
var fs = require("fs");
const DateUtil = require('../util/index')


router.get('/api/document/all', (req, res) => {
    // page, size, sort
    let page = 1
    let size = 100
    let skip = 0
    if (req.query.payload) {
        page = parseInt(req.query.payload.page || 1)
        size = parseInt(req.query.payload.size || 100)
    } else {
        page = parseInt(req.query.page || 1)
        size = parseInt(req.query.size || 100)
    }
    skip = size * (page - 1)
    db.Files.find({}).sort({ uploadDate: -1 }).limit(size).skip(skip).exec()
        .then((files) => {
            let filesLen = files.length
            let pages = parseInt(filesLen / size) + 1
            res.status(200).send({
                data: {
                    list: files,
                    hasContent: filesLen > 0,
                    hasNext: page < pages,
                    hasPrevious: page != 1,
                    isEmpty: false,
                    isFirst: page == 1,
                    page: page,
                    pages: pages,
                    rpp: 1,
                    total: filesLen
                }
            })
        })
})

router.post('/api/document/upload', confirmToken, (req, res) => {
    // 解析一个文件上传
    var form = new multiparty.Form();
    //设置文件存储路径
    form.uploadDir = path.join(doucmentPath, 'pdf');
    if (!fs.existsSync(form.uploadDir)) {
        fs.mkdirSync(form.uploadDir);
    }
    let uploadHost = 'https://xlonglong.xyz/pdf'
    //设置单文件大小限制
    //form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和
    let message = "add succesfull!";
    try {
        form.parse(req, function (err, fields, files) {
            console.log(fields)
            let fileList = files.Files
            if (err) throw err;
            if (!fileList || fileList[0] === undefined) throw `Please select flie!`;

            let fileObj = fileList[0];
            let old_name = fileObj.path;
            let new_name = path.join(form.uploadDir, fileObj.originalFilename);
            let fileName = fileObj.originalFilename
            if (fs.existsSync(new_name)) {
                let d = DateUtil.GetCurrentDate('yyyyMMddHHmmss')
                let extension = fileName.substring(fileName.lastIndexOf('.') + 1)
                let baseName = fileName.substring(0, fileName.lastIndexOf('.'))
                fileName = `${baseName}-${d}.${extension}`
                new_name = path.join(form.uploadDir, fileName);
            }
            fs.renameSync(old_name, new_name, (err) => {
                if (err) throw err;
                // TO DO    
            });
            let file = {
                name: new_name,
                type: "pdf",
                desc: `${old_name} -> ${new_name}`,
                uploadDate: new Date(),
                createdBy: req.user_id,
                isShare: true,
                src: `${uploadHost}/${fileName}`,
                tags: ["doucment"]
            };
            db.Files(file).save();
            return res.send({
                data: {
                    file: file,
                    message: message
                }
            });
        });
    } catch (e) {
        return res.send({
            data: {
                file: null
            }
        });
    }
})
module.exports = router;