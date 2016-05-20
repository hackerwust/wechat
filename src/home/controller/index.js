'use strict';

import Base from './base.js';

export default class extends Base {
  init(...args) {
    super.init(...args);
    this.user = this.model("user");
    this.auto_inc = this.model("auto_inc");
  }

  async indexAction() {
    return this.display();
  }
  
  async adduserAction(self) {
    var http = self.http;
    var name = http.post("name");
    var pass = http.post("pass");

    var uid = await self.getAutoId("user");
    if (!uid) {
      return http.json({status: "failed", reason: "uid创建失败"});
    }
    var data = {_id: uid, name, pass, photo: "/static/tmp/photo/default.jpg"};
    var insert_id = await self.user.add(data);
    if (insert_id == uid) {
      http.json({status: "success", uid});
    } else {
      http.json({status: "failed", reason: "用户创建失败"});
    }
  }
  
  async dologinAction(self) {
    var http = self.http;
    var id = parseInt(http.post("id"), 10) || 0;
    var pass = http.post("pass");
    console.log(http._post);
    if (!id || !pass) {
      return http.json({status: 'failed', reason: "用户名或者密码为空"});
    }
    var uinfo = await self.uinfo.where({_id: id, pass}).find();
    if (think.isEmpty(uinfo) || uinfo._id != id) {
      return http.json({status: 'failed', reason: "未匹配到用户"});
    }
    return http.json({status: "success", info: uinfo});
  }

  async getAutoId(col_name, num = 1) {
    await this.auto_inc.where({_id: col_name}).increment("push_id", num);
    var auto = await this.auto_inc.where({_id: col_name}).find();
    return auto.push_id ? auto.push_id : null;
  }
  
}