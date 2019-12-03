
const express = require('express');
const app = express();
const fs = require('fs');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/build'));

const port = 3000

server.listen(port, () => console.log(`server started on http://localhost:${port}`));

let file = fs.readFileSync(__dirname + '/test/index.js').toString();

io.on('connection', function (socket) {
  socket.emit('doc', {
    timestamp: new Date().getTime(),
    doc: file
  })
  socket.on('update', function (data) {
    file = data.doc;
    io.emit('doc', data);
  })

  socket.on('disconnect', function (data) {
    console.log('disconnect', data)
  })
});