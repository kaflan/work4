(function api() {
  'use strict';
  var xmlRequest;
  var me = this;
  var list;
  var strAdmin;
  strAdmin = parser.protocol + '//' + parser.host + '/refreshAdmins';
  function extend(Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Parent;
    Child.superclass = Parent.prototype;
  }

  // create User constructctor??
  function User(obj) {
    this.id = obj.id;
    this.name = obj.name;
    this.phone = obj.phone;
  }

  function Student(obj) {
    User.apply(this, [obj]);
    this.strikes = obj.strikes;
  }

  function Admin(obj) {
    User.apply(this, [obj]);
    this.role = obj.role;
  }

  function Support(obj) {
    User.apply(this, [obj]);
    this.role = obj.role;
    this.location = obj.location;
  }

  extend(Student, User);
  extend(Admin, User);
  extend(Support, User);
  // Student.prototype = Object.create(User.prototype);
  // Admin.prototype = Object.create(User.prototype);
  // Support.prototype = Object.create(User.prototype);
  function req(method, param, role, callback) {
    xmlRequest = new XMLHttpRequest();
    xmlRequest.open(method, param);
    xmlRequest.setRequestHeader('Content-Type', 'application/json');
    xmlRequest.send(JSON.stringify(role));
    xmlRequest.addEventListener('readystatechange', function rec(event) {
      if (event.target.readyState === event.target.DONE &&
        event.target.status === 200) {
        list = JSON.parse(event.target.responseText);
        callback(xmlRequest);
        return true;
      }
    });
  }

  User.load = function load(cb) {
    req('GET', window.crudURL, null, function foo() {
      list = list.map(function d(item) {
        if (item.role === 'Student') {
          return new Student(item);
        }
        if (item.role === 'Support') {
          return new Support(item);
        }
        if (item.role === 'Admin' || item.role === 'Administrator') {
          return new Admin(item);
        }
      });
      cb(list === undefined, list);
    });
  };

  User.prototype.save = function save(callback) {
    if (!(this.id === undefined)) {
      req('PUT', window.crudURL + '/' + this.id, this, function ab() {
        callback(req.status);
      });
    }
    if (me instanceof Student) {
      this.role = '';
    }
    req('POST', window.crudURL, this, function s(err) {
      callback(err, list.id);
    });
  };
  Admin.prototype.save = function save(cb) {
    var me = this;
    var req;
    if (this.id) {
      User.prototype.save.call(this, cb);
    } else {
      req = new XMLHttpRequest();
      req.open('GET', strAdmin);
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(this));
      req.addEventListener('readystatechange', function listenSavingAdmin() {
        if (req.readyState === req.DONE) {
          me.id = JSON.parse(req.responseText).id;
          cb(false);
        } else {
          cb(true);
        }
      });
    }
  };
  Student.prototype.getStrikesCount = function getStrikesCount() {
    return this.strikes;
  };

  User.prototype.remove = function _remove(cb) {
    var req = new XMLHttpRequest();
    console.log('protoRemove');
    req.open('DELETE', window.crudURL + '/' + this.id);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(this));
    req.addEventListener('readystatechange', function listenDel() {
      if (req.readyState === req.DONE) {
        cb(null);
      }
    });
  };

  window.User = User;
  window.Student = Student;
  window.Admin = Admin;
  window.Support = Support;
})();
