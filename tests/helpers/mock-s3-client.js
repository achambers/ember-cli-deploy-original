'use strict';

function MockS3Client() { };

function resolvedUpload(params, callback) {
  this.params = params;
  callback(null, {});
};

function rejectedUpload(params, callback) {
  this.params = params;
  callback('Mock error message');
};

MockS3Client.prototype.putObject = resolvedUpload;

MockS3Client.prototype.resolveUpload = function() {
  MockS3Client.prototype.putObject = resolvedUpload;
};

MockS3Client.prototype.rejectUpload = function() {
  MockS3Client.prototype.putObject = rejectedUpload;
};

module.exports = MockS3Client;
