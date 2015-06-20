var http = require('http'),
    ecstatic = require('ecstatic'),
    users = require('./lib/users'),

    port = process.env.PORT || 5001,
    staticDir = __dirname + '/static',

    app = http.createServer(serverHandler),
    io = require('socket.io').listen(app);

app.listen(port);
console.log('Started server on port', port);

function serverHandler (req, res) {
  if (users.route(req, res)) {
    return;
  }
  return ecstatic({
    root: staticDir
  })(req, res);
};

io.sockets.on('connection', function (socket) {
  var username = null;

  socket.on('message', function (data) {
    if (!username) return;
    socket.broadcast.emit('message', data);
  });

  socket.on('join', function (data) {
    users.add(data);
    username = data;
    socket.broadcast.emit('join', data);
  });

  socket.on('disconnect', function() {
    if (!username) return;
    users.remove(username);
    socket.broadcast.emit('part', username);
  });
});