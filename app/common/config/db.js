'use strict';
/**
 * db config
 * @type {Object}
 */

exports.__esModule = true;
exports.default = {
  type: 'mongo',
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '27017',
      database: 'wechat',
      user: '',
      password: '',
      prefix: '',
      encoding: 'utf8'
    },
    mongo: {
      host: '127.0.0.1',
      port: '27017',
      database: 'wechat',
      user: '',
      password: '',
      prefix: '',
      encoding: 'utf8'
    }
  }
};
//# sourceMappingURL=db.js.map