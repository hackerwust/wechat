require.config
  baseUrl: "/static/modules"
  paths:
    jquery: "common/jquery-2.1.1.min"
    jade: "common/jade"
    bootstrap: "common/bootstrap/js/bootstrap.min"
    jade_runtime: "common/jade_runtime"
    socket: "common/socket.io"
  shim:
    jade: 
      exports: "jade"
    bootstrap: 
      exports: "bootstrap"
      deps: ['jquery']