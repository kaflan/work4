var http = require('http');
var url = require('url');
var _ = require('lodash');
var users = [{id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator'},
  {id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1},
  {id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev'}];
var server = http.createServer(function getReqRes(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var roles = ['Administrator', 'Student', 'Support', 'Admin'];
  var id = Math.max(users.id) + 1;
  var searhRegExpId = /$(?:\d)/;
  var user;
  var content = null;
  var adminController = {
    GET: function (req) {
      return {};
    }
  };
  var userController = {
    GET: function (req) {

    },
    POST: function (req) {
    }
  };
  var processRequest = function (controller) {
    if (controller[req.method]) {
      content = controller[req.method]()
    }
  };

  var isRequestValid = function() {
     return req.headers['content-type'].indexOf('application/json') >= 0;
  };

  if (!isRequestValid()) {
    return renderResponse(res, 401, '');
  }


  switch (parsedUrl.pathname) {
    case '/api/user' :
      processRequest(userController);
      break;
    case '/refreshAdmins':
      processRequest(adminController);
      break;
  }
  function renderResponse(res, code, body) {
    res.writeHead(code, {'Content-Type': 'application/json'});
    res.end(body);
  }
  if (content) {
    renderResponse(res,200, content);
    return;
  }
  renderResponse(res, 404, 'BAD request');


  console.log(parsedUrl);
  res.writeHead(200, {'Content-Type': 'application/json'});
  console.log('write head');
  res.write('Server work!!! ');
});


console.log("Server has started.");
if (module.parent) {
  module.exports = server
} else {
  server.listen(20007);
}
// request.headers.content-typerequest.headers.hasOwnProperty('Content-Type')
