'use strict';

var fs = require("fs");

import Base from './base.js';

export default class extends Base {
  init(...args) {
    super.init(...args);
  }

  indexAction() {
    return this.display();
  }
  
}