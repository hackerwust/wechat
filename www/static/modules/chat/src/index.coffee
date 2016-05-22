define [
  'jquery'
  'jade'
  'socket'
  'text!chat/tpl/chat-log-item.jade'
  'text!chat/tpl/friend-item.jade'
  ], ($, jade, socket, chat_log_item_tpl, friend_item_tpl) -> 
    
    $.fn.extend
      scrollToLast: ()->
        self = $(this)
        self.scrollTop(20000000)
        return self
      resetLogNum: ()->
        log_num = $(this).find(".log-num")
        log_num.addClass("hide").text("0")
        return $(this)
      incLogNum: ()->
        log_num = $(this).find(".log-num")
        log_num.removeClass("hide")
        num = parseInt(log_num.text() || 10) || 0
        num = num + 1
        if num > 99 then num = "99+"
        log_num.text(++num).addClass("shake")
        return $(this)
      resetForm: ()->
        photo = $(this).find(".photo")
        photo.prop("src", photo.attr("_src"))
        $(this).find("input").each ()->
          $(this).val($(this).attr("default"))
        return $(this)

    formatTime = (date, fmt = 'M月dd日 hh:mm') ->
      o = 
        'M+': date.getMonth() + 1
        'd+': date.getDate()
        'h+': date.getHours()
        'm+': date.getMinutes()
        's+': date.getSeconds()
        'q+': Math.floor((date.getMonth() + 3) / 3)
        'S': date.getMilliseconds()
      if /(y+)/.test(fmt)
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - (RegExp.$1.length)))
      for k of o
        if new RegExp('(' + k + ')').test(fmt)
          fmt = fmt.replace(RegExp.$1, if RegExp.$1.length == 1 then o[k] else ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    
    chat_log_item_tpl = jade.compile(chat_log_item_tpl)
    friend_item_tpl = jade.compile(friend_item_tpl)
    edit_wrap = $(".self-info-edit-wrap")
    self_info_wrap = $(".self-info-wrap")
    friends_wrap = $(".friends-wrap")
    chat_window = $(".chat-window")
    chat_log_wrap = $(".chat-log-wrap")
    type_write = $(".type-write-wrap")
    photo_file = $(".photo-file")
    uid = parseInt(self_info_wrap.attr('uid'), 10) || 0
    photo = self_info_wrap.find(".photo").prop("src")
    
    chat_log_wrap.scrollToLast()

    self_info_wrap.on "click", ".photo", (e)->
      edit_wrap.removeClass("hide")

    edit_wrap.on "click", ".close-btn", (e)->
      edit_wrap.addClass("hide").resetForm()

    edit_wrap.on "click", ".photo", (e)->
      photo_file.trigger("click")
    
    edit_wrap.on "change", ".photo-file", (e)->
      file = this.files[0]
      form_data = new FormData()
      form_data.append("photo", file)
      form_data.append("uid", uid)
      url = URL.createObjectURL(file)
      $.ajax(
        url: "/chat/index/changephoto"
        type: "post"
        data: form_data
        contentType: false
        processData: false
        ).always (o)->
          console.log o.path
          if o && o.status is "success"
            photo_file.val("")
            edit_wrap.find(".photo").prop("src", url).attr("_src", url)
            self_info_wrap.find(".photo").prop("src", url)
            edit_wrap.find(".remind-msg").text("上传成功")
          else if o && o.reason
            edit_wrap.find(".remind-msg").text(o.reason)
          else 
            edit_wrap.find(".remind-msg").text("上传失败")

    edit_wrap.on "click", ".save", (e)->
      name = edit_wrap.find(".name").val()
      pass = edit_wrap.find(".pass").val()
      $.post("/chat/index/save", {name: name, pass: pass, uid: uid}).always (o)->
        if o && o.status is "success"
          edit_wrap.find(".remind-msg").text("保存成功")
          self_info_wrap.find(".name").text(name)
          edit_wrap.find(".name").attr("default", name) 
          edit_wrap.find(".pass").attr("default", pass)
        else
          edit_wrap.find(".remind-msg").text("保存失败")
     
    if !uid
      alert("uid错误，请重新登录")
      window.location.href= "/chat/index/dologout"

    getFriendActive = ()->
      active = friends_wrap.find(".active")
      if active.length then return active else return null
    
    host = window.location.host # 包括端口
    hostname = window.location.hostname # 不包括端口
    socket = socket(host)
    
    socket.on "online", (data)->
      if data && data.uinfo && data.uinfo._id && data.uinfo._id!= uid
        friend = friends_wrap.find("[uid='#{data.uinfo._id}']").find(".status")
        if friend.length 
          friend.removeClass("offline")
        else
          friends_wrap.append($(friend_item_tpl(data.uinfo)))

    socket.on "offline", (data)->
      if data && data.uinfo && data.uinfo._id && data.uinfo._id!= uid
        friend = friends_wrap.find("[uid='#{data.uinfo._id}']").find(".status")
        if friend.length then friend.addClass("offline")
    
    socket.on "newlog", (data)->
      if !data || !data.uid then return 
      active = getFriendActive()
      source = friends_wrap.find("[uid='#{data.uid}']")
      data.self = false
      if data.to == "group" #群消息
        group = friends_wrap.find(".group")
        if group.hasClass("active")
          chat_log_wrap.append(chat_log_item_tpl(data))
          chat_log_wrap.scrollToLast()
        else
          group.incLogNum() 
      else 
        if source.hasClass("active") 
          chat_log_wrap.append(chat_log_item_tpl(data))
          chat_log_wrap.scrollToLast()
        else
          source.incLogNum()

    type_write.on "keydown", (e)->
      self = $(this)
      val = self.val()
      active = getFriendActive()
      other_id = active.attr("uid")
      if !val then return 
      if e.which is 13 or e.keyCode == 13
        self.val("")
        data = 
          self: true
          uid: uid
          time: formatTime(new Date())
          photo: photo
          content: val
        chat_log_wrap.append(chat_log_item_tpl(data))
        chat_log_wrap.scrollToLast()
        delete data.self
        delete data.photo
        socket.emit("sendmsg", {data: data, other: other_id});
          
    friends_wrap.on "click", ".item", (e)->
      self = $(this)
      if self.hasClass("active") then return 
      active = getFriendActive()
      other_id = self.attr("uid")
      $.post("/chat/index/getlog", {uid: uid, other: other_id}).always (o)->
        if o && o.status == "success"
          chat_log_wrap.hide().empty()
          if o.data && o.data.length
            for item in o.data
              item.self = item.uid == uid
              chat_log_wrap.append(chat_log_item_tpl(item))
          chat_log_wrap.show()
          chat_log_wrap.scrollToLast()
          active.removeClass("active")
          self.addClass("active").resetLogNum()
          type_write.val("")
    



      
    



    