'use strict';

var exec        = require('exec');
var Promise     = require('../ext/promise');
var SilentError = require('../errors/silent');

var GitUtils = function(options) {
  this.project = options.project;
};

GitUtils.prototype.hash = function() {
  var root = this.project.root;

  return new Promise(function(resolve, reject) {
    exec('git rev-parse --short=10 HEAD', { cwd: root }, function(error, out, code) {
      if (error) {
        reject(new SilientError(error));
      }

      resolve(out);
    });
  });
};

GitUtils.prototype.branch = function() {
  var root = this.project.root;

  return new Promise(function(resolve, reject) {
    exec('git rev-parse --abbrev-ref HEAD', { cwd: root }, function(error, out, code) {
      if (error) {
        reject(new SilientError(error));
      }

      resolve(out);
    });
  });
};

module.exports = GitUtils;
