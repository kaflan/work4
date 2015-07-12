var http = require('http');
var url = require('url');
var _ = require('lodash');
var port = 20007;
var newUser = '';
var list = {
  '1': {id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator'},
  '2': {id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1},
  '3': {id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev'},
  'max': 4
};
var defaultContentType = 'application/json';
var server = http.createServer(function getReqRes(req, res) {
  var parsedUrl = url.parse(req.url, true);
  //var roles = ['Administrator', 'Student', 'Support', 'Admin'];
  //var hash = Object.getOwnPropertyNames(list);
  //var newHash = hash.map(function (item) {
    //return +item;
  //});
  var searhRegExpId = /\/(\d+)$/;
  var content = null;
  var userValue = _.values(list);
  var del = _.remove(userValue, function (n) {
    return _.isNumber(n);
  });
  var adminController = {
    GET: function () {
      renderResponse(res, 200, '');
    },
    PUT: function () {
      if(!newUser.id || newUser.id === undefined){
        renderResponse(res, 404, '');
      }
      renderResponse(res, 200, newUser);
    },
    DELETE: function () {
      if(!newUser.id || newUser.id === undefined){
        renderResponse(res, 404, '');
      }
      renderResponse(res, 200, '');
    }
  };
  var userController = {
    GET: function () {
      renderResponse(res, 200, JSON.stringify(userValue));
    },
    POST: function (requestData) {
      newUser = JSON.parse(requestData);
      var id = list.max;
      list.max = id + 1;
      newUser.id = id;
      console.log('role', newUser.role);
      if(!newUser.role || newUser.role === undefined){
        newUser.role = 'Student';
      }
      list[newUser.id] = newUser;
      console.log('new user in list', list);
      renderResponse(res, 200, JSON.stringify(newUser));
    },
    DELETE: function () {
      var data = parsedUrl.pathname.match(searhRegExpId);
      data = data[1];
      list.max = list.max - 1;
      delete list[data];
      console.log ('delete, ', data, 'list', list, list.max);
      renderResponse(res, 200, '');
    },
    PUT: function (reqestData) {
      newUser = JSON.parse(reqestData);
      // вообще не заходит сюда???
      list[newUser.id] = newUser;
      if (!newUser.id || newUser.id === undefined){
        renderResponse(res, 404, '');
      }
      console.log('put work list chenche', list);
      renderResponse(res, 200, JSON.stringify(newUser));
    }
  };
  //else if (!user.role || user.role === undefined) {
  //  response.writeHead(404, headers);
  //  response.end();
  //}
  var processRequest = function (controller) {
    if (!controller[req.method]) return;

    var requestData = '';
    req.on('data', function (data) {
      requestData += data.toString();
      // не слишком ли много
    });
    req.on('end', function () {
      controller[req.method](requestData);
    });

  };
  var isRequestValid = function () {
    if (!req.headers['content-type']) {
      console.log('no content type not');
      return false;
    }
    return req.headers['content-type'].indexOf(defaultContentType) >= 0;
  };

  // обработка
  if (req.method === 'OPTIONS') {
    console.log('options work');
    return renderResponse(res, 204, '');
  }

  if (!isRequestValid()) {
    console.log('req no valid!');
    return renderResponse(res, 401, '');
  }

  console.log("REQ METHOD", req.method);
  console.log("REQ HEADERS", req.headers);

  if (parsedUrl.pathname.indexOf('/api/users') === 0) {
    return processRequest(userController);
  }
  if (parsedUrl.pathname == '/refreshAdmins') {
    return processRequest(adminController);
  }
  function renderResponse(res, code, body) {
    res.writeHead(code, {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'HEAD, GET, POST, PUT, DELETE, OPTIONS'
    });
    res.end(body);
  }

  renderResponse(res, 404, '');
});


console.log("Server has started.", port);
if (module.parent) {
  module.exports = server
} else {
  server.listen(port);
}
// request.headers.content-typerequest.headers.hasOwnProperty('Content-Type')
