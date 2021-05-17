var app = require('../app');
var http = require('http');
var https = require('https');
var fs = require('fs');
var path = require('path');

const keyPath = path.join(__dirname, 'key')
var options = {
    key: fs.readFileSync(path.join(keyPath, 'server.private.key')),
    cert: fs.readFileSync(path.join(keyPath, 'server.crt'))
}
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTPs server.
 */
var httpsServer = https.createServer(options, app);
var httpServer = http.createServer(app);

// import: timeout , url will requested repeat
httpsServer.setTimeout(0);
/**
 * Listen on provided port, on all network interfaces.
 */
httpsServer.listen(port);
httpsServer.on('error', onError);
httpsServer.on('listening', onListening);

httpServer.listen(3001, 'localhost', () => {
    console.log('Example app listening on port 3001!')
});
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
    var addr = httpsServer.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    console.info('Express server listening on port ', bind, " with pid ", process.pid);
}
