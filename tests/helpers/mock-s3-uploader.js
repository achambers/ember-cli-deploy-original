'use strict';

var Promise     = require('ember-cli/lib/ext/promise');

function MockS3Uploader(params) {
  MockS3Uploader.params = params;
};

MockS3Uploader.prototype.uploadFile = function(params) {
  MockS3Uploader.paths = MockS3Uploader.paths || [];

  MockS3Uploader.paths.push(params.filePath);

  return Promise.resolve(params.filePath);
};

module.exports = MockS3Uploader;
