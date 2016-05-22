define [
  'jquery'
  'jade'
  ], ($, jade) -> 
    login_wrap = $(".login-wrap")
    register_wrap = $(".register-wrap")
    
    $.fn.extend 
      form_empty: ()->
        $(this).find("input").val("")
        $(this).find(".msg").text("")
        return $(this)
      fill_form: (o)->
        self = $(this)
        for key of o
          self.find(key).val(o[key])
        return self
      replace_chinese: ()->
        self = $(this)
        setTimeout(()->
          self.val(self.val().replace(/[\u4e00-\u9fa5]/g,''))
        0)
        return self
    throttle = (fn, speed)->
      speed = speed || 200
      timer = null
      return ()->
        timer && clearTimeout(timer)
        args = arguments
        timer = setTimeout(()->
          fn && fn.call(null, args)
        speed)
    
    register_wrap.on "click", ".submit", (e)->

    register_wrap.on "click", ".to-login", (e)->
      register_wrap.form_empty().fadeOut("fast")
      login_wrap.form_empty().fadeIn("fast")

    register_wrap.on "keyup", ".pass-control", (e)->
      $(this).replace_chinese()

    register_wrap.on "keyup", "input", (e)->
      name = $.trim register_wrap.find(".name").val()
      pass = $.trim register_wrap.find(".pass").val()
      confirm_pass = $.trim register_wrap.find(".confirm-pass").val()
      val = $.trim $(this).val()
      color = if val then "rgba(0, 0, 0, 0.3)" else "red"
      $(this).css("borderColor", color)
      if name && pass && confirm_pass && pass == confirm_pass then register_wrap.find(".msg").text("")

    register_wrap.on "click", ".submit", (e)->
      name = register_wrap.find(".name")
      pass = register_wrap.find(".pass")
      confirm_pass = register_wrap.find(".confirm-pass")
      msg = register_wrap.find(".msg")
      for item in [name, pass, confirm_pass]
        if !$.trim(item.val())
          register_wrap.find(".msg").text("不能为空") 
          return item[0].focus()
      name_val = $.trim(name.val())
      pass_val = $.trim(pass.val())
      confirm_pass_val = $.trim(confirm_pass.val())
      if pass_val != confirm_pass_val 
        confirm_pass[0].focus()
        return msg.text("两次密码不相等")
      $.post('/home/index/adduser', {name: name_val, pass: pass_val}).always (o)->
        if o && o.status is "success" 
          register_wrap.form_empty()
          msg.text("您的帐号为#{o.uid},去登陆吧")
        else 
          msg.text("不好意思，注册失败")

    login_wrap.on "click", ".to-register", (e)->
      register_wrap.form_empty().fadeIn("fast")
      login_wrap.form_empty().fadeOut("fast")

    login_wrap.on "keyup", "input", (e)->
      id = $.trim login_wrap.find(".id").val()
      pass = $.trim login_wrap.find(".pass").val()
      msg = login_wrap.find(".msg")
      val = $.trim $(this).val()
      color = if val then "rgba(0, 0, 0, 0.3)" else "red"
      $(this).css("borderColor", color)
      if id && pass then return msg.text("")

    getphoto = ()->
      photo = $(".login-wrap .user-photo")
      id_input = $(".login-wrap .id")
      uid = $.trim id_input.val()
      if !uid then return
      $.get("/home/index/getphoto?uid=#{uid}").always (o)->
        if o && o.status is "success" && o.path
          photo.prop("src", o.path)
        else 
          photo.prop("src", "/static/tmp/photo/default.jpg")

    login_wrap.on "keyup", ".id", throttle(getphoto)

    login_wrap.on "click", ".login-btn", (e)->
      id = login_wrap.find(".id")
      pass = login_wrap.find(".pass")
      msg = login_wrap.find(".msg")
      for key, item of {"账号": id, "密码": pass}
        if !$.trim item.val()
          item[0].focus()
          return msg.text("#{key}不能为空")
      $.post("/home/index/dologin", {id: $.trim(id.val()), pass: $.trim(pass.val())}).always (o)->
        if o && o.status == "failed" 
          msg.text("登录失败")
        else 
          msg.text("登录成功")
          setTimeout(()->
            window.location.href = "/chat/index/index"
          1000)


