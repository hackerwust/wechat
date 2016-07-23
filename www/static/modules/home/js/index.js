(function() {
  define(['jquery', 'jade'], function($, jade) {
    var getphoto, login_wrap, register_wrap, throttle;
    login_wrap = $(".login-wrap");
    register_wrap = $(".register-wrap");
    console.log('xiaochan sdfsfjs j');
    $.fn.extend({
      form_empty: function() {
        $(this).find("input").val("");
        $(this).find(".msg").text("");
        return $(this);
      },
      fill_form: function(o) {
        var key, self;
        self = $(this);
        for (key in o) {
          self.find(key).val(o[key]);
        }
        return self;
      },
      replace_chinese: function() {
        var self;
        self = $(this);
        setTimeout(function() {
          return self.val(self.val().replace(/[\u4e00-\u9fa5]/g, ''));
        }, 0);
        return self;
      }
    });
    throttle = function(fn, speed) {
      var timer;
      speed = speed || 200;
      timer = null;
      return function() {
        var args;
        timer && clearTimeout(timer);
        args = arguments;
        return timer = setTimeout(function() {
          return fn && fn.call(null, args);
        }, speed);
      };
    };
    register_wrap.on("click", ".submit", function(e) {});
    register_wrap.on("click", ".to-login", function(e) {
      register_wrap.form_empty().fadeOut("fast");
      return login_wrap.form_empty().fadeIn("fast");
    });
    register_wrap.on("keyup", ".pass-control", function(e) {
      return $(this).replace_chinese();
    });
    register_wrap.on("keyup", "input", function(e) {
      var color, confirm_pass, name, pass, val;
      name = $.trim(register_wrap.find(".name").val());
      pass = $.trim(register_wrap.find(".pass").val());
      confirm_pass = $.trim(register_wrap.find(".confirm-pass").val());
      val = $.trim($(this).val());
      color = val ? "rgba(0, 0, 0, 0.3)" : "red";
      $(this).css("borderColor", color);
      if (name && pass && confirm_pass && pass === confirm_pass) {
        return register_wrap.find(".msg").text("");
      }
    });
    register_wrap.on("click", ".submit", function(e) {
      var confirm_pass, confirm_pass_val, i, item, len, msg, name, name_val, pass, pass_val, ref;
      name = register_wrap.find(".name");
      pass = register_wrap.find(".pass");
      confirm_pass = register_wrap.find(".confirm-pass");
      msg = register_wrap.find(".msg");
      ref = [name, pass, confirm_pass];
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (!$.trim(item.val())) {
          register_wrap.find(".msg").text("不能为空");
          return item[0].focus();
        }
      }
      name_val = $.trim(name.val());
      pass_val = $.trim(pass.val());
      confirm_pass_val = $.trim(confirm_pass.val());
      if (pass_val !== confirm_pass_val) {
        confirm_pass[0].focus();
        return msg.text("两次密码不相等");
      }
      return $.post('/home/index/adduser', {
        name: name_val,
        pass: pass_val
      }).always(function(o) {
        if (o && o.status === "success") {
          register_wrap.form_empty();
          return msg.text("您的帐号为" + o.uid + ",去登陆吧");
        } else {
          return msg.text("不好意思，注册失败");
        }
      });
    });
    login_wrap.on("click", ".to-register", function(e) {
      register_wrap.form_empty().fadeIn("fast");
      return login_wrap.form_empty().fadeOut("fast");
    });
    login_wrap.on("keyup", "input", function(e) {
      var color, id, msg, pass, val;
      id = $.trim(login_wrap.find(".id").val());
      pass = $.trim(login_wrap.find(".pass").val());
      msg = login_wrap.find(".msg");
      val = $.trim($(this).val());
      color = val ? "rgba(0, 0, 0, 0.3)" : "red";
      $(this).css("borderColor", color);
      if (id && pass) {
        return msg.text("");
      }
    });
    getphoto = function() {
      var id_input, photo, uid;
      photo = $(".login-wrap .user-photo");
      id_input = $(".login-wrap .id");
      uid = $.trim(id_input.val());
      if (!uid) {
        return;
      }
      return $.get("/home/index/getphoto?uid=" + uid).always(function(o) {
        if (o && o.status === "success" && o.path) {
          return photo.prop("src", o.path);
        } else {
          return photo.prop("src", "/static/tmp/photo/default.jpg");
        }
      });
    };
    login_wrap.on("keyup", ".id", throttle(getphoto));
    return login_wrap.on("click", ".login-btn", function(e) {
      var id, item, key, msg, pass, ref;
      id = login_wrap.find(".id");
      pass = login_wrap.find(".pass");
      msg = login_wrap.find(".msg");
      ref = {
        "账号": id,
        "密码": pass
      };
      for (key in ref) {
        item = ref[key];
        if (!$.trim(item.val())) {
          item[0].focus();
          return msg.text(key + "不能为空");
        }
      }
      return $.post("/home/index/dologin", {
        id: $.trim(id.val()),
        pass: $.trim(pass.val())
      }).always(function(o) {
        if (o && o.status === "failed") {
          return msg.text("账号或者密码错误");
        } else {
          msg.text("登录成功");
          return setTimeout(function() {
            return window.location.href = "/chat/index/index";
          }, 1000);
        }
      });
    });
  });

}).call(this);
