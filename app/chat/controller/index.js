'use strict';

exports.__esModule = true;

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

var fs = require("fs");
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

              self.assign({ self: uinfo, friends: friends, logs: logs });
              return _context.abrupt('return', this.display());

            case 18:
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

  _class.prototype.dologoutAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(self) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              this.cookie("uid", null);
              return _context2.abrupt('return', this.redirect("/home/index/index"));

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function dologoutAction(_x2) {
      return ref.apply(this, arguments);
    }

    return dologoutAction;
  }();

  // 建立socket连接时铜鼓socket.handshake.headers.cookie获得cookie


  _class.prototype.connectAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(self) {
      var http, socket, headers, reg, uid, uinfo;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              http = self.http;
              socket = http.socket;
              headers = socket.handshake.headers;
              reg = /uid=(\d+)/;
              uid = parseInt(headers.cookie.match(reg)[1], 10) || 0;

              if (uid) {
                _context3.next = 8;
                break;
              }

              _context3.next = 8;
              return self.dologoutAction();

            case 8:
              _context3.next = 10;
              return self.user.where({ _id: uid }).find();

            case 10:
              uinfo = _context3.sent;

              uid_arr.push(uid);
              sockets["u" + uid] = socket;
              // 有刚注册登录进来的用户
              uinfo.online = "on";
              self.broadcast("online", { uinfo: uinfo });

            case 15:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function connectAction(_x3) {
      return ref.apply(this, arguments);
    }

    return connectAction;
  }();

  _class.prototype.closeAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(self) {
      var http, socket, data, headers, reg, uid, index, uinfo;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
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
              _context4.next = 11;
              return self.user.where({ _id: uid }).find();

            case 11:
              uinfo = _context4.sent;

              uinfo.online = "off";
              self.broadcast("offline", { uinfo: uinfo });

            case 14:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function closeAction(_x4) {
      return ref.apply(this, arguments);
    }

    return closeAction;
  }();

  _class.prototype.getmsgAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(self) {
      var http, socket, msg, target_socket;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              http = self.http;
              socket = http.socket;
              msg = http.data;

              savelog(msg.other, msg.data.uid, msg.data);
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

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function getmsgAction(_x5) {
      return ref.apply(this, arguments);
    }

    return getmsgAction;
  }();

  _class.prototype.getlogAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(self) {
      var http, uid, other_id, logs;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              http = self.http;
              uid = http.post("uid");
              other_id = http.post("other");
              // other_id 在前， 可能是group

              _context6.next = 6;
              return getlog(other_id, uid);

            case 6:
              logs = _context6.sent;
              return _context6.abrupt('return', http.json({ status: "success", data: logs }));

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6['catch'](0);
              return _context6.abrupt('return', http.json({ status: "failed" }));

            case 13:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this, [[0, 10]]);
    }));

    function getlogAction(_x6) {
      return ref.apply(this, arguments);
    }

    return getlogAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;
//# sourceMappingURL=index.js.map