"use strict";

exports.__esModule = true;
exports.default = {
  on: true, //是否开启 WebSocket
  type: "socket.io",
  allow_origin: "",
  sub_protocal: "",
  adapter: undefined,
  path: "", //url path for websocket
  messages: {
    "open": "chat/index/connect",
    "close": "chat/index/close"
  }
  // messages: {
  //   open: 'home/index/open',
  //   close: 'home/index/close',
  //   chat: 'home/index/chat',
  //   typing: 'home/index/typing',
  //   stoptyping: 'home/index/stoptyping',
  //   adduser: 'home/index/adduser'
  // }
};
//# sourceMappingURL=websocket.js.map