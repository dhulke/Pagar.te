require("dotenv").config();

function getDiTransactionUseCase() {
    switch(process.argv[2]) {
        case "postgres":
            return new (require("../../usecase/transaction/PostgresDI").PostgresDI);
        default:
            return new (require("../../usecase/transaction/MemoryDI").MemoryDI)
    }
}

var app = require('./app')(getDiTransactionUseCase());
var http = require('http');


var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


var server = http.createServer(app);


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

function onError(error) {
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

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log("listening on " + bind);
    // debug('Listening on ' + bind);
}
