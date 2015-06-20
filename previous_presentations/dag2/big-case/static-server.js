var http = require('http'),
    ecstatic = require('ecstatic'),

    port = process.env.PORT || 3000,
    staticDir = __dirname + '/static';

http.createServer(ecstatic({
  root: staticDir
})).listen(port);
console.log('Started server on port', port);