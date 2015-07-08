var http = require('http');
http.createServer(function(req, res) {
  console.log(req, res);
}).listen(20007);
