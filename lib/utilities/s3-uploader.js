'use strict';

var AWS     = require('aws-sdk');
var fs      = require('fs');
var chalk   = require('chalk');
var mime    = require('mime');
var Promise = require('ember-cli/lib/ext/promise');

function S3Uploader(options) {
  options = options || {};

  this.bucket = options.bucket;

  if (options.client) {
    this.client = options.client;
  } else {
    this.client = new AWS.S3({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      region: options.region
    });
  }
};

S3Uploader.prototype.uploadFile = function(options) {
  options = options || {};

  var bucket = this.bucket;
  var filePath = options.filePath;
  var fullPath = options.cwd + '/' + filePath;

  if (!fs.existsSync(fullPath)) {
    var message = chalk.red('File at path: \'' + fullPath + '\' does not exist\n');

    return Promise.reject(message);
  }

  var data = fs.readFileSync(fullPath);
  var contentType = mime.lookup(fullPath);

  var params = {
    Bucket: bucket,
    ACL: 'public-read',
    Body: data,
    ContentType: contentType,
    Key: filePath
  };

  var client = this.client;

  return new Promise(function(resolve, reject) {
    client.putObject(params, function(error, data) {
      if (error) {
        reject(error, filePath);
      } else {
        resolve(filePath);
      }
    });
  });
};

module.exports = S3Uploader;
