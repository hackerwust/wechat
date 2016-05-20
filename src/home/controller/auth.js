'use strict';

import Base from './base.js';

export default class extends Base {
  init(...args) {
    super.init(...args);
    var wechat = this.model('user');
    var auto_inc = this.model('auto_inc');
  }

  getinfoAction() {
    var http = self.http;
    var uid = http._cookie.uid || "";
    if (!uid) {
      return http.json({status: "failed", reason: "the token is empty"});
    }
  }
  
}