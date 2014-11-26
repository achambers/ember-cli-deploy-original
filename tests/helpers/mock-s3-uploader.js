'use strict';

var Promise     = require('../../lib/ext/promise');

function MockS3Uploader(params) {
  MockS3Uploader.params = params;
};

function resolvedUpload(params) {
  MockS3Uploader.paths = MockS3Uploader.paths || [];

  MockS3Uploader.paths.push(params.filePath);

  return Promise.resolve(params.filePath);
};

function rejectedUpload(params) {
  return Promise.reject('Upload failed: ' + params.filePath);
};

MockS3Uploader.prototype.uploadFile = resolvedUpload;

MockS3Uploader.prototype.rejectUpload = function() {
  MockS3Uploader.prototype.uploadFile = rejectedUpload;
};

module.exports = MockS3Uploader;
