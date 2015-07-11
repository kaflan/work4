var http = require('http');
var url = require('url');
var _ = require('lodash');
var list = {
  '1': {id: '1', name: 'Illya Klymov', phone: '+380504020799', role: 'Administrator'},
  '2': {id: '2', name: 'Ivanov Ivan', phone: '+380670000002', role: 'Student', strikes: 1},
  '3': {id: '3', name: 'Petrov Petr', phone: '+380670000001', role: 'Support', location: 'Kiev'},
  'max' : 4
};
var defaultContentType = 'application/json';
var server = http.createServer(function getReqRes(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var roles = ['Administrator', 'Student', 'Support', 'Admin'];
  var hash = Object.getOwnPropertyNames(list);
  var newHash = hash.map(function (item){
    return +item;
  });
  // console.log('hash', newHash);
  // var result = [];
  // var max = _.assign(list, {'max': id}, {'max': maximum});
  // var min = _.assign(list, {'max': id}, {'max': minimum});
  var searhRegExpId = /\/(\d+)$/;
  var content = null;
  var userValue = _.values(list);
  var del = _.remove(userValue, function(n){
    return _.isNumber(n);
  });
  var adminController = {
    GET: function () {
      return JSON.stringify(userValue);
    }
  };
  var userController = {
    GET: function () {
      return JSON.stringify(userValue);
    },
    POST: function () {
    	req.on('data', function(data) {
  		var newUser = JSON.parse(data);
  		var id = list.max;
  		var users = list;
  		var newId = (id + 1);
  		newUser.id = id.toString();
  		users[id] = newUser;
  		users.max = newId;
  		list = users;
  		console.log('list ', newUser);
  		return JSON.stringify(newUser);
  	});
    },
    DELETE: function(){
      return JSON.stringify();
    },
    PUT: function() {
      return JSON.stringify();
    }
  };
  var processRequest = function (controller) {
    if (controller[req.method]) {
      content = controller[req.method]()
    }
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

  switch (parsedUrl.pathname) {
    case '/api/users' :
      processRequest(userController);
      break;
    case '/refreshAdmins':
      processRequest(adminController);
      break;
  }
  function renderResponse(res, code, body) {
    res.writeHead(code, {
      'Accept':'*/*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(body);
  }

  if (typeof content === typeof '') {
    renderResponse(res, 200, content);
    return;
  }
  renderResponse(res, 404, '');
});


console.log("Server has started.");
if (module.parent) {
  module.exports = server
} else {
  server.listen(20007);
}
// request.headers.content-typerequest.headers.hasOwnProperty('Content-Type')
