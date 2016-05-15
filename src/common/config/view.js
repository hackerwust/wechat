'use strict';
/**
 * template config
 */
export default {
  type: 'jade',
  content_type: 'text/html',
  file_ext: '.jade',
  file_depr: '_',
  root_path: think.ROOT_PATH + '/view',
  adapter: {
    ejs: {}
  }
};