'use strict';

let fs = require("fs");
let sockets = {};
let uid_arr = [];

import Base from './base.js';

export default class extends Base {
  init(...args) {
    super.init(...args);
    this.user = this.model("user");
  }

  async indexAction(self) {
    var uid = self.cookie('uid');
    uid = parseInt(uid, 10) || 0;
    if (!uid) {
      return self.redirect("/home/index");
    }
    var uinfo = await self.user.where({_id: uid}).find();
    if (think.isEmpty(uinfo)) {
      return self.redirect("/home/index");
    }
    var friends = await self.user.where({_id: {"$ne": uid}}).select();
    friends.map(item => {
      if (uid_arr.indexOf(item._id) == -1) {
        item.online = "off";
      } else {
        item.online = "on";
      }
    });
    var logs = await getlog("group", "");
    self.assign({self: uinfo, friends, logs});
    return this.display();
  }
  
  async dologoutAction(self) {
    this.cookie("uid", null);
    return this.redirect("/home/index/index");
  }

  // 建立socket连接时铜鼓socket.handshake.headers.cookie获得cookie
  async connectAction(self) {
    var http = self.http;
    var socket = http.socket;
    var headers = socket.handshake.headers;
    var reg = /uid=(\d+)/;
    var uid = parseInt(headers.cookie.match(reg)[1], 10) || 0;
    if (!uid) {
      await self.dologoutAction();
    }
    var uinfo = await self.user.where({_id: uid}).find();
    uid_arr.push(uid);
    sockets["u" + uid] = socket;
    // 有刚注册登录进来的用户
    uinfo.online = "on";
    self.broadcast("online", {uinfo}); 
  }

  async closeAction(self) {
    var http = self.http;
    var socket = http.socket;
    var data = http.data;
    var headers = socket.handshake.headers;
    var reg = /uid=(\d+)/;
    var uid = parseInt(headers.cookie.match(reg)[1], 10) || 0;
    var index = uid_arr.indexOf(uid);
    if (index > -1) {
      uid_arr.splice(index, 1);
    }
    if (sockets["u" + uid]) {
      delete sockets["u" + uid];
    }
    var uinfo = await self.user.where({_id: uid}).find();
    uinfo.online = "off";
    self.broadcast("offline", {uinfo});
  }

  async getmsgAction(self) {
    var http = self.http;
    var socket = http.socket;
    var msg = http.data;
    savelog(msg.other, msg.data.uid, msg.data);
    msg.data.to = msg.other;
    if (msg.other == "group") {
      self.broadcast("newlog", msg.data);
    } else {
      // 获得发送对象socket
      var target_socket = sockets["u" + msg.other];
      if (target_socket) {
        target_socket.emit("newlog", msg.data);
      }
    }
  }

  async getlogAction(self) {
    try {
      var http = self.http;
      var uid = http.post("uid");
      var other_id = http.post("other");
      // other_id 在前， 可能是group
      var logs = await getlog(other_id, uid);
      return http.json({status: "success", data: logs});
    } catch (e) {
      return http.json({status: "failed"});
    }
  }
  
}