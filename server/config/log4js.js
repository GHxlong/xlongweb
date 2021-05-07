let serverLogRoot = '/home/xlongweb/tmp/log4j-log'

module.exports = {
    config: {
        "appenders": {
            "access": {
                "type": "dateFile",
                "filename": `${serverLogRoot}/access.log`,
                "pattern": "-yyyy-MM-dd",
                "category": "http"
            },
            "app": {
                "type": "file",
                "filename": `${serverLogRoot}/app.log`,
                "maxLogSize": 10485760,
                "numBackups": 3
            },
            "errorFile": {
                "type": "file",
                "filename": `${serverLogRoot}/errors.log`
            },
            "errors": {
                "type": "logLevelFilter",
                "level": "ERROR",
                "appender": "errorFile"
            }
        },
        "categories": {
            "default": { "appenders": ["app", "errors"], "level": "DEBUG" },
            "http": { "appenders": ["access"], "level": "DEBUG" }
        }
    }
}