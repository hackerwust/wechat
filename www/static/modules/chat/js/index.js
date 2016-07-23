(function() {
  define(['jquery', 'jade', 'socket', 'text!chat/tpl/chat-log-item.jade', 'text!chat/tpl/friend-item.jade'], function($, jade, socket, chat_log_item_tpl, friend_item_tpl) {
    var chat_log_wrap, chat_window, edit_wrap, formatTime, friends_wrap, getFriendActive, host, hostname, photo, photo_file, self_info_wrap, timer, type_write, uid;
    $.fn.extend({
      scrollToLast: function() {
        var self;
        self = $(this);
        self.scrollTop(20000000);
        return self;
      },
      resetLogNum: function() {
        var log_num;
        log_num = $(this).find(".log-num");
        log_num.addClass("hide").text("0");
        return $(this);
      },
      incLogNum: function() {
        var log_num, num;
        log_num = $(this).find(".log-num");
        log_num.removeClass("hide");
        num = parseInt(log_num.text() || 10) || 0;
        num = num + 1;
        if (num > 99) {
          num = "99+";
        }
        log_num.text(num).addClass("shake");
        return $(this);
      },
      resetForm: function() {
        var photo;
        photo = $(this).find(".photo");
        photo.prop("src", photo.attr("_src"));
        $(this).find("input").each(function() {
          return $(this).val($(this).attr("default"));
        });
        return $(this);
      }
    });
    formatTime = function(date, fmt) {
      var k, o;
      if (fmt == null) {
        fmt = 'M月dd日 hh:mm';
      }
      o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return fmt;
    };
    chat_log_item_tpl = jade.compile(chat_log_item_tpl);
    friend_item_tpl = jade.compile(friend_item_tpl);
    edit_wrap = $(".self-info-edit-wrap");
    self_info_wrap = $(".self-info-wrap");
    friends_wrap = $(".friends-wrap");
    chat_window = $(".chat-window");
    chat_log_wrap = $(".chat-log-wrap");
    type_write = $(".type-write-wrap");
    photo_file = $(".photo-file");
    uid = parseInt(self_info_wrap.attr('uid'), 10) || 0;
    photo = self_info_wrap.find(".photo").prop("src");
    chat_log_wrap.scrollToLast();
    self_info_wrap.on("click", ".photo", function(e) {
      return edit_wrap.removeClass("hide");
    });
    edit_wrap.on("click", ".close-btn", function(e) {
      return edit_wrap.addClass("hide").resetForm();
    });
    edit_wrap.on("click", ".photo", function(e) {
      return photo_file.trigger("click");
    });
    edit_wrap.on("change", ".photo-file", function(e) {
      var file, form_data, url;
      file = this.files[0];
      form_data = new FormData();
      form_data.append("photo", file);
      form_data.append("uid", uid);
      url = URL.createObjectURL(file);
      return $.ajax({
        url: "/chat/index/changephoto",
        type: "post",
        data: form_data,
        contentType: false,
        processData: false
      }).always(function(o) {
        console.log(o.path);
        if (o && o.status === "success") {
          photo_file.val("");
          edit_wrap.find(".photo").prop("src", url).attr("_src", url);
          self_info_wrap.find(".photo").prop("src", url);
          return edit_wrap.find(".remind-msg").text("上传成功");
        } else if (o && o.reason) {
          return edit_wrap.find(".remind-msg").text(o.reason);
        } else {
          return edit_wrap.find(".remind-msg").text("上传失败");
        }
      });
    });
    edit_wrap.on("click", ".save", function(e) {
      var name, pass;
      name = edit_wrap.find(".name").val();
      pass = edit_wrap.find(".pass").val();
      return $.post("/chat/index/save", {
        name: name,
        pass: pass,
        uid: uid
      }).always(function(o) {
        if (o && o.status === "success") {
          edit_wrap.find(".remind-msg").text("保存成功");
          self_info_wrap.find(".name").text(name);
          edit_wrap.find(".name").attr("default", name);
          return edit_wrap.find(".pass").attr("default", pass);
        } else {
          return edit_wrap.find(".remind-msg").text("保存失败");
        }
      });
    });
    if (!uid) {
      alert("uid错误，请重新登录");
      window.location.href = "/chat/index/dologout";
    }
    getFriendActive = function() {
      var active;
      active = friends_wrap.find(".active");
      if (active.length) {
        return active;
      } else {
        return null;
      }
    };
    host = window.location.host;
    hostname = window.location.hostname;
    socket = socket(host);
    socket.on("online", function(data) {
      var friend;
      if (data && data.uinfo && data.uinfo._id && data.uinfo._id !== uid) {
        friend = friends_wrap.find("[uid='" + data.uinfo._id + "']").find(".status");
        if (friend.length) {
          return friend.removeClass("offline");
        } else {
          return friends_wrap.append($(friend_item_tpl(data.uinfo)));
        }
      }
    });
    socket.on("offline", function(data) {
      var friend;
      if (data && data.uinfo && data.uinfo._id && data.uinfo._id !== uid) {
        friend = friends_wrap.find("[uid='" + data.uinfo._id + "']").find(".status");
        if (friend.length) {
          return friend.addClass("offline");
        }
      }
    });
    socket.on("newlog", function(data) {
      var active, group, source;
      if (!data || !data.uid) {
        return;
      }
      active = getFriendActive();
      source = friends_wrap.find("[uid='" + data.uid + "']");
      data.self = false;
      if (data.to === "group") {
        group = friends_wrap.find(".group");
        if (group.hasClass("active")) {
          chat_log_wrap.addClass("group").append(chat_log_item_tpl(data));
          return chat_log_wrap.scrollToLast();
        } else {
          return group.incLogNum();
        }
      } else {
        if (source.hasClass("active")) {
          chat_log_wrap.removeClass("group").append(chat_log_item_tpl(data));
          return chat_log_wrap.scrollToLast();
        } else {
          return source.incLogNum();
        }
      }
    });
    type_write.on("keydown", function(e) {
      var active, data, other_id, self, val;
      self = $(this);
      val = self.val();
      active = getFriendActive();
      other_id = active.attr("uid");
      if (!val) {
        return;
      }
      if (e.which === 13 || e.keyCode === 13) {
        self.val("");
        data = {
          self: true,
          uid: uid,
          time: formatTime(new Date()),
          name: self_info_wrap.find(".name").text(),
          photo: photo,
          content: val
        };
        chat_log_wrap.append(chat_log_item_tpl(data));
        chat_log_wrap.scrollToLast();
        delete data.self;
        return socket.emit("sendmsg", {
          data: data,
          other: other_id
        });
      }
    });
    friends_wrap.on("click", ".item", function(e) {
      var active, other_id, self;
      self = $(this);
      if (self.hasClass("active")) {
        return;
      }
      active = getFriendActive();
      other_id = self.attr("uid");
      return $.post("/chat/index/getlog", {
        uid: uid,
        other: other_id
      }).always(function(o) {
        var i, item, len, ref;
        if (o && o.status === "success") {
          chat_log_wrap.hide().empty();
          if (other_id === "group") {
            chat_log_wrap.addClass("group");
          } else {
            chat_log_wrap.removeClass("group");
          }
          if (o.data && o.data.length) {
            ref = o.data;
            for (i = 0, len = ref.length; i < len; i++) {
              item = ref[i];
              item.self = item.uid === uid;
              chat_log_wrap.append(chat_log_item_tpl(item));
            }
          }
          chat_log_wrap.show();
          chat_log_wrap.scrollToLast();
          active.removeClass("active");
          self.addClass("active").resetLogNum();
          return type_write.val("");
        }
      });
    });
    timer = null;
    return $(".friend-list-wrap .search").on("keyup", function(e) {
      var self;
      if (timer) {
        clearTimeout(timer);
      }
      self = $(this);
      return timer = setTimeout(function() {
        var reg, val;
        val = $.trim(self.val());
        reg = new RegExp(val, "i");
        if (val) {
          return friends_wrap.find(".item").each(function() {
            var name;
            name = $(this).find(".name").text();
            if (reg.test(name)) {
              return $(this).show();
            } else {
              return $(this).hide();
            }
          });
        } else {
          return friends_wrap.find(".item").show();
        }
      }, 300);
    });
  });

}).call(this);
