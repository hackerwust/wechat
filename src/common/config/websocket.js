export default {
  on: true, //是否开启 WebSocket
  type: "socket.io",
  allow_origin: "",
  sub_protocal: "",
  adapter: undefined,
  path: "", //url path for websocket
  messages: {
    "open": "chat/index/connect",
    "disconnect": "chat/index/close",
    "sendmsg": "chat/index/getmsg"
  }
};