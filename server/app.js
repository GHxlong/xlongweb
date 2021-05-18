var createError = require('http-errors');
const express = require('express')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
const route = require('./routes/index.js')
const logConfig = require('./config/log4js').config
var path = require('path');

var log4js = require('log4js');
var app = express()

var history = require('connect-history-api-fallback');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

log4js.configure(logConfig);
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Body Parser & Cookie， limit url/body length
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser());

// muilt
app.use(express.static(path.join(__dirname, 'public')));

// app.use(history({
//     verbose: true,
//     index: '/'
// }));
app.get('/', function (request, response) {
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// request header: Sec-Fetch-Mode: cors
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// router
route(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.error("Something went wrong:", err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/////////////////////////////////
app.disable('etag');

module.exports = app;