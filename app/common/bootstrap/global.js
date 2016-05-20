"use strict";

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

global.encrypt = function (str1, str2) {
  var type = arguments.length <= 2 || arguments[2] === undefined ? "base64" : arguments[2];

  str1 = typeof str1 === "string" ? str1 : str1.toString();
  str2 = typeof str2 === "string" ? str2 : str2.toString();
  if (str1 > str2) {
    var _ref = [str2, str1];
    str1 = _ref[0];
    str2 = _ref[1];
  }
  var sha1 = crypto.createHash("sha1");
  sha1.update(str1);
  sha2.update(str2);
  return sha1.digest(type);
};
//# sourceMappingURL=global.js.map