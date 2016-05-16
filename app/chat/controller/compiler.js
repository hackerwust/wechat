'use strict';

exports.__esModule = true;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require("./base.js");

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require("fs");
var stylus = require("stylus");
var coffee = require("coffee-script");
var jade = require("jade");
var path = require("path");

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  _class.prototype.indexAction = function indexAction(self) {
    var http = self.http;
    var type = http.query.type || "";
    var file = http.query.path || "";
    if (!type || !path) {
      return http.end("type or path is empty");
    }
    var paths = file.split("|");
    var file_path = paths.join("/");
    file_path = path.join(think.ROOT_PATH, "www/static", file_path);
    try {
      fs.readFile(file_path, "utf8", function (err, data) {
        if (err) {
          return http.end("readFile error:" + err.toString());
        } else {
          data = data.toString() || "";
          if (type == "coffee") {
            data = coffee.compile(data);
            http.type("application/javascript");
            http.end(data);
          } else if (type == "stylus") {
            stylus(data).set("paths", [file_path]).render(function (err, css) {
              if (err) {
                http.end("stylus compile error:" + err.toString());
              } else {
                http.type("text/css");
                http.end(css);
              }
            });
          } else if (type == "jade") {
            var fn = jade.compileClient(data);
            var code = fn.toString();
            http.type('application/javascript');
            http.end('define(function(){\n' + code + ';\nreturn template;})');
          } else {
            http.end("invalid type");
          }
        }
      });
    } catch (e) {
      http.end("error:" + e.toString());
    }
  };

  return _class;
}(_base2.default);

exports.default = _class;
//# sourceMappingURL=compiler.js.map