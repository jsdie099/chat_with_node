#!/usr/bin/env node

/**
 * Module dependencies.
 */

import { Socket } from "socket.io";


var app = require('../app');
var debug = require('debug')('chat-with-node-and-socket:server');
var http = require('http');


/* GET CONNECTION WITH MONGODB */

require('dotenv-safe').config();
const mongoClient = require("mongodb").MongoClient;
mongoClient.connect(process.env.MONGO_CONNECTION, function(err: any, conn: { db: (arg0: string | undefined) => any; }){
  if(err) { return console.log(err); }
  console.log("conectou no banco de dados!");
  const globalAny:any = global;
  globalAny.db = conn.db(process.env.MONGO_DB);
  //coloque todo o código antigo do www aqui dentro
  /**
   * Get port from environment and store in Express.
 */
  var port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  var io = require('socket.io')(server);
  io.on('connection', function(socket: Socket){
    console.log('a user connected');
    socket.on('chat message', function(msg:string){
      io.emit('chat message', msg);
      console.log('message: ' + msg);
    });


    socket.on('disconnect', ()=>{
      console.log('user Disconnected');
    })
  });

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val: string) {
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

  function onError(error: { syscall: string; code: string; }) {
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

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

})


