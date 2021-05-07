var WebSocket = require('ws');
var URL = require('url');
var log = require('log4js').getLogger("startup");

const websocketPort = null
// Create a WebSocket server completely detached from the HTTP server.
var WsServer = function () {
    if (typeof WsServer.instance === 'object') {
        return WsServer.instance
    }

    this.clientMap = new Map();
    this.serverPort = null;
    this.wss = null;
    WsServer.instance = this
    return this


};

WsServer.prototype.Start = function(port, callback) {
    this.serverPort = port || websocketPort || 3001

    log.info(`Create wsserver: bind port ${this.serverPort}`);
    this.wss = new WebSocket.Server({ clientTracking: false, noServer: true, port: this.serverPort });
    this.wss.on('connection', (ws, request) => {
        let req = URL.parse(request.url, true)
        if (req.query['clientkey'] === undefined) {
            ws.send(`parms is unvaild`)
            return ws.close();
        }
        let connectId = req.query['clientkey']
        this.clientMap.set(connectId, ws);
        if (callback) {
            callback(null, connectId)
        }
        ws.on('message', (message) => {
            console.log(`Received message ${message} from user ${connectId}`);
        });
        ws.on('close', () => {
            connectionWs = null;
            this.clientMap.delete(connectId);
            log.info(`request close: ${request.url}`);
        });
        ws.on("error", (err) => {
            log.info(`request error: ${request.url}, error: ${err}`);
        });
    });
}

/**
 * 
 * @param {string} clientKey 
 * @param {string} msg 
 */
WsServer.prototype.SendMssage = function(clientKey, msg) {
    if (WsServer.instance.clientMap.get(clientKey)) {
        log.trace(`send mssage client key = ${clientKey}: ${msg}`);
        return WsServer.instance.clientMap.get(clientKey).send(msg)
    } else {
        log.error(`send mssage fail: client key = ${clientKey} is not exists.`);
    }
}

module.exports = new WsServer();