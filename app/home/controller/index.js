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
    this.auto_inc = this.model("auto_inc");
  };

  _class.prototype.indexAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
      var uid;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              uid = parseInt(this.cookie("uid"), 10) || 0;

              if (!uid) {
                _context.next = 3;
                break;
              }

              return _context.abrupt('return', this.redirect("/chat/index/index"));

            case 3:
              return _context.abrupt('return', this.display());

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function indexAction() {
      return ref.apply(this, arguments);
    }

    return indexAction;
  }();

  _class.prototype.adduserAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(self) {
      var http, name, pass, uid, data, insert_id;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              http = self.http;
              name = http.post("name");
              pass = http.post("pass");
              _context2.next = 5;
              return self.getAutoId("user");

            case 5:
              uid = _context2.sent;

              if (uid) {
                _context2.next = 8;
                break;
              }

              return _context2.abrupt('return', http.json({ status: "failed", reason: "uid创建失败" }));

            case 8:
              data = { _id: uid, name: name, pass: pass, photo: "/static/tmp/photo/default.jpg" };
              _context2.next = 11;
              return self.user.add(data);

            case 11:
              insert_id = _context2.sent;

              if (insert_id == uid) {
                http.json({ status: "success", uid: uid });
              } else {
                http.json({ status: "failed", reason: "用户创建失败" });
              }

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function adduserAction(_x) {
      return ref.apply(this, arguments);
    }

    return adduserAction;
  }();

  _class.prototype.dologinAction = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(self) {
      var http, id, pass, uinfo;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              http = self.http;
              id = parseInt(http.post("id"), 10) || 0;
              pass = http.post("pass");

              if (!(!id || !pass)) {
                _context3.next = 5;
                break;
              }

              return _context3.abrupt('return', http.json({ status: 'failed', reason: "用户名或者密码为空" }));

            case 5:
              _context3.next = 7;
              return self.user.where({ _id: id, pass: pass }).find();

            case 7:
              uinfo = _context3.sent;

              if (!(think.isEmpty(uinfo) || uinfo._id != id)) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt('return', http.json({ status: 'failed', reason: "未匹配到用户" }));

            case 10:
              this.cookie("uid", uinfo._id);
              return _context3.abrupt('return', http.json({ status: "success", info: uinfo }));

            case 12:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function dologinAction(_x2) {
      return ref.apply(this, arguments);
    }

    return dologinAction;
  }();

  _class.prototype.getAutoId = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(col_name) {
      var num = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
      var auto;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.auto_inc.where({ _id: col_name }).increment("push_id", num);

            case 2:
              _context4.next = 4;
              return this.auto_inc.where({ _id: col_name }).find();

            case 4:
              auto = _context4.sent;
              return _context4.abrupt('return', auto.push_id ? auto.push_id : null);

            case 6:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function getAutoId(_x3, _x4) {
      return ref.apply(this, arguments);
    }

    return getAutoId;
  }();

  return _class;
}(_base2.default);

exports.default = _class;
//# sourceMappingURL=index.js.map