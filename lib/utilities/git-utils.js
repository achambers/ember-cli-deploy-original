'use strict';

var fs   = require('fs');
var path = require('path');

var GitUtils = function(options) {
  options = options || {};

  this.project      = options.project;
  var gitRoot       = options.gitRoot || this.project.root;
  this.gitPath      = path.join(gitRoot, '.git');
  this.headFilePath = path.join(this.gitPath, 'HEAD');
};

GitUtils.prototype.hash = function() {
  var gitPath      = this.gitPath;
  var headFilePath = this.headFilePath;

  try {
    if (fs.existsSync(headFilePath)) {
      var branchSHA;
      var headFile = fs.readFileSync(headFilePath, {encoding: 'utf8'});
      var refPath = headFile.split(' ')[1];

      if (refPath) {
        var branchPath = path.join(gitPath, refPath.trim());
        branchSHA  = fs.readFileSync(branchPath);
        return branchSHA.toString().slice(0, 10);
      }
    }
  } catch (err) {
    console.error(err.stack);
  }
};

GitUtils.prototype.branch = function() {
  var gitPath      = this.gitPath;
  var headFilePath = this.headFilePath;

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
