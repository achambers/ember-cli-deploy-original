'use strict';

var fs   = require('fs');
var path = require('path');
var execSync = require('execSync');

var GitUtils = function(options) {
  this.project = options.project;
};

GitUtils.prototype.hash = function() {
  var root = this.project.root;

  try {
    return execSync.exec('git rev-parse --short=10 HEAD', { cwd: root } ).stdout.split('\n').join('');
  } catch (err) {
    console.error(err.stack);
  }
};

GitUtils.prototype.branch = function() {
  var rootPath       = this.project.root;
  var gitPath        = path.join(rootPath, '.git');
  var headFilePath   = path.join(gitPath, 'HEAD');

  try {
    if (fs.existsSync(headFilePath)) {
      var headFile = fs.readFileSync(headFilePath, {encoding: 'utf8'});
      var parts = headFile.split('/');

      if (parts.length > 1) {
        var branchName = parts.slice(-1)[0].trim();

        return branchName;
      }
    }
  } catch (err) {
    console.error(err.stack);
  }
};

module.exports = GitUtils;
