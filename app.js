var http = require('http');
function getReqRes(req, res) {
  console.log(req, res);
  res.end('load');
}
http.createServer(getReqRes()).listen(20007);
