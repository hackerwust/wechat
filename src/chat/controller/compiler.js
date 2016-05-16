'use strict';

var fs = require("fs");
var stylus = require("stylus");
var coffee = require("coffee-script");
var jade = require("jade");
var path = require("path");

import Base from './base.js';

export default class extends Base {
  
  indexAction(self) {
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
      fs.readFile(file_path, "utf8", function(err, data) {
        if (err) {
          return http.end("readFile error:" + err.toString());
        } else {
          data = data.toString() || "";
          if (type == "coffee") {
            data = coffee.compile(data);
            http.type("application/javascript");
            http.end(data);
          } else if (type == "stylus") {
            stylus(data).set("paths", [file_path]).render(function(err, css) {
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
  }

}