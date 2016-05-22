'use strict';

exports.__esModule = true;

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sockets = {};
var uid_arr = [];

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.init = function init() {
    var _Base$prototype$init;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_Base$prototype$init = _Base.prototype.init).call.apply(_Base$prototype$init, [this].concat(args));
    this.user = this.model("user");
  };

  _class.prototype.indexAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(self) {
      var uid, uinfo, friends, logs;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              uid = self.cookie('uid');

              uid = parseInt(uid, 10) || 0;

              if (uid) {
                _context.next = 4;
                break;
              }

              return _context.abrupt('return', self.redirect("/home/index"));

            case 4:
              _context.next = 6;
              return self.user.where({ _id: uid }).find();

            case 6:
              uinfo = _context.sent;

              if (!think.isEmpty(uinfo)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt('return', self.redirect("/home/index"));

            case 9:
              _context.next = 11;
              return self.user.where({ _id: { "$ne": uid } }).select();

            case 11:
              friends = _context.sent;

              friends.map(function (item) {
                if (uid_arr.indexOf(item._id) == -1) {
                  item.online = "off";
                } else {
                  item.online = "on";
                }
              });
              _context.next = 15;
              return getlog("group", "");

            case 15:
              logs = _context.sent;
              _context.next = 18;
              return self.addPhoto(logs);

            case 18:
              self.assign({ self: uinfo, friends: friends, logs: logs });
              return _context.abrupt('return', this.display());

            case 20:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function indexAction(_x) {
      return ref.apply(this, arguments);
    }

    return indexAction;
  }();

  _class.prototype.addPhoto = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(logs) {
      var self, photo_hash, i, len, uid, info, user;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              self = this;
              photo_hash = new _map2.default();
              i = 0, len = logs.length;

            case 3:
              if (!(i < len)) {
                _context2.next = 16;
                break;
              }

              uid = logs[i].uid;

              if (photo_hash.has(uid)) {
                _context2.next = 10;
                break;
              }

              _context2.next = 8;
              return self.user.where({ _id: uid }).find();

            case 8:
              info = _context2.sent;

              photo_hash.set(uid, info);

            case 10:
              user = photo_hash.get(uid);

              logs[i].photo = user.photo;
              logs[i].name = user.name;

            case 13:
              i++;
              _context2.next = 3;
              break;

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function addPhoto(_x2) {
      return ref.apply(this, arguments);
    }

    return addPhoto;
  }();

  _class.prototype.dologoutAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(self) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.cookie("uid", null);
              return _context3.abrupt('return', this.redirect("/home/index/index"));

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function dologoutAction(_x3) {
      return ref.apply(this, arguments);
    }

    return dologoutAction;
  }();

  // 建立socket连接时铜鼓socket.handshake.headers.cookie获得cookie


  _class.prototype.connectAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(self) {
      var http, socket, headers, reg, uid, uinfo;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              http = self.http;
              socket = http.socket;
              headers = socket.handshake.headers;
              reg = /uid=(\d+)/;
              uid = parseInt(headers.cookie.match(reg)[1], 10) || 0;

              if (uid) {
                _context4.next = 8;
                break;
              }

              _context4.next = 8;
              return self.dologoutAction();

            case 8:
              _context4.next = 10;
              return self.user.where({ _id: uid }).find();

            case 10:
              uinfo = _context4.sent;

              uid_arr.push(uid);
              sockets["u" + uid] = socket;
              // 有刚注册登录进来的用户
              uinfo.online = "on";
              self.broadcast("online", { uinfo: uinfo });

            case 15:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function connectAction(_x4) {
      return ref.apply(this, arguments);
    }

    return connectAction;
  }();

  _class.prototype.closeAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(self) {
      var http, socket, data, headers, reg, uid, index, uinfo;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              http = self.http;
              socket = http.socket;
              data = http.data;
              headers = socket.handshake.headers;
              reg = /uid=(\d+)/;
              uid = parseInt(headers.cookie.match(reg)[1], 10) || 0;
              index = uid_arr.indexOf(uid);

              if (index > -1) {
                uid_arr.splice(index, 1);
              }
              if (sockets["u" + uid]) {
                delete sockets["u" + uid];
              }
              _context5.next = 11;
              return self.user.where({ _id: uid }).find();

            case 11:
              uinfo = _context5.sent;

              uinfo.online = "off";
              self.broadcast("offline", { uinfo: uinfo });

            case 14:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function closeAction(_x5) {
      return ref.apply(this, arguments);
    }

    return closeAction;
  }();

  _class.prototype.getmsgAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(self) {
      var http, socket, msg, target_socket;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              http = self.http;
              socket = http.socket;
              msg = http.data;


              msg.data.to = msg.other;
              if (msg.other == "group") {
                self.broadcast("newlog", msg.data);
              } else {
                // 获得发送对象socket
                target_socket = sockets["u" + msg.other];

                if (target_socket) {
                  target_socket.emit("newlog", msg.data);
                }
              }
              delete msg.data.name;
              delete msh.data.photo;
              savelog(msg.other, msg.data.uid, msg.data);

            case 8:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    function getmsgAction(_x6) {
      return ref.apply(this, arguments);
    }

    return getmsgAction;
  }();

  _class.prototype.changephotoAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(self) {
      var http, photo, uid, path, row;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              http = self.http;
              photo = http.file("photo");
              uid = parseInt(http.post("uid"), 10) || 0;

              if (!(think.isEmpty(photo) || !uid)) {
                _context7.next = 5;
                break;
              }

              return _context7.abrupt('return', http.json({ status: "failed", reason: "图片传输失败或者uid为空" }));

            case 5:
              _context7.next = 7;
              return savePhoto(photo.path, uid);

            case 7:
              path = _context7.sent;

              if (!path) {
                _context7.next = 17;
                break;
              }

              _context7.next = 11;
              return self.user.where({ _id: uid }).update({ photo: path });

            case 11:
              row = _context7.sent;

              if (!(row >= 0)) {
                _context7.next = 14;
                break;
              }

              return _context7.abrupt('return', http.json({ status: "success", path: path }));

            case 14:
              return _context7.abrupt('return', http.json({ status: "failed", reason: "数据库更新失败" }));

            case 17:
              return _context7.abrupt('return', http.json({ status: "failed", reason: "保存失败" }));

            case 18:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, this);
    }));

    function changephotoAction(_x7) {
      return ref.apply(this, arguments);
    }

    return changephotoAction;
  }();

  _class.prototype.saveAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(self) {
      var http, name, pass, uid, row;
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              http = self.http;
              name = http.post("name");
              pass = http.post("pass");
              uid = parseInt(http.post("uid"), 10) || 0;

              if (uid) {
                _context8.next = 6;
                break;
              }

              return _context8.abrupt('return', http.json({ status: "failed", reason: "uid为空" }));

            case 6:
              _context8.next = 8;
              return self.user.where({ _id: uid }).update({ name: name, pass: pass });

            case 8:
              row = _context8.sent;

              if (!(row >= 0)) {
                _context8.next = 13;
                break;
              }

              return _context8.abrupt('return', http.json({ status: "success" }));

            case 13:
              return _context8.abrupt('return', http.json({ status: "failed", reason: "数据库更新失败" }));

            case 14:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    function saveAction(_x8) {
      return ref.apply(this, arguments);
    }

    return saveAction;
  }();

  _class.prototype.getlogAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(self) {
      var http, uid, other_id, logs;
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              http = self.http;
              uid = http.post("uid");
              other_id = http.post("other");
              // other_id 在前， 可能是group

              _context9.next = 5;
              return getlog(other_id, uid);

            case 5:
              logs = _context9.sent;
              _context9.next = 8;
              return self.addPhoto(logs);

            case 8:
              return _context9.abrupt('return', http.json({ status: "success", data: logs }));

            case 9:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, this);
    }));

    function getlogAction(_x9) {
      return ref.apply(this, arguments);
    }

    return getlogAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;
//# sourceMappingURL=index.js.map