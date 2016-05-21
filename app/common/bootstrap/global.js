"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 * 
 * global.fn1 = function(){
 *     
 * }
 */
var crypto = require("crypto");
var fs = require("fs");
var path = require("path");

global.encrypt = function (str1, str2) {
  var type = arguments.length <= 2 || arguments[2] === undefined ? "hex" : arguments[2];

  str1 = typeof str1 === "string" ? str1 : str1.toString();
  str2 = typeof str2 === "string" ? str2 : str2.toString();
  if (str1 > str2) {
    var _ref = [str2, str1];
    str1 = _ref[0];
    str2 = _ref[1];
  }
  var sha1 = crypto.createHash("sha1");
  sha1.update(str1);
  sha1.update(str2);
  return sha1.digest(type);
};

global.savelog = function (str1, str2, data) {
  str2 = str1 == "group" ? "" : str2;
  data = typeof data == "string" ? data : (0, _stringify2.default)(data);
  var name = encrypt(str1, str2);
  var chatlog_dir = path.join(think.ROOT_PATH, "www/static/tmp/chatlog");
  var filename = path.join(chatlog_dir, name + ".json");
  if (!fs.existsSync(chatlog_dir)) {
    fs.mkdirSync(chatlog_dir, "0777");
  }
  if (data) {
    fs.appendFileSync(filename, data + ",", "utf8", "a+");
  }
};

global.getlog = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(str1, str2) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            str2 = str1 == "group" ? "" : str2;
            return _context.abrupt("return", new _promise2.default(function (resolve, reject) {
              var name = encrypt(str1, str2);
              var filename = path.join(think.ROOT_PATH, "www/static/tmp/chatlog", name + ".json");
              fs.readFile(filename, function (err, data) {
                if (err) {
                  resolve(null);
                } else {
                  data = "[" + data.toString("utf8").slice(0, -1) + "]";
                  data = parseJson(data);
                  resolve(data);
                }
              });
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function (_x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

global.parseJson = function (str) {
  try {
    var data = JSON.parse(str);
  } catch (e) {
    var data = null;
  }
  return data;
};

global.formatTime = function (date) {
  var fmt = arguments.length <= 1 || arguments[1] === undefined ? "M月dd日 hh:mm" : arguments[1];

  var o = {
    "M+": date.getMonth() + 1, //月份  
    "d+": date.getDate(), //日  
    "h+": date.getHours(), //小时  
    "m+": date.getMinutes(), //分  
    "s+": date.getSeconds(), //秒  
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度  
    "S": date.getMilliseconds() //毫秒  
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }return fmt;
};
//# sourceMappingURL=global.js.map