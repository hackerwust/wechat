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

global.encrypt = function(str1, str2, type = "hex") {
  str1 = typeof str1 === "string" ? str1 : str1.toString();
  str2 = typeof str2 === "string" ? str2 : str2.toString();
  if (str1 > str2) {
    [str1, str2] = [str2, str1];
  }
  var sha1 = crypto.createHash("sha1");
  sha1.update(str1);
  sha1.update(str2);
  return sha1.digest(type);
};

global.savelog = function(str1, str2, data) {
  str2 = str1 == "group" ? "" : str2;
  data = typeof data == "string" ? data : JSON.stringify(data);
  var name = encrypt(str1, str2);
  var chatlog_dir = path.join(think.ROOT_PATH, "www/static/tmp/chatlog");
  var filename = path.join(chatlog_dir, name + ".json");
  if (!fs.existsSync(chatlog_dir)) {
    fs.mkdirSync(chatlog_dir, "0777");
  } 
  if (data) {
    fs.appendFileSync(filename, data + ",", "utf8", "a+");
  }
}

global.getlog = async function(str1, str2) {
  str2 = str1 == "group" ? "" : str2;
  return new Promise((resolve, reject) => {
    var name = encrypt(str1, str2);
    var filename = path.join(think.ROOT_PATH, "www/static/tmp/chatlog", name + ".json");
    fs.readFile(filename, function(err, data) {
      if (err) {
        resolve([]);
      } else {
        data = "[" + data.toString("utf8").slice(0, -1) + "]";
        data = parseJson(data);
        resolve(data);
      }
    });
  });
}

global.parseJson = function(str) {
  try {
    var data = JSON.parse(str);
  } catch (e) {
    var data = null;
  }
  return data;
}

global.formatTime = function(date, fmt = "M月dd日 hh:mm") {
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

global.savePhoto = async function(filename, uid) {
  return new Promise(function(resolve, reject) {
    try {
      uid = typeof uid == "string" ? uid : uid.toString();
      var sha1 = crypto.createHash("sha1");
      sha1.update(uid);
      var str = sha1.digest('hex');
      var extname = path.extname(filename);
      var filepath = path.join(think.ROOT_PATH, "www/static/tmp/photo", str + extname);
      var rs = fs.createReadStream(filename);
      var ws = fs.createWriteStream(filepath);
      rs.on("data", function(chunk) {
        if (ws.write(chunk) == false) {
          rs.pause();
        }
      });
      ws.on("drain", function() {
        rs.resume()
      });
      rs.on("end", function() {
        ws.end();
        resolve(`/static/tmp/photo/${str}${extname}`);
      });
    } catch (e) {
      resolve(null);
    }
  }); 
};
